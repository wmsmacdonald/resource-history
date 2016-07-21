'use strict';

const assert = require('chai').assert;
const DiffMatchPatch = require('diff-match-patch');
const md5 = require('md5');

const TextHistory = require('../');

const diff = new DiffMatchPatch;

describe('TextHistory', function(){
  describe('#', function() {
    it("constructor should return an instance", function() {
      assert.isDefined(new TextHistory());
    });
    it("function should return an instance", function() {
      assert.isDefined(TextHistory());
    });
  });
  describe('#addVersion', function() {
    it('return md5 hash as id', function() {
      let text = new Date().toString();
      assert.strictEqual(TextHistory().addVersion(text), md5(text));
    });
    it('return id with custom function', function() {
      assert.isNumber(
        TextHistory(text => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))
          .addVersion(new Date().toString())
      );
    });
  });
  describe('#getVersion', function() {
    const NUM_VERSIONS = 10;
    let texts = [];
    for (let i = 0; i < NUM_VERSIONS; i++) {
      texts.push((new Date).toString());
    }

    let textHistory = new TextHistory();
    let ids = texts.map(textHistory.addVersion.bind(textHistory));
    it('get right text', function() {
      ids.forEach((id, index) => assert.strictEqual(textHistory.getVersion(id), texts[index]));
    });
  });
  describe('#getPatches', function() {
    const NUM_VERSIONS = 10;
    let texts = [];
    for (let i = 0; i < NUM_VERSIONS; i++) {
      texts.push((new Date).toString());
    }

    let textHistory = new TextHistory();
    let ids = texts.map(textHistory.addVersion.bind(textHistory));

    it('patch correctly', function() {
      ids.forEach((id, index) => {
        let patches = textHistory.getPatches(id);
        assert.strictEqual(diff.patch_apply(patches, texts[index])[0], texts[texts.length - 1]);
      });
    });
  });

});
