const through = require('through2');
const along = require('@turf/along').default;
const length = require('@turf/length').default;
const logger = require('pelias-logger').get('polyline');

// https://github.com/turf-junkyard/turf-along
// https://github.com/turf-junkyard/turf-line-distance
var UNIT = 'kilometers';

function centroid(){
  return through.obj( function( geojson, _, next ){
    try {

      // total distance in meters
      var dist = length( geojson, UNIT );
      geojson.properties.distance = parseFloat((dist * 1000).toFixed(4));

      // interpolate middle of path
      var point = along( geojson, dist/2, UNIT );
      geojson.properties.centroid = point.geometry.coordinates;

      this.push( geojson );

    } catch( e ){
      logger.error( 'polyline centroid error', e );
    }

    next();
  });
}

module.exports = centroid;
