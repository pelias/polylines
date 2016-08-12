var through = require('through2'),
    wofAdminLookup = require('pelias-wof-admin-lookup');

function adminLookup() {

  var config = require('pelias-config').generate();

  // admin lookup enabled
  if( config.imports.polyline && config.imports.polyline.adminLookup ){
    var pipResolver = wofAdminLookup.createLocalWofPipResolver();
    return wofAdminLookup.createLookupStream(pipResolver);
  } else {
    return through.obj();
  }
}

module.exports = adminLookup;
