var vows = require('vows');
var assert = require('assert');
var note = require('../lib/note.js');

var equalNote = function(note, expected) {
  assert.deepEqual([note.name, note.oct], expected);
}

vows.describe('note').addBatch({
  "constructor": {
    "return same object if is a note": function() {
      var c = note('c');
      assert(c === note(c));
    },
    "constructor returns an instance of note": function() {
      assert(note('c') instanceof note);
    },
    "empty constructors returns middle C": function() {
      equalNote(note(), ['c', 4]);
    },
    "name, octave": function() {
      equalNote(note("gb", 6), ["gb", 6]);
    },
    "default octave": function() {
      equalNote(note("db"), ["db", 4]);
    },
    "impro-visor notation": function() {
      equalNote(note('c#'), ['c#', 4]);
      equalNote(note('db+'), ['db', 5]);
      equalNote(note('b--'), ['b', 2]);
    },
    "array notation": function() {
      equalNote(note(['c#', 3]), ['c#', 3]);
    }
  },
  "midi": {
    "array to midi": function() {
      assert.equal(note('c', 4).midi(), 60);
    }
  },
  "note shift": function() {
    equalNote(note('c').shift(0), ['c', 4]);
    equalNote(note('b').shift(1), ['c', 4]);
    equalNote(note('c').shift(7), ['c', 4]);

    equalNote(note('c').shift(-1), ['b', 4]);
    equalNote(note('c').shift(-7), ['c', 4]);
    equalNote(note('c').shift(-8), ['b', 4]);
  },
  "note transpose": {
    "octaves": function() {
      equalNote(note('c', 4).transpose("P8"), ["c", 5]);
      equalNote(note('g', 4).transpose("P-8"), ["g", 3]);
    },
    "M2": function() {
      equalNote(note('e').transpose("M2"), ['f#', 4]);
      equalNote(note('b').transpose("M2"), ['c#', 4]);
    },
    "M-2": function() {
      equalNote(note('d').transpose('M-2'), ['c', 4]);
    }
  },
  "distance": {
    "base": function() {
      var c = note('c', 4);
      assert.equal(c.distance(note('d', 4)).toString(), 'M2');
      assert.equal(c.distance(note('g', 4)).toString(), 'P5');
      assert.equal(c.distance(note('c', 5)).toString(), 'P8')
      assert.equal(c.distance(note('d', 5)).toString(), 'M9');

      assert.equal(c.distance(note('c', 3)).toString(), 'P-8')
      assert.equal(c.distance(note('b', 3)).toString(), 'm-2');
      assert.equal(c.distance(note('g', 3)).toString(), 'P-4');
      assert.equal(c.distance(note('d', 3)).toString(), 'M-9');
    }

  },
  "toString": {
    "scientific": function() {
      assert.equal(note('g').toString(), 'g4')
      assert.equal(note(['f#', 5]).toString(), 'f#5');
    },
    "improv": function () {
      assert.equal(note(['g', 3]).toImpro(), 'g-');
      assert.equal(note(['db', 5]).toImpro(), 'db+');
      assert.equal(note(['f', 4]).toImpro(), 'f');
    }
  }
}).export(module);
