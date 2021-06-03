"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _interceptor = require("../lib/interceptor");

var _interceptor2 = _interopRequireDefault(_interceptor);

var _scope = require("../lib/scope");

var _scope2 = _interopRequireDefault(_scope);

var _got_client = require("./got_client");

var _got_client2 = _interopRequireDefault(_got_client);

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _proxyquire = require("proxyquire");

var _proxyquire2 = _interopRequireDefault(_proxyquire);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

// Tests for `.replyWithFile()`.

var path = _path2.default;
var expect = _chai2.default.expect;

var proxyquire = _proxyquire2.default.preserveCache();
var nock = _2.default;
var got = _got_client2.default;

var textFilePath = path.resolve(__dirname, './assets/reply_file_1.txt');
var binaryFilePath = path.resolve(__dirname, './assets/reply_file_2.txt.gz');

describe('`replyWithFile()`', function () {
  it('reply with file', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var scope, _ref2, statusCode, body;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            scope = nock('http://example.test').get('/').replyWithFile(200, textFilePath);
            _context.next = 3;
            return got('http://example.test/');

          case 3:
            _ref2 = _context.sent;
            statusCode = _ref2.statusCode;
            body = _ref2.body;


            expect(statusCode).to.equal(200);
            expect(body).to.equal('Hello from the file!');

            scope.done();

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('reply with file with headers', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var scope, _ref4, statusCode, body;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            scope = nock('http://example.test').get('/').replyWithFile(200, binaryFilePath, {
              'content-encoding': 'gzip'
            });
            _context2.next = 3;
            return got('http://example.test/');

          case 3:
            _ref4 = _context2.sent;
            statusCode = _ref4.statusCode;
            body = _ref4.body;


            expect(statusCode).to.equal(200);
            expect(body).to.have.lengthOf(20);
            scope.done();

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  describe('with no fs', function () {
    var Scope = _scope2.default.Scope;


    it('throws the expected error', function () {
      expect(function () {
        return new Scope('http://example.test').get('/').replyWithFile(200, textFilePath);
      }).to.throw(Error, 'No fs');
    });
  });
});