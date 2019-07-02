#!/usr/bin/env node

/**
 * re-encode a polyline file generated with precison 5 to precision 6
 */

const fs = require('fs');
const tty = require('tty');
const through = require('through2');
const argv = require('minimist')(process.argv.slice(2));
const polyline = require('polyline');
const split = require('split');
const precision = { from: 5, to: 6 };

// cli help
if (argv.help) {
  console.error('Usage: reencode.js [options]\nOptions:\n');
  console.error('  --file           read from file instead of stdin');
  process.exit(0);
}

// check file exists
if (!!argv.file) {
  try { fs.lstatSync(argv.file); }
  catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

// input is from stdin and it's attached to TTY instead of a pipe
else if (tty.isatty(process.stdin)) {
  console.error('no data piped to stdin');
  process.exit(1);
}

// read from stdin or file
var input = argv.file ? fs.createReadStream(argv.file) : process.stdin;

return input
  .pipe(split())
  .pipe(through.obj((row, _, next) => {
    let cols = row.split('\0');
    if (cols.length < 2) { console.error( 'invalid polyline row', row ); }

    let decoded = polyline.decode(cols[0], precision.from);
    let encoded = polyline.encode(decoded, precision.to);

    console.log([encoded].concat(cols.slice(1)).join('\0'));
    next();
  }));
