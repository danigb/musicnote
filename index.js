'use strict';

module.exports = function(Score) {
  Score.Interval = require('./lib/interval.js');
  Score.Note = require('./lib/note.js');

  Score.Event.prototype.note = function() { return this._data.note; }

  Score.fn.notes = function() {
    return this.map(function(evt) {
      return evt.note() ? evt : evt.set('note', Score.Note(evt.value()));
    });
  }

  Score.fn.transpose = function(interval) {
    interval = score.Interval(interval);

    return this.notes().map(function(evt) {
      evt.set('note', evt.note().transpose(interval));
    });
  }
}
