const _ = require('lodash');
const through = require('through2');
const model = require('pelias-model');
const logger = require('pelias-logger').get('polyline');

function document( source, layer, idprefix ){

  // validate args
  if( _.isEmpty(source) ){ throw new Error('invalid source'); }
  if( _.isEmpty(layer) ){ throw new Error('invalid layer'); }
  if( _.isEmpty(idprefix) ){ throw new Error('invalid idprefix'); }

  /**
   * Used to track the UID of individual records passing through the stream
   * created by `document()`.  See `peliasModel.Document.setId()` for
   * information about UIDs.
   */
  var uid = 0;

  return through.obj( function( geojson, _, next ){
    try {

      // uniq id
      var id = [ idprefix, uid++ ].join(':');

      // create new instance of pelias/model
      var doc = new model.Document( source, layer, id );

      // name
      doc.setName( 'default', geojson.properties.name );

      // street
      doc.setAddress( 'street', geojson.properties.name );

      // category
      doc.addCategory( 'address' );
      doc.addCategory( 'address:street' );

      // centroid
      var prop = geojson.properties.centroid;
      doc.setCentroid({ lon: prop[0], lat: prop[1] });

      // distance meta data (in meters)
      doc.setMeta( 'distance', geojson.properties.distance );

      // bounding box
      doc.setBoundingBox({
        upperLeft: {
          lat: geojson.bbox[3],
          lon: geojson.bbox[0]
        },
        lowerRight: {
          lat: geojson.bbox[1],
          lon: geojson.bbox[2]
        }
      });

      // push downstream
      this.push( doc );

    } catch( e ){
      logger.error( 'polyline document error', e );
    }

    next();
  });
}

module.exports = document;
