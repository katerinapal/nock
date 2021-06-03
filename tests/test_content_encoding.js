"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _got_client = require("./got_client");

var _got_client2 = _interopRequireDefault(_got_client);

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _zlib = require("zlib");

var _zlib2 = _interopRequireDefault(_zlib);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var expect = _chai2.default.expect;

var zlib = _zlib2.default;
var nock = _2.default;
var got = _got_client2.default;

describe('Content Encoding', function () {
  it('should accept gzipped content', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var message, compressed, scope, _ref2, body, statusCode;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            message = 'Lorem ipsum dolor sit amet';
            compressed = zlib.gzipSync(message);
            scope = nock('http://example.test').get('/foo').reply(200, compressed, {
              'X-Transfer-Length': String(compressed.length),
              'Content-Length': undefined,
              'Content-Encoding': 'gzip'
            });
            _context.next = 5;
            return got('http://example.test/foo');

          case 5:
            _ref2 = _context.sent;
            body = _ref2.body;
            statusCode = _ref2.statusCode;


            expect(statusCode).to.equal(200);
            expect(body).to.equal(message);
            scope.done();

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('Delaying the body works with content encoded responses', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var message, compressed, scope, _ref4, statusCode, body;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            message = 'Lorem ipsum dolor sit amet';
            compressed = zlib.gzipSync(message);
            scope = nock('http://example.test').get('/').delay({
              body: 100
            }).reply(200, compressed, {
              'Content-Encoding': 'gzip'
            });
            _context2.next = 5;
            return got('http://example.test/');

          case 5:
            _ref4 = _context2.sent;
            statusCode = _ref4.statusCode;
            body = _ref4.body;


            expect(statusCode).to.equal(200);
            expect(body).to.equal(message);
            scope.done();

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));
});