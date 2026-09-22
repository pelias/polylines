const through = require('through2');
const polyline = require('@mapbox/polyline');
const logger = require('pelias-logger').get('polyline');

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
        geojson.bbox = bbox( geojson.coordinates );

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

// bounding box of a list of coordinates, as [minLon, minLat, maxLon, maxLat]
function bbox( coordinates ){
  let minLon = Infinity, minLat = Infinity, maxLon = -Infinity, maxLat = -Infinity;
  for( let i = 0; i < coordinates.length; i++ ){
    const lon = coordinates[i][0], lat = coordinates[i][1];
    if( lon < minLon ){ minLon = lon; }
    if( lon > maxLon ){ maxLon = lon; }
    if( lat < minLat ){ minLat = lat; }
    if( lat > maxLat ){ maxLat = lat; }
  }
  return [ minLon, minLat, maxLon, maxLat ];
}

// each connected road can have one or more names
// we select one name to be the default.
function selectName( names ){
  // remove URLs then return the longest name
  return names
    .map(name => name.replace(/(?:https?|ftp):\/\/\S*/g, '').trim())
    .sort((a, b) => b.length - a.length)
    .at(0);
}

module.exports = parser;
