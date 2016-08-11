
var fs = require('fs'),
    through = require('through2'),
    argv = require('minimist')(process.argv.slice(2)),
    pipeline = require('../stream/pipeline'),
    logger = require('pelias-logger').get('polyline');

// cli help
if( argv.help ){
  logger.error( 'Usage: cli.js [options]\nOptions:\n' );
  logger.error( '  --file           read from file instead of stdin');
  logger.error( '  --pretty         indent output\n');
  process.exit(0);
}

// stringify sink
var stringify = through.obj( function( obj, _, next ){
  process.stdout.write( JSON.stringify( obj, null, !!argv.pretty ? 2 : 0 ) + '\n' );
  next();
});

// decode from stdin or file
pipeline( argv.file ? fs.createReadStream( argv.file ) : process.stdin, stringify );
