'use strict';

const DiffMatchPatch = require('diff-match-patch');
const uuid = require('node-uuid');
const md5 = require('md5');

const diff = new DiffMatchPatch;

/**
 *  Can call as function or use new
 * @param hashFunction {function}  accepts one parameter and returns some value to represent the id of this object
 * @returns {TextHistory}
 * @constructor
 */
function TextHistory(hashFunction) {
  if (!(this instanceof TextHistory)){
    return new TextHistory(hashFunction);
  }
  this.originalText = '';
  this.lastVersion = '';
  this.patchesList = [];
  this.idsMappedToIndexes = {};
  this.hashFunction = hashFunction || md5;
  return this;
}

/**
 *
 * @param text {string} text to create a version for
 * @returns {string}    id of new version
 */
TextHistory.prototype.addVersion = function(text) {
  let patches = diff.patch_make(this.lastVersion, text);
  this.lastVersion = text;
  let length = this.patchesList.push(patches);
  let id = this.hashFunction(text);
  if (this.idsMappedToIndexes[id] === undefined) {

  }
  this.idsMappedToIndexes[id] = length - 1;
  return id;
};

/**
 *
 * @param id {string} version id returned in .addVersion()
 * @returns   text of version with given id or undefined if version does not exist
 */
TextHistory.prototype.getVersion = function(id) {
  let index = this.idsMappedToIndexes[id];
  if (index === undefined) {
    return;
  }
  // get all the patches up to the version index
  let patchesList = this.patchesList.slice(0, index + 1);
  return patchesList.reduce((text, patches) => diff.patch_apply(patches, text)[0], this.originalText);
};

/**
 *
 * @param id  version id that you want to transform to latest
 * @returns {!Array.<!diff_match_patch.patch_obj>}  patch to transform
 */
TextHistory.prototype.getPatches = function(id) {
  let text = this.getVersion(id);
  return diff.patch_make(text, this.lastVersion);
};

module.exports = TextHistory;