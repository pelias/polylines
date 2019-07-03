
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

module.exports.tests.parse_simple = function(test, common) {
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
      ],
      'bbox': [
        -117.133015, 44.017448,
        -117.125672, 44.020076
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

// row does not follow polyline schema
module.exports.tests.parse_invalid = function(test, common) {
  test('parse: invalid row', function(t) {

    var stream = parser(6);
    var row = 'wuw}rAlbxk~Evb@]??n_C\??tJ?f~LiB\0';

    // test assertions
    function assert( actual, enc, next ){
      t.fail('no valid rows'); // should not execute
      next();
    }

    // run test
    stream.pipe( through.obj( assert, function(){ t.end(); } ));
    stream.write(row);
    stream.end();
  });
};

// select the longest name
module.exports.tests.select_name = function(test, common) {
  test('parse: select name', function(t) {

    var stream = parser(6);
    var row = ['a','foo','foooooooo','fooo bar'].join('\0');
    var expected = 'foooooooo';

    // test assertions
    function assert( actual, enc, next ){
      t.deepEqual( actual.properties.name, expected, 'longest name' );
      next();
    }

    // run test
    stream.pipe( through.obj( assert, function(){ t.end(); } ));
    stream.write(row);
    stream.end();
  });
};

// URLs are filtered out
module.exports.tests.filter_url = function(test, common) {
  test('parse: filter URL', function(t) {

    var stream = parser(6);
    var row = ['a','foo','foooooooo','https://this-website-should-not-be-the-name.com'].join('\0');
    var expected = 'foooooooo';

    function assert( actual, enc, next ){
      t.deepEqual( actual.properties.name, expected, 'longest non-URL name selected' );
      next();
    }

    stream.pipe( through.obj( assert, function(){ t.end(); } ));
    stream.write(row);
    stream.end();
  });
};

module.exports.tests.filter_only_url = function(test, common) {
  test('parse:document with only URL name is skipped', function(t) {

    var stream = parser(6);
    var row = ['polylineEncodedString','https://this-website-should-not-be-the-name.com'].join('\0');

    function assert( actual, enc, next ){
      t.fail('no valid rows'); // should not execute
      next();
    }

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
