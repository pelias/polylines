
var split = require('split'),
    through = require('through2'),
    parser = require('./parser'),
    centroid = require('./centroid');

function decode( streamIn, streamOut ){
  return streamIn
    .pipe( split() )
    .pipe( parser() )
    .pipe( centroid() )
    .pipe( through.obj( function( obj, _, next ){
      next( null, JSON.stringify( obj, null, 2 ) );
    }))
    .pipe( streamOut );
}

module.exports = decode;

decode( process.stdin, process.stdout );
