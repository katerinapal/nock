"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _got_client = require("./got_client");

var _got_client2 = _interopRequireDefault(_got_client);

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var expect = _chai2.default.expect;

var sinon = _sinon2.default;
var nock = _2.default;
var got = _got_client2.default;

// Tests for a regression where multiple ClientRequests call `.end` during the
// same event loop iteration. https://github.com/nock/nock/issues/1937

describe('interception in parallel', function () {
  var origin = 'https://example.test';
  var makeRequest = function makeRequest(opts) {
    return got(origin, opts).then(function (res) {
      return res.statusCode;
    }).catch(function (reason) {
      if (reason.code === 'ERR_NOCK_NO_MATCH') return 418;
      throw reason;
    });
  };

  it('consumes multiple requests, using multiple Interceptors on the same Scope', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var scope, results;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            scope = nock(origin);


            scope.get('/').reply(200);
            scope.get('/').reply(201);

            _context.next = 5;
            return _promise2.default.all([makeRequest(), makeRequest(), makeRequest()]);

          case 5:
            results = _context.sent;


            expect(results.sort()).to.deep.equal([200, 201, 418]);
            scope.done();

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('consumes multiple requests, using a single Interceptor', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var scope, results;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            scope = nock(origin).get('/').times(2).reply(200);
            _context2.next = 3;
            return _promise2.default.all([makeRequest(), makeRequest(), makeRequest()]);

          case 3:
            results = _context2.sent;


            expect(results.sort()).to.deep.equal([200, 200, 418]);
            scope.done();

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it('consumes multiple requests, using multiple Scopes', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var results;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            nock(origin).get('/').reply(200);
            nock(origin).get('/').reply(201);

            _context3.next = 4;
            return _promise2.default.all([makeRequest(), makeRequest(), makeRequest()]);

          case 4:
            results = _context3.sent;


            expect(results.sort()).to.deep.equal([200, 201, 418]);
            expect(nock.isDone()).to.equal(true);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  it('provides the correct request instance on the Interceptor inside reply callbacks', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var fooHeadersStub;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            fooHeadersStub = sinon.stub();


            nock(origin).persist().get('/').reply(function () {
              fooHeadersStub(this.req.headers.foo);
              return [200];
            });

            _context4.next = 4;
            return _promise2.default.all([makeRequest({ headers: { foo: 'A' } }), makeRequest({ headers: { foo: 'B' } })]);

          case 4:

            expect(fooHeadersStub).to.have.calledTwice();
            expect(fooHeadersStub).to.have.been.calledWithExactly('A');
            expect(fooHeadersStub).to.have.been.calledWithExactly('B');
            expect(nock.isDone()).to.equal(true);

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));
});