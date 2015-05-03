var vows = require('vows');
var assert = require('assert');
var interval = require('../lib/interval.js');

assert.interval = function(i, steps, distance) {
  assert.deepEqual([i.steps, i.distance], [steps, distance]);
}

vows.describe('Intervals').addBatch({
  "constructor": {
    "return an interval object": function() {
      assert(interval(0, 0) instanceof interval);
    },
    "set steps and distance": function() {
      assert.equal(interval(1, 4).steps, 1);
      assert.equal(interval(1, 4).distance, 4);
    },
    "array": function() {
      assert.equal(interval([1, 4]).steps, 1);
      assert.equal(interval([1, 4]).distance, 4);
    }
  },
  "simple": function() {
    assert.interval(interval('P1'), 0, 0);
    assert.interval(interval('A1'), 0, 1);
    assert.interval(interval('d2'), 1, 0);
    assert.interval(interval('m2'), 1, 1);
    assert.interval(interval('M2'), 1, 2);
    assert.interval(interval('A2'), 1, 3);
  },
  "negative": function() {
    assert.interval(interval('P-1'), 0, 0);
    assert.interval(interval('A-1'), 0, -1);
  },
  "octaves": function() {
    assert.interval(interval('P8'), 7, 12);
    assert.interval(interval('P-8'), -7, -12);
  },
  "toString": function() {
    assert.equal(interval(1, 2).toString(), "M2");
    assert.equal(interval(7, 12).toString(), "P8");
    assert.equal(interval(-1, -2).toString(), "M-2");
  }
}).export(module);
