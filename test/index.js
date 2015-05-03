var vows = require('vows');
var assert = require('assert');
var score = require('scorejs');

score.plugin(require('../index.js'));

vows.describe('scorejs-notes').addBatch({
  "add note and interval": function() {
    assert(score.Interval != undefined);
    assert(score.Note != undefined);
    assert(score.fn.notes != undefined);
    assert(score.fn.transpose != undefined);
  },
  "notes": function() {
    var s = score('a b c d').notes();
    assert.equal(s.events.length, 4);
    assert(s.events[0].note().equal('a'));
    assert(s.events[1].note().equal('b'));
    assert(s.events[2].note().equal('c'));
    assert(s.events[3].note().equal('d'));
  }
}).export(module);
