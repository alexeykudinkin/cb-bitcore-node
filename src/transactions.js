var assert  = require('assert');
var async   = require('async');

var utils   = require('./utils');

function Transactions(url) {
  this.baseUrl = url
}

function totalValue(inputs) {
  if (!inputs) return 0;

  return inputs.reduce(function(s, input) {
    return s + Math.round(input.amount * 1e8)
  }, 0)
}

Transactions.prototype.summary = function (txIds, callback) {
  var uri = this.baseUrl + "/summary/";

  utils.batchRequest(uri, txIds, callback);
};

Transactions.prototype.get = function (txIds, callback) {
  var uri = this.baseUrl + "/get/";

  txIds = [].concat(txIds);

  utils.batchRequest(uri, txIds, callback)
};

Transactions.prototype.latest = function() {
  throw new Error("NotImplementedException");
};

Transactions.prototype.propagate = function (txs, callback) {
  var uri = this.baseUrl + '/propagate/';

  if(!Array.isArray(txs))
    txs = [ txs ];

  var reqs = txs.map(function (txHex) {
    return function (callback) {
      utils.makePostRequest(uri, { hex: txHex }, callback)
    }
  });

  async.parallel(reqs, callback)
};

module.exports = Transactions;
