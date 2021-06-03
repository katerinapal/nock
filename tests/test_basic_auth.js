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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var expect = _chai2.default.expect;

var assertRejects = _assertRejects2.default;
var nock = _2.default;
var got = _got_client2.default;

describe('basic auth with username and password', function () {
  beforeEach(function (done) {
    nock('http://example.test').get('/test').basicAuth({ user: 'foo', pass: 'bar' }).reply(200, 'Here is the content');
    done();
  });

  it('succeeds when it matches', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var response;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return got('http://example.test/test', {
              username: 'foo',
              password: 'bar'
            });

          case 2:
            response = _context.sent;

            expect(response.statusCode).to.equal(200);
            expect(response.body).to.equal('Here is the content');

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('fails when it doesnt match', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return assertRejects(got('http://example.test/test'), /Nock: No match for request/);

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));
});

describe('basic auth with username only', function () {
  beforeEach(function (done) {
    nock('http://example.test').get('/test').basicAuth({ user: 'foo' }).reply(200, 'Here is the content');
    done();
  });

  it('succeeds when it matches', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var response;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return got('http://example.test/test', {
              username: 'foo',
              password: ''
            });

          case 2:
            response = _context3.sent;

            expect(response.statusCode).to.equal(200);
            expect(response.body).to.equal('Here is the content');

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  it('fails when it doesnt match', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return assertRejects(got('http://example.test/test'), /Nock: No match for request/);

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));
});