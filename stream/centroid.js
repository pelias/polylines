
var through = require('through2'),
    along = require('turf-along'),
    distance = require('turf-line-distance');

// https://github.com/turf-junkyard/turf-along
// https://github.com/turf-junkyard/turf-line-distance
var UNIT = 'km';

function centroid(){
  return through.obj( function( geojson, _, next ){
    try {

      // total distance in km
      var dist = distance( geojson, UNIT );
      geojson.properties.distance = dist;

      // interpolate middle of path
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
