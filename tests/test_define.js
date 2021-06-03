"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _got_client = require("./got_client");

var _got_client2 = _interopRequireDefault(_got_client);

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _assertRejects = require("assert-rejects");

var _assertRejects2 = _interopRequireDefault(_assertRejects);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var http = _http2.default;
var expect = _chai2.default.expect;

var assertRejects = _assertRejects2.default;
var nock = _2.default;
var got = _got_client2.default;

describe('`define()`', function () {
  it('is backward compatible', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            expect(nock.define([{
              scope: 'http://example.test',
              //  "port" has been deprecated
              port: 12345,
              method: 'GET',
              path: '/',
              //  "reply" has been deprecated
              reply: '500'
            }])).to.be.ok();

            _context.next = 3;
            return assertRejects(got('http://example.test:12345/'), function (_ref2) {
              var statusCode = _ref2.response.statusCode;

              expect(statusCode).to.equal(500);
              return true;
            });

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('throws when reply is not a numeric string', function () {
    expect(function () {
      return nock.define([{
        scope: 'http://example.test:1451',
        method: 'GET',
        path: '/',
        reply: 'frodo'
      }]);
    }).to.throw('`reply`, when present, must be a numeric string');
  });

  it('applies default status code when none is specified', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var body, _ref4, statusCode;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            body = '�';


            expect(nock.define([{
              scope: 'http://example.test',
              method: 'POST',
              path: '/',
              body: body,
              response: '�'
            }])).to.have.lengthOf(1);

            _context2.next = 4;
            return got.post('http://example.test/', { body: body });

          case 4:
            _ref4 = _context2.sent;
            statusCode = _ref4.statusCode;


            expect(statusCode).to.equal(200);

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it('works when scope and port are both specified', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var body, _ref6, statusCode;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            body = 'Hello, world!';


            expect(nock.define([{
              scope: 'http://example.test:1451',
              port: 1451,
              method: 'POST',
              path: '/',
              body: body,
              response: '�'
            }])).to.be.ok();

            _context3.next = 4;
            return got.post('http://example.test:1451/', { body: body });

          case 4:
            _ref6 = _context3.sent;
            statusCode = _ref6.statusCode;


            expect(statusCode).to.equal(200);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  it('throws the expected error when scope and port conflict', function () {
    expect(function () {
      return nock.define([{
        scope: 'http://example.test:8080',
        port: 5000,
        method: 'POST',
        path: '/',
        body: 'Hello, world!',
        response: '�'
      }]);
    }).to.throw('Mismatched port numbers in scope and port properties of nock definition.');
  });

  it('throws the expected error when method is missing', function () {
    expect(function () {
      return nock.define([{
        scope: 'http://example.test',
        path: '/',
        body: 'Hello, world!',
        response: 'yo'
      }]);
    }).to.throw('Method is required');
  });

  it('works with non-JSON responses', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var exampleBody, exampleResponseBody, _ref8, statusCode, body;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            exampleBody = '�';
            exampleResponseBody = 'hey: �';


            expect(nock.define([{
              scope: 'http://example.test',
              method: 'POST',
              path: '/',
              body: exampleBody,
              status: 200,
              response: exampleResponseBody
            }])).to.be.ok();

            _context4.next = 5;
            return got.post('http://example.test/', {
              body: exampleBody,
              responseType: 'buffer'
            });

          case 5:
            _ref8 = _context4.sent;
            statusCode = _ref8.statusCode;
            body = _ref8.body;


            expect(statusCode).to.equal(200);
            expect(body).to.be.an.instanceOf(Buffer);
            expect(body.toString()).to.equal(exampleResponseBody);

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));

  // TODO: There seems to be a bug here. When testing via `got` with
  // `{ encoding: false }` the body that comes back should be a buffer, but is
  // not. It's difficult to get this test to pass after porting it.
  // I think this bug has been fixed in Got v10, so this should be unblocked.
  it('works with binary buffers', function (done) {
    var exampleBody = '8001';
    var exampleResponse = '8001';

    expect(nock.define([{
      scope: 'http://example.test',
      method: 'POST',
      path: '/',
      body: exampleBody,
      status: 200,
      response: exampleResponse
    }])).to.be.ok();

    var req = http.request({
      host: 'example.test',
      method: 'POST',
      path: '/'
    }, function (res) {
      expect(res.statusCode).to.equal(200);

      var dataChunks = [];

      res.on('data', function (chunk) {
        dataChunks.push(chunk);
      });

      res.once('end', function () {
        var response = Buffer.concat(dataChunks);
        expect(response.toString('hex')).to.equal(exampleResponse);
        done();
      });
    });

    req.on('error', function () {
      //  This should never happen.
      expect.fail();
      done();
    });

    req.write(Buffer.from(exampleBody, 'hex'));
    req.end();
  });

  it('uses reqheaders', function (done) {
    var auth = 'foo:bar';
    var authHeader = "Basic " + Buffer.from('foo:bar').toString('base64');
    var reqheaders = {
      host: 'example.test',
      authorization: authHeader
    };

    expect(nock.define([{
      scope: 'http://example.test',
      method: 'GET',
      path: '/',
      status: 200,
      reqheaders: reqheaders
    }])).to.be.ok();

    // Make a request which should match the mock that was configured above.
    // This does not hit the network.
    var req = http.request({
      host: 'example.test',
      method: 'GET',
      path: '/',
      auth: auth
    }, function (res) {
      expect(res.statusCode).to.equal(200);

      res.once('end', function () {
        expect(res.req.getHeaders(), reqheaders);
        done();
      });
      // Streams start in 'paused' mode and must be started.
      // See https://nodejs.org/api/stream.html#stream_class_stream_readable
      res.resume();
    });
    req.end();
  });

  it('uses badheaders', function (done) {
    expect(nock.define([{
      scope: 'http://example.test',
      method: 'GET',
      path: '/',
      status: 401,
      badheaders: ['x-foo']
    }, {
      scope: 'http://example.test',
      method: 'GET',
      path: '/',
      status: 200,
      reqheaders: {
        'x-foo': 'bar'
      }
    }])).to.be.ok();

    var req = http.request({
      host: 'example.test',
      method: 'GET',
      path: '/',
      headers: {
        'x-foo': 'bar'
      }
    }, function (res) {
      expect(res.statusCode).to.equal(200);

      res.once('end', function () {
        done();
      });
      // Streams start in 'paused' mode and must be started.
      // See https://nodejs.org/api/stream.html#stream_class_stream_readable
      res.resume();
    });
    req.end();
  });
});