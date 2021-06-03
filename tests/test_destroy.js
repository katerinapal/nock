"use strict";

var _setImmediate2 = require("babel-runtime/core-js/set-immediate");

var _setImmediate3 = _interopRequireDefault(_setImmediate2);

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var expect = _chai2.default.expect;

var http = _http2.default;
var nock = _2.default;

describe('`res.destroy()`', function () {
  it('should emit error event if called with error', function (done) {
    nock('http://example.test').get('/').reply(404);

    var respErr = new Error('Response error');

    http.get('http://example.test/', function (res) {
      expect(res.statusCode).to.equal(404);
      res.destroy(respErr);
    }).once('error', function (err) {
      expect(err).to.equal(respErr);
      done();
    });
  });

  it('should not emit error event if called without error', function (done) {
    nock('http://example.test').get('/').reply(403);

    http.get('http://example.test/', function (res) {
      expect(res.statusCode).to.equal(403);
      res.destroy();
      done();
    }).once('error', function () {
      expect.fail('should not emit error');
    });
  });

  it('should not emit an response if destroyed first', function (done) {
    nock('http://example.test').get('/').reply();

    var req = http.get('http://example.test/', function () {
      expect.fail('should not emit a response');
    }).on('error', function () {}) // listen for error so "socket hang up" doesn't bubble
    .on('socket', function () {
      (0, _setImmediate3.default)(function () {
        return req.destroy();
      });
    });

    // give the `setImmediate` calls enough time to cycle.
    setTimeout(function () {
      return done();
    }, 10);
  });
});