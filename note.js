'use strict';

(function() {
  var MID_OCT = 4;
  var REGEX = /^\s*([abcdefgr][b#]*)([+-]+)/;

  function Note(note, oct) {
    if (!(this instanceof Note)) return new Note(note, oct);

    this.name = note || 'c';
    this.oct = oct || MID_OCT;

    var m;
    if (Array.isArray(note)) {
      this.name = note[0];
      this.oct = note[1];
    } else if (m = REGEX.exec(note)) {
      this.name = m[1];
      this.oct = MID_OCT + (m[2][0] == '-' ? -1 : 1) * m[2].length
    }
  }

  Note.prototype.pitch = function() { return this.name[0]; }
  Note.prototype.accidentals = function() { return this.name.slice(1); }

  Note.prototype.toString = function() { return this.name + this.oct; }
  var OCTSTR = ['----', '---', '--', '-', '', '+', '++', '+++', '++++'];
  Note.prototype.toImpro = function() {
    return this.name + OCTSTR[this.oct];
  }


  var PITCHS = 'abcdefgabcdefg';
  Note.prototype.shift = function(num) {
    num = num || 0;
    num = +num % 7;
    var base = PITCHS.indexOf(this.pitch());
    return PITCHS[base + num];
  }

  var ACCIDENTALS = {"0": "", "1": "#", "2": "##", "-1": "b", "-2": "bb"};
  Note.prototype.transpose = function(intervalName) {
    var interval = Note.interval(intervalName);
    if (!interval) throw "Interval " + intervalName + "not found.";

    var dest = new Note(this.shift(interval.num - 1), this.oct + interval.oct);
    var distance = dest.midi() - this.midi();
    var difference = (interval.distance - distance) % 12;
    var acc = ACCIDENTALS['' + difference];
    return new Note(dest.name + acc, dest.oct);
  }


  /*
 * pitch.midi
 *
 * Given a pitch, return the midi note number
 *
 */

  // MIDI notes for A, B, C ... G
  var MIDI = [69, 71, 60, 62, 64, 65, 67];
  var CHAR_BASE = 'a'.charCodeAt(0);

  Note.prototype.midi = function() {
    var base = MIDI[this.name.charCodeAt(0) - CHAR_BASE];
    var acc = (this.name.slice(1) == '#' ? 1 : -1) * (this.name.length - 1);
    var oct = (this.oct - MID_OCT) * 12;
    return base + acc + oct;
  }

  /*
   * INTERVALS
   */
  Note.interval = function(interval) {
    return INTERVALS[interval];
  }

  var INTERVALS = (function buildIntervals() {
    var intervals = {};
    var BASE = {"P1": 0, "A1": 1, "d2": 0, "m2": 1, "M2": 2, "A2": 3,
    "d3": 2, "m3": 3, "M3": 4, "A3": 5, "d4": 4, "P4": 5, "A4": 6,
    "d5": 6, "P5": 7, "A5": 8, "d6": 7, "m6": 8, "M6": 9, "A6": 10,
    "d7": 9, "m7": 10, "M7": 11, "A7": 12, "d8": 11, "P8": 12 }

    function build(i, q, n, s, d) {
      return { name: i, quality: q, num: n, distance: s, dir: d,
        oct: Math.floor(s / 12), simple: q + (n % 8)
      };
    }

    // Basic intervals ascending
    Object.keys(BASE).forEach(function(n) {
      intervals[n] = build(n, n[0], +n.slice(1), BASE[n], 1);
    });
    // Basic descending intervals
    Object.keys(BASE).forEach(function(n) {
      intervals['-' + n] = build('-' + n, n[0], +n.slice(1), BASE[n], -1);
    });
    return intervals;
  })();


  Note.version = "0.1.0";
  if (typeof define === "function" && define.amd) define(function() { return Note; });
  else if (typeof module === "object" && module.exports) module.exports = Note;
  else this.Note = Note;
})();
