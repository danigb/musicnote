'use strict';

module.exports = Note;

var Interval = require('./interval.js');

/*
 * Note
 * ====
 * Create a Note instance.
 */
var MID_OCT = 4;
var REGEX = /^\s*([abcdefgr][b#]*)([+-]+)/;

function Note(name, oct) {
  if (name instanceof Note) return name;
  if (!(this instanceof Note)) return new Note(name, oct);

  this.name = name || 'c';
  this.oct = oct || MID_OCT;

  var m;
  if (Array.isArray(name)) {
    this.name = name[0];
    this.oct = name[1];
  } else if (m = REGEX.exec(name)) {
    this.name = m[1];
    this.oct = MID_OCT + (m[2][0] == '-' ? -1 : 1) * m[2].length
  }
}

/*
 * Return the note pitch class ('a', 'b'...)
 */
Note.prototype.pitch = function() { return this.name[0]; }

/*
 * Return the note accidentals
 */
Note.prototype.accidentals = function() { return this.name.slice(1); }

/*
 * Return a string representing the Note in scientific notation (name + octave)
 */
Note.prototype.toString = function() { return this.name + this.oct; }

/*
 * Return a string representing the Note in impro-visor notation
 */
var OCTSTR = ['----', '---', '--', '-', '', '+', '++', '+++', '++++'];
Note.prototype.toImpro = function() {
  return this.name + OCTSTR[this.oct];
}


/*
 * Note.shift
 *
 * Shift the note pitch num amount. The number is 0 based and can
 * be negative.
 */
var PITCHS = 'abcdefgabcdefg';
function pitchNum(note) { return PITCHS.indexOf(note.pitch()); }
Note.prototype.shift = function(num) {
  num = num % 7;
  if(num < 0) num += 7;
  return new Note(PITCHS[pitchNum(this) + num], this.oct);
}

var ACCIDENTALS = {"0": "", "1": "#", "2": "##", "-1": "b", "-2": "bb"};
Note.prototype.transpose = function(intervalName) {
  var interval = Interval(intervalName);

  var dest = this.shift(interval.steps);
  dest.oct += (interval.distance / 12)|0;
  var distance = dest.midi() - this.midi();
  var difference = (interval.distance - distance) % 12;
  var acc = ACCIDENTALS['' + difference];
  //console.log(intervalName, interval, this, dest, distance, difference, acc);
  return new Note(dest.name + acc, dest.oct);
}

/*
 * Note.distance
 */
Note.prototype.distance = function(dest) {
  var note = Note(dest);
  var distance = note.midi() - this.midi();
  var num = pitchNum(dest) - pitchNum(this);
  num = distance > 0 ? num : (num - 7) % 7;
  var oct = (distance / 12)|0;
  return Interval(num + 7 * oct, distance);
}


/*
* Note.midi
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
