
var through = require('through2'),
    parser = require('../../stream/parser');

module.exports.tests = {};

// interface
module.exports.tests.interface = function(test, common) {
  test('interface: stream', function(t) {
    var stream = parser();
    t.equal(typeof stream, 'object', 'valid stream');
    t.equal(typeof stream._read, 'function', 'valid readable');
    t.equal(typeof stream._write, 'function', 'valid writeable');
    t.end();
  });
};

// parse
module.exports.tests.parse = function(test, common) {
  test('parse: simple row', function(t) {

    var stream = parser(6);
    var row = ['wuw}rAlbxk~Evb@]??n_C\??tJ?f~LiB','Freese Lane'].join('\0');
    var expected = {
      'type': 'LineString',
      'properties': {
        'name': 'Freese Lane'
      },
      'coordinates': [
        [ -117.125687, 44.020076 ],
        [ -117.125672, 44.019504 ],
        [ -117.125672, 44.019504 ],
        [ -117.125672, 44.017448 ],
        [ -117.125859, 44.017448 ],
        [ -117.133015, 44.017448 ],
        [ -117.133015, 44.017501 ]
      ]
    };

    // test assertions
    function assert( actual, enc, next ){
      t.deepEqual( actual, expected, 'valid row' );
      next();
    }

    // run test
    stream.pipe( through.obj( assert, function(){ t.end(); } ));
    stream.write(row);
    stream.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('parser: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
