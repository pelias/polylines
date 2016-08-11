var through = require('through2'),
    peliasConfig = require('pelias-config').generate(),
    wofAdminLookup = require('pelias-wof-admin-lookup');

function adminLookup(config, adminLookup) {

  config = config || peliasConfig;
  adminLookup = adminLookup || wofAdminLookup;

  // disable adminLookup with empty config
  if (!config.imports || !config.imports.polyline) {
    return through.obj();
  }

  // admin lookup enabled
  if (config.imports.polyline.adminLookup) {
    var pipResolver = adminLookup.createLocalWofPipResolver();
    return adminLookup.createLookupStream(pipResolver);
  } else {
    return through.obj();
  }
}

module.exports = adminLookup;
