"use strict";

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

// Tests for `.replyWithError()`.

var http = _http2.default;
var expect = _chai2.default.expect;

var nock = _2.default;

describe('`replyWithError()`', function () {
  it('returns an error through the request', function (done) {
    var scope = nock('http://example.test').post('/echo').replyWithError('Service not found');

    var req = http.request({
      host: 'example.test',
      method: 'POST',
      path: '/echo',
      port: 80
    });

    req.on('error', function (e) {
      expect(e).to.be.an.instanceof(Error).and.include({ message: 'Service not found' });
      scope.done();
      done();
    });

    req.end();
  });

  it('allows json response', function (done) {
    var scope = nock('http://example.test').post('/echo').replyWithError({ message: 'Service not found', code: 'test' });

    var req = http.request({
      host: 'example.test',
      method: 'POST',
      path: '/echo',
      port: 80
    });

    req.on('error', function (e) {
      expect(e).to.deep.equal({
        message: 'Service not found',
        code: 'test'
      });
      scope.done();
      done();
    });

    req.end();
  });
});