var vows = require('vows');
var assert = require('assert');
var note = require('../note.js');

var equalNote = function(note, expected) {
  assert.deepEqual([note.name, note.oct], expected);
}

vows.describe('note').addBatch({
  "constructor": {
    "constructor returns an instance of note": function() {
      assert(note('c') instanceof note);
    },
    "empty constructors returns middle C": function() {
      equalNote(note(), ['c', 4]);
    },
    "impro-visor notation": function() {
      equalNote(note('c#'), ['c#', 4]);
      equalNote(note('db+'), ['db', 5]);
      equalNote(note('b--'), ['b', 2]);
    },
    "array": function() {
      equalNote(note(['c#', 3]), ['c#', 3]);
    },
    "arguments": function() {
      equalNote(note("gb", 6), ["gb", 6]);
    }
  },
  "midi": {
    "array to midi": function() {
      assert.equal(note('c', 4).midi(), 60);
    }
  },
  "note transpose": {
    "octaves": function() {
      equalNote(note('c', 4).transpose("P8"), ["c", 5]);
      equalNote(note('g', 4).transpose("-P8"), ["g", 5]);
    },
    "M2": function() {
      equalNote(note('e').transpose("M2"), ['f#', 4]);
      equalNote(note('b').transpose("M2"), ['c#', 4]);
    }
  },
  "toString": function () {
    assert.equal(note(['g', 3]).toString(), 'g-');
    assert.equal(note(['db', 5]).toString(), 'db+');
    assert.equal(note(['f', 4]).toString(), 'f');
  }
}).export(module);
