
var fs = require('fs'),
    through = require('through2'),
    pipeline = require('../../stream/pipeline');

module.exports.tests = {};

// use default pelias config
function setup(){
  var defaults = JSON.stringify( require('pelias-config').defaults, null, 2 );
  fs.writeFileSync('/tmp/tmpPelias.json', defaults, { encoding: 'utf8' });
  process.env.PELIAS_CONFIG = '/tmp/tmpPelias.json';
}

// clean up
function teardown(){
  delete process.env.PELIAS_CONFIG;
  fs.unlinkSync('/tmp/tmpPelias.json');
}

// interface
module.exports.tests.interface = function(test, common) {

  test('interface: stream', function(t) {
    setup();
    var stream = pipeline( through(), through() );
    teardown();
    t.equal(typeof stream, 'object', 'valid stream');
    t.equal(typeof stream._read, 'function', 'valid readable');
    t.equal(typeof stream._write, 'function', 'valid writeable');
    t.end();
  });
};

module.exports.tests.end_to_end = function(test, common) {

  test('pipeline: end-to-end', function(t) {

    var fixture = fs.createReadStream(__dirname + '/../fixture/example.raw');
    var expected = fs.readFileSync(__dirname + '/../fixture/example.json', { encoding: 'utf8' });
    var actual = [];

    // parse expected fixture
    expected = expected.split('\n')
                       .filter(function(a){ return a; })
                       .map(JSON.parse);

    // store pipeline output in array and compare to fixture
    var sink = through.obj( function( data, _, next ){
      actual.push( data );
      next();
    }, function assert(){
      t.deepEqual( actual, expected, 'valid import' );
      t.end();
    });

    // run pipeline
    setup();
    pipeline( fixture, sink );
    teardown();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('pipeline: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
