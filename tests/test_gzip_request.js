"use strict";

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _zlib = require("zlib");

var _zlib2 = _interopRequireDefault(_zlib);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var expect = _chai2.default.expect;

var http = _http2.default;
var zlib = _zlib2.default;
var nock = _2.default;

it('should accept and decode gzip encoded application/json', function (done) {
  var message = {
    my: 'contents'
  };

  nock('http://example.test').post('/').reply(function (url, actual) {
    expect(actual).to.deep.equal(message);
    done();
    return [200];
  });

  var req = http.request({
    hostname: 'example.test',
    path: '/',
    method: 'POST',
    headers: {
      'content-encoding': 'gzip',
      'content-type': 'application/json'
    }
  });

  var compressedMessage = zlib.gzipSync((0, _stringify2.default)(message));

  req.write(compressedMessage);
  req.end();
});

it('should accept and decode gzip encoded application/json, when headers come from a client as an array', function (done) {
  var compressedMessage = zlib.gzipSync((0, _stringify2.default)({ my: 'contents' }));

  var scope = nock('http://example.test').post('/', compressedMessage).reply(200);

  var req = http.request({
    hostname: 'example.test',
    path: '/',
    method: 'POST',
    headers: {
      'content-encoding': ['gzip'],
      'content-type': ['application/json']
    }
  });
  req.on('response', function () {
    scope.done();
    done();
  });

  req.write(compressedMessage);
  req.end();
});

it('should accept and decode deflate encoded application/json', function (done) {
  var message = {
    my: 'contents'
  };

  nock('http://example.test').post('/').reply(function (url, actual) {
    expect(actual).to.deep.equal(message);
    done();
    return [200];
  });

  var req = http.request({
    hostname: 'example.test',
    path: '/',
    method: 'POST',
    headers: {
      'content-encoding': 'deflate',
      'content-type': 'application/json'
    }
  });

  var compressedMessage = zlib.deflateSync((0, _stringify2.default)(message));

  req.write(compressedMessage);
  req.end();
});