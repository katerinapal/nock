"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

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

// Tests for the body argument passed to `.reply()`.

var expect = _chai2.default.expect;

var nock = _2.default;
var got = _got_client2.default;

describe('`reply()` body', function () {
  it('stringifies an object', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var responseBody, scope, _ref2, statusCode, headers, body;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            responseBody = { hello: 'world' };
            scope = nock('http://example.test').get('/').reply(200, responseBody);
            _context.next = 4;
            return got('http://example.test/');

          case 4:
            _ref2 = _context.sent;
            statusCode = _ref2.statusCode;
            headers = _ref2.headers;
            body = _ref2.body;


            expect(statusCode).to.equal(200);
            expect(headers).not.to.have.property('date');
            expect(headers).not.to.have.property('content-length');
            expect(headers).to.include({ 'content-type': 'application/json' });
            expect(body).to.be.a('string').and.equal((0, _stringify2.default)(responseBody));
            scope.done();

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('stringifies an array', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var responseBody, scope, _ref4, statusCode, headers, body;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            responseBody = [{ hello: 'world' }];
            scope = nock('http://example.test').get('/').reply(200, responseBody);
            _context2.next = 4;
            return got('http://example.test/');

          case 4:
            _ref4 = _context2.sent;
            statusCode = _ref4.statusCode;
            headers = _ref4.headers;
            body = _ref4.body;


            expect(statusCode).to.equal(200);
            expect(headers).not.to.have.property('date');
            expect(headers).not.to.have.property('content-length');
            expect(headers).to.include({ 'content-type': 'application/json' });
            expect(body).to.be.a('string').and.equal((0, _stringify2.default)(responseBody));
            scope.done();

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  // While `false` and `null` are falsy, they are valid JSON value so they
  // should be returned as strings that `JSON.parse()` would convert back to
  // native values.
  it('stringifies a boolean (including `false`)', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var scope, _ref6, statusCode, body;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            scope = nock('http://example.test').get('/').reply(204, false);
            _context3.next = 3;
            return got('http://example.test/');

          case 3:
            _ref6 = _context3.sent;
            statusCode = _ref6.statusCode;
            body = _ref6.body;


            expect(statusCode).to.equal(204);
            // `'false'` is json-stringified `false`.
            expect(body).to.be.a('string').and.equal('false');
            scope.done();

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  it('stringifies null', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var scope, _ref8, statusCode, body;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            scope = nock('http://example.test').get('/').reply(204, null);
            _context4.next = 3;
            return got('http://example.test/');

          case 3:
            _ref8 = _context4.sent;
            statusCode = _ref8.statusCode;
            body = _ref8.body;


            expect(statusCode).to.equal(204);
            // `'null'` is json-stringified `null`.
            expect(body).to.be.a('string').and.equal('null');
            scope.done();

          case 9:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));

  describe('content-type header', function () {
    it('is set for a JSON-encoded response', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
      var scope, _ref10, headers;

      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              scope = nock('http://example.test').get('/').reply(200, { A: 'b' });
              _context5.next = 3;
              return got('http://example.test/');

            case 3:
              _ref10 = _context5.sent;
              headers = _ref10.headers;


              expect(headers).to.include({ 'content-type': 'application/json' });

              scope.done();

            case 7:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, undefined);
    })));

    it("doesn't overwrite existing content-type header", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
      var scope, _ref12, headers;

      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              scope = nock('http://example.test').get('/').reply(200, { A: 'b' }, { 'Content-Type': 'unicorns' });
              _context6.next = 3;
              return got('http://example.test/');

            case 3:
              _ref12 = _context6.sent;
              headers = _ref12.headers;


              expect(headers).to.include({ 'content-type': 'unicorns' });

              scope.done();

            case 7:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, undefined);
    })));

    it("isn't set for a blank response", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
      var scope, _ref14, headers;

      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              scope = nock('http://example.test').get('/').reply();
              _context7.next = 3;
              return got('http://example.test/');

            case 3:
              _ref14 = _context7.sent;
              headers = _ref14.headers;


              expect(headers).not.to.have.property('content-type');

              scope.done();

            case 7:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, undefined);
    })));
  });

  it('unencodable object throws the expected error', function () {
    var unencodableObject = {
      toJSON: function toJSON() {
        throw Error('bad!');
      }
    };

    expect(function () {
      return nock('http://localhost').get('/').reply(200, unencodableObject);
    }).to.throw(Error, 'Error encoding response body into JSON');
  });

  it('without a body, defaults to empty', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
    var scope, _ref16, statusCode, body;

    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            scope = nock('http://example.test').get('/').reply(204);
            _context8.next = 3;
            return got('http://example.test/');

          case 3:
            _ref16 = _context8.sent;
            statusCode = _ref16.statusCode;
            body = _ref16.body;


            expect(statusCode).to.equal(204);
            expect(body).to.be.a('string').and.equal('');
            scope.done();

          case 9:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  })));
});

describe('`reply()` status code', function () {
  it('reply with missing status code defaults to 200', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
    var scope, _ref18, statusCode, body;

    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            scope = nock('http://example.test').get('/').reply();
            _context9.next = 3;
            return got('http://example.test/');

          case 3:
            _ref18 = _context9.sent;
            statusCode = _ref18.statusCode;
            body = _ref18.body;


            expect(statusCode).to.equal(200);
            expect(body).to.be.a('string').and.equal('');
            scope.done();

          case 9:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  })));

  it('reply with invalid status code throws', function () {
    var scope = nock('http://localhost').get('/');

    expect(function () {
      return scope.reply('200');
    }).to.throw(Error, 'Invalid string value for status code');
    expect(function () {
      return scope.reply(false);
    }).to.throw(Error, 'Invalid boolean value for status code');
  });
});