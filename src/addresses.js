var async = require('async');
var bjs   = require('@tradle/bitcoinjs-lib');

var utils = require('./utils');

function Addresses(url, txEndpoint) {
  this.baseUrl = url;
  this.txEndpoint = txEndpoint
}

Addresses.prototype.summary = function (addresses, callback) {
  var uri = this.baseUrl + "/summary/";

  validateAddresses(addresses, function (err) {
    if (err) return callback(err);

    utils.batchRequest(uri, addresses, callback)
  })
};

Addresses.prototype.transactions = function (addresses, blockHeight, callback) {
  if ('function' === typeof blockHeight) {
    callback = blockHeight;
    blockHeight = -1
  }

  var uri = this.baseUrl + '/transactions/';

  validateAddresses(addresses, function (err) {
    if (err) return callback(err);

    utils.batchRequest(uri, addresses, blockHeight > -1 ? { blockHeight: blockHeight } : {}, callback);
  });
};

Addresses.prototype.unspents = function (addresses, callback) {
  var uri = this.baseUrl + "/unspents/";

  validateAddresses(addresses, function (err) {
    if (err) return callback(err);

    utils.batchRequest(uri, addresses, callback)
  })
};

function validateAddresses(addresses, callback) {
  addresses = [].concat(addresses);
  var invalidAddresses = addresses.filter(function (address) {
    try {
      bjs.Address.fromBase58Check(address)
    } catch(e) {
      return true
    }
  });

  if (invalidAddresses.length > 0) {
    return callback(new Error("There are " + invalidAddresses.length + " invalid addresses: " + invalidAddresses.join(', ')))
  }

  callback(null);
}

module.exports = Addresses;
