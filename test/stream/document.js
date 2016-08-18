
var through = require('through2'),
    model = require('pelias-model'),
    document = require('../../stream/document');

module.exports.tests = {};

// interface
module.exports.tests.interface = function(test, common) {
  test('interface: stream', function(t) {
    var stream = document( 'a', 'b', 'c' );
    t.equal(typeof stream, 'object', 'valid stream');
    t.equal(typeof stream._read, 'function', 'valid readable');
    t.equal(typeof stream._write, 'function', 'valid writeable');
    t.end();
  });
};

module.exports.tests.document = function(test, common) {
  test('document', function(t) {

    var stream = document( 'openstreetmap', 'street', 'polyline' );
    var geojson = {
      'type': 'LineString',
      'properties': {
        'name': 'Freese Lane',
        'centroid': [ -117.1275530670822, 44.017448040349564 ],
        'distance': 885.5741
      },
      'coordinates': [
        [ -117.125687, 44.020076 ],
        [ -117.125672, 44.019504 ],
        [ -117.125672, 44.019504 ],
        [ -117.125672, 44.017448 ],
        [ -117.125859, 44.017448 ],
        [ -117.133015, 44.017448 ],
        [ -117.133015, 44.017501 ]
      ],
      'bbox': [
        -117.133015, 44.017448,
        -117.125672, 44.020076
      ]
    };

    // expected pelias/model document
    var expected = new model.Document( 'openstreetmap', 'street', 'polyline:0' )
      .setName( 'default', 'Freese Lane' )
      .setAddress( 'street', 'Freese Lane' )
      .setCentroid({ lon: -117.1275530670822, lat: 44.017448040349564 })
      .setBoundingBox({
        upperLeft: { lat: 44.020076, lon: -117.133015 },
        lowerRight: { lat: 44.017448, lon: -117.125672 }
      });

    // test assertions
    function assert( actual, enc, next ){
      t.deepEqual( actual.toESDocument(), expected.toESDocument(), 'valid document' );
      t.deepEqual( actual.getMeta('distance'), 885.5741, 'distance meta data' );
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
    return tape('document: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
