
var through = require('through2'),
    centroid = require('../../stream/centroid');

module.exports.tests = {};

// interface
module.exports.tests.interface = function(test, common) {
  test('interface: stream', function(t) {
    var stream = centroid();
    t.equal(typeof stream, 'object', 'valid stream');
    t.equal(typeof stream._read, 'function', 'valid readable');
    t.equal(typeof stream._write, 'function', 'valid writeable');
    t.end();
  });
};

// visual: https://gist.github.com/missinglink/43880617762ca7b8893f1e0ee498a9a9
module.exports.tests.centroid = function(test, common) {
  test('centroid', function(t) {

    var stream = centroid();
    var expected = [ -117.1275530670822, 44.017448040349564 ];
    var geojson = {
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
      t.deepEqual( actual.properties.centroid, expected, 'valid centroid' );
      t.deepEqual( actual.properties.distance, 885.5741, 'valid distance meta data' );
      next();
    }

    // run test
    stream.pipe( through.obj( assert, function(){ t.end(); } ));
    stream.write(geojson);
    stream.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('centroid: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
