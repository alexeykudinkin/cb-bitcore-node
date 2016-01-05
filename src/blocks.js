var assert  = require('assert');
var async   = require('async');
var bjs     = require('@tradle/bitcoinjs-lib');

var utils   = require('./utils');

function Blocks(url, txEndpoint) {
  this.baseUrl = url;
}

Blocks.prototype.get = function (hashes, callback) {
  var uri = this.baseUrl + "/get/";

  utils.batchRequest(uri, hashes, callback);
};

Blocks.prototype.summary = function (hashes, callback) {
  var uri = this.baseUrl + "/summary/";

  utils.batchRequest(uri, hashes, callback)
};

Blocks.prototype.latest = function (callback) {
  throw new Error("NotImplementedException");
};

Blocks.prototype.propagate = function () {
  throw new Error("NotImplementedException")
};

module.exports = Blocks;
