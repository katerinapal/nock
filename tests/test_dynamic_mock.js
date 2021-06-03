"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _got_client = require("./got_client");

var _got_client2 = _interopRequireDefault(_got_client);

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var expect = _chai2.default.expect;

var nock = _2.default;
var got = _got_client2.default;

// "dynamic" refers to `reply` getting a single callback argument that returns or calls the callback with an array of [status, [body, headers]]]
describe('dynamic `reply()` function', function () {
  it('can provide only the status code by returning an array', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var scope, _ref2, statusCode, body;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            scope = nock('http://example.test').get('/').reply(function () {
              return [201];
            });
            _context.next = 3;
            return got('http://example.test');

          case 3:
            _ref2 = _context.sent;
            statusCode = _ref2.statusCode;
            body = _ref2.body;

            expect(statusCode).to.equal(201);
            expect(body).to.equal('');

            scope.done();

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('can provide the status code and body by returning an array', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var scope, _ref4, statusCode, body;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            scope = nock('http://example.test').get('/').reply(function () {
              return [201, 'DEF'];
            });
            _context2.next = 3;
            return got('http://example.test');

          case 3:
            _ref4 = _context2.sent;
            statusCode = _ref4.statusCode;
            body = _ref4.body;

            expect(statusCode).to.equal(201);
            expect(body).to.equal('DEF');

            scope.done();

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it('can provide the status code, body, and headers by returning an array', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var scope, _ref6, statusCode, body, headers;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            scope = nock('http://example.test').get('/').reply(function () {
              return [201, 'DEF', { 'X-Foo': 'bar' }];
            });
            _context3.next = 3;
            return got('http://example.test');

          case 3:
            _ref6 = _context3.sent;
            statusCode = _ref6.statusCode;
            body = _ref6.body;
            headers = _ref6.headers;

            expect(statusCode).to.equal(201);
            expect(body).to.equal('DEF');
            expect(headers).to.deep.equal({ 'x-foo': 'bar' });

            scope.done();

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  it('should provide the status code and body by passing them to the asynchronous callback', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var scope, _ref8, statusCode, body;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            scope = nock('http://example.test').get('/').reply(function (path, reqBody, cb) {
              setTimeout(function () {
                cb(null, [201, 'GHI']);
              }, 1e3);
            });
            _context4.next = 3;
            return got('http://example.test');

          case 3:
            _ref8 = _context4.sent;
            statusCode = _ref8.statusCode;
            body = _ref8.body;

            expect(statusCode).to.equal(201);
            expect(body).to.equal('GHI');

            scope.done();

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));
});