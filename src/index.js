var Addresses     = require('./addresses');
var Blocks        = require('./blocks');
var Transactions  = require('./transactions');

var utils         = require('./utils');

function Bitcore(baseUrl) {
  this.transactions = new Transactions  (baseUrl + '/cb/transactions');
  this.addresses    = new Addresses     (baseUrl + '/cb/addresses',  this.transactions);
  this.blocks       = new Blocks        (baseUrl + '/cb/blocks',     this.transactions);
}

Bitcore.throttleGet = utils.throttleGet;
Bitcore.throttlePost = utils.throttlePost;

module.exports = Bitcore;
