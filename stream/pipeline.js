const split = require('split2');
const model = require('pelias-model');
const parser = require('./parser');
const unwrap = require('./unwrap');
const centroid = require('./centroid');
const document = require('./document');
const adminLookup = require('pelias-wof-admin-lookup').create;

function pipeline( streamIn, streamOut ){
  return streamIn
    .pipe( split() )
    .pipe( parser( 6 ) )
    .pipe( unwrap() )
    .pipe( centroid() )
    .pipe( document( 'openstreetmap', 'street', 'polyline' ) )
    .pipe( adminLookup() )
    .pipe( model.createDocumentMapperStream() )
    .pipe( streamOut );
}

module.exports = pipeline;
