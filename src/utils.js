var assert = require('assert');
var request = require('superagent');
var async = require('async');
var throttle = require('throttleme');

function btcToSatoshi(value) {
  return Math.round(1e8 * parseFloat(value))
}

function assertJSend(body) {
  assert.notEqual(body.status, 'error', body.message || 'Invalid JSend response:' + JSON.stringify(body));
  assert.notEqual(body.status, 'fail', body.data || 'Invalid JSend response: ' + JSON.stringify(body));

  assert.equal(body.status, 'success', 'Unexpected JSend response: ' + body);
  assert.notEqual(body.data, undefined, 'Unexpected JSend response: ' + body)
}

function handleJSend(callback) {
  return function(err, response) {
    if (err) return callback(err);

    var body = JSON.parse(response.text);
    try {
      assertJSend(body)
    } catch (exception) {
      return callback(exception)
    }

    callback(null, body.data)
  }
}

function batchRequest(uri, items, options, callback) {
  items = [].concat(items);

  if (typeof options === 'function') {
    callback = options;
    options = {}
  } else {
    options = options || {}
  }

  var itemsPerBatch = options.itemsPerBatch || 20;
  var params = options.params;

  var batches = [];
  while(items.length > itemsPerBatch){
    var batch = items.splice(0, itemsPerBatch);
    batches.push(batch)
  }

  if(items.length > 0) batches.push(items);

  var requests = batches.map(function(batch) {
    return function(cb) {
      module.exports.makeRequest(uri + batch.join(','), params, cb)
    }
  });

  var consolidated = [];
  async.parallel(requests, function(err, results) {
    if(err) return callback(err);

    results.forEach(function(r) {
      consolidated = consolidated.concat(r)
    });

    callback(null, consolidated)
  })
}

function makeRequest(uri, params, callback){
  if (Array.isArray(params)){
    uri +=  '?' + params.join('&')
  } else if ('function' === typeof params) {
    callback = params
  }

  request
    .get(uri)
    .timeout(20000)
    .end(handleJSend(callback))
}

function makePostRequest(uri, form, callback){
  request
    .post(uri)
    .timeout(20000)
    .send(form)
    .end(handleJSend(callback))
}

function throttleGet (millis) {
  module.exports.makeRequest = throttle(makeRequest, millis)
}

function throttlePost (millis) {
  module.exports.makePostRequest = throttle(makePostRequest, millis)
}

module.exports = {
  handleJSend: handleJSend,
  btcToSatoshi: btcToSatoshi,
  batchRequest: batchRequest,
  makeRequest: makeRequest,
  makePostRequest: makePostRequest,
  throttleGet: throttleGet,
  throttlePost: throttlePost
};