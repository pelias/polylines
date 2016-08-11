
var tape = require('tape');
var common = {};

var tests = [
  require('./index'),
  require('./stream/parser'),
  require('./stream/centroid'),
  require('./stream/document'),
  require('./stream/pipeline')
];

tests.map(function(t) {
  t.all(tape, common);
});
