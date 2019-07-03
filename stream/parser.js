
var through = require('through2'),
    polyline = require('polyline'),
    extent = require('geojson-extent'),
    logger = require('pelias-logger').get('polyline');

/**
  note: you must select the same 'precision' value that was used when encoding
  the polyline.

  valhalla: 6
  osrm: 5

  parser expects data to be:
   - newline terminated with \n
   - column delimited with \0
   - in the format: {encoded_polyline}\0{name1}\0{name2}...\n
**/
function parser( precision ){
  return through.obj( function( row, _, next ){
    var cols = row.split('\0').filter(function(x){ return x; });
    try {
      // must contain a polyline and at least one name
      if( cols.length > 1 ){

        // decode polyline
        var geojson = polyline.toGeoJSON(cols[0], precision);

        const name = selectName(cols.slice(1));

        // skip record if there is no valid name
        if (!name) {
          return next();
        }

        // select name
        geojson.properties = { name: name };

        // compute bbox
        geojson = extent.bboxify( geojson );

        this.push( geojson );
      } else if( cols.length ) {
        logger.error( 'invalid polyline row', row );
      }
    } catch( e ){
      logger.error( 'polyline parsing error', e );
    }

    next();
  });
}

// each connected road can have one or more names
// we select one name to be the default.
function selectName( names ){
  // filter out URLs
  // then return the longest name
  // @todo: can we improve this logic?
  return names.filter( function ( name) {
    return !name.match(/^http(s)?:\/\//);
  }).reduce( function( a, b ){
    return a.length > b.length ? a : b;
  }, '');
}

module.exports = parser;
