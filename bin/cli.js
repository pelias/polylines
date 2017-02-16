#!/usr/bin/env node

var fs = require('fs'),
    tty = require('tty'),
    path = require('path'),
    through = require('through2'),
    config = require('pelias-config'),
    dbclient = require('pelias-dbclient'),
    argv = require('minimist')(process.argv.slice(2)),
    pipeline = require('../stream/pipeline'),
    _ = require('lodash'),
    logger = require('pelias-logger').get('polyline');

// cli help
if( argv.help ){
  console.error( 'Usage: cli.js [options]\nOptions:\n' );
  console.error( '  --file           read from file instead of stdin');
  console.error( '  --config         read filename from pelias config (overrides --file)');
  console.error( '  --pretty         indent output (stdout only)');
  console.error( '  --db             save to elasticsearch instead of printing to stdout\n');
  process.exit(0);
}

// stringify sink
var stringify = through.obj( function( obj, _, next ){
  process.stdout.write( JSON.stringify( obj, null, !!argv.pretty ? 2 : 0 ) + '\n' );
  next();
});

if( !!argv.config ){
  var cfg = config.generate();

  if (_.has(cfg, 'imports.polyline.adminLookup')) {
    logger.info('imports.polyline.adminLookup has been deprecated, ' +
                'enable adminLookup using imports.adminLookup.enabled = true');
  }

  if( cfg.imports.polyline && cfg.imports.polyline.datapath && cfg.imports.polyline.files[0] ){
    argv.file = path.join( cfg.imports.polyline.datapath, cfg.imports.polyline.files[0] );
  }
}

// check file exists
if( !!argv.file ){
  try { fs.lstatSync( argv.file ); }
  catch( e ){
    console.error( e.message );
    process.exit(1);
  }
}

// input is from stdin and it's attached to TTY instead of a pipe
else if( tty.isatty( process.stdin ) ){
  console.error( 'no data piped to stdin' );
  process.exit(1);
}

// read from stdin or file
var input = argv.file ? fs.createReadStream( argv.file ) : process.stdin;

// write to stdout or elasticsearch
var output = !!argv.db ? dbclient() : stringify;

// run the importer
pipeline( input, output );
