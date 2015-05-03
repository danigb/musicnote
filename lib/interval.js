'use strict';

module.exports = Interval;

var REGEX = /([PmMAd])(-{0,1})(\d+)/

function Interval(steps, distance) {
  if(steps instanceof Interval) return steps;
  if(!(this instanceof Interval)) return new Interval(steps, distance);

  var m;
  if(Array.isArray(steps)) {
    this.steps = steps[0];
    this.distance = steps[1];
  } else if(m = REGEX.exec(steps)) {
    var quality = m[1];
    var dir = m[2] ? -1 : 1;
    var steps = (+m[3]) - 1;
    var oct = Math.floor(steps / 7);
    this.steps = dir * steps;
    this.distance = dir * (DISTANCES[steps % 7][quality] + oct * 12);
  } else {
    this.steps = steps;
    this.distance = distance;
  }
}

Interval.prototype.toString = function() {
  var s = Math.abs(this.steps) % 7;
  var d = Math.abs(this.distance) % 12;
  var q = getKeyByValue(DISTANCES[s], d);
  if (q) {
    var steps = this.steps < 0 ? this.steps - 1 : this.steps + 1;
    return q + steps;
  } else {
    return "(" + [this.steps, this.distance] + ")";
  }
}

function getKeyByValue(object, value) {
  for(var key in object) {
    if(object[key] === value) return key;
  }
}

var DISTANCES = [
  {"d": -1, "P": 0, "A": 1},
  {"d": 0, "m": 1, "M": 2, "A": 3},
  {"d": 2, "m": 3, "M": 4, "A": 5},
  {"d": 4, "P": 5, "A": 6},
  {"d": 6, "P": 7, "A": 8},
  {"d": 7, "m": 8, "M": 9, "A": 10},
  {"d": 9, "m": 9, "M": 10, "A": 11}
];
