
var through = require('through2'),
    wrap = require('../src/wrap');

function unwrap(){
  return through.obj( function( geojson, _, next ){
    try {

      // unwrap coordinates which go around the globe
      geojson.coordinates = geojson.coordinates.map( function( coord ){
        var w = wrap( coord[1], coord[0] );
        return [ w.lon, w.lat ];
      });

      this.push( geojson );

    } catch( e ){
      console.error( 'polyline unwrap error', e );
    }

    next();
  });
}

module.exports = unwrap;
