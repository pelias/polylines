
var through = require('through2'),
    polyline = require('polyline');

function parser(){
  return through.obj( function( row, _, next ){
    var cols = row.split('\0');
    try {
      var names = cols.slice(1);
      if( names.length ){
        var geojson = polyline.toGeoJSON(cols[0]);
        geojson.properties = { name: names[0] };
        this.push( geojson );
      }
    } catch( e ){
      console.error( 'polyline parsing error', e );
    }
    next();
  });
}

module.exports = parser;
