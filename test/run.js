
var tape = require('tape');
var common = {};

var tests = [
  require('./index'),
  require('./stream/parser')
];

tests.map(function(t) {
  t.all(tape, common);
});
