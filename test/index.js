
var index = require('../index');
var check = require('check-types');

module.exports.tests = {};

// test index
module.exports.tests.index = function(test, common) {
  test('interface: index', function(t) {
    t.true( check.object( index ), 'index file exists');
    t.end();
  });
};

module.exports.all = function (tape, common) {

  function test(name, testFunction) {
    return tape('index: ' + name, testFunction);
  }

  for( var testCase in module.exports.tests ){
    module.exports.tests[testCase](test, common);
  }
};
