
var through = require('through2'),
    along = require('turf-along'),
    distance = require('turf-line-distance');

// https://github.com/turf-junkyard/turf-along
// https://github.com/turf-junkyard/turf-line-distance
var UNIT = 'degrees';

function centroid(){
  return through.obj( function( geojson, _, next ){
    try {
      var dist = distance( geojson, UNIT );
      var point = along( geojson, dist/2, UNIT );
      geojson.properties.centroid = point.geometry.coordinates;
      this.push( geojson );
    } catch( e ){
      console.error( 'polyline centroid error', e );
    }
    next();
  });
}

module.exports = centroid;
