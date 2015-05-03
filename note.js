'use strict';

(function() {
  var Note = {};
  Note.Interval = require('./lib/note.js');
  Note.Note = require('./lib/note.js');

  Note.version = "0.2.0";
  if (typeof define === "function" && define.amd) define(function() { return Note; });
  else if (typeof module === "object" && module.exports) module.exports = Note;
  else this.Note = Note;
})();
