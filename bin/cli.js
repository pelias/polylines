
var fs = require('fs'),
    through = require('through2'),
    dbclient = require('pelias-dbclient'),
    argv = require('minimist')(process.argv.slice(2)),
    pipeline = require('../stream/pipeline');

// cli help
if( argv.help ){
  console.error( 'Usage: cli.js [options]\nOptions:\n' );
  console.error( '  --file           read from file instead of stdin');
  console.error( '  --pretty         indent output\n');
  console.error( '  --db             save to elasticsearch instead of printing to stdout\n');
  process.exit(0);
}

// stringify sink
var stringify = through.obj( function( obj, _, next ){
  process.stdout.write( JSON.stringify( obj, null, !!argv.pretty ? 2 : 0 ) + '\n' );
  next();
});

// read from stdin or file
var input = argv.file ? fs.createReadStream( argv.file ) : process.stdin;

// write to stdout or elasticsearch
var output = !!argv.db ? dbclient() : stringify;

// run the importer
pipeline( input, output );
