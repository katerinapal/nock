"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _servers = require("./servers");

var _servers2 = _interopRequireDefault(_servers);

var _got_client = require("./got_client");

var _got_client2 = _interopRequireDefault(_got_client);

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _assertRejects = require("assert-rejects");

var _assertRejects2 = _interopRequireDefault(_assertRejects);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var expect = _chai2.default.expect;

var assertRejects = _assertRejects2.default;
var sinon = _sinon2.default;
var nock = _2.default;

var got = _got_client2.default;
var servers = _servers2.default;

describe('`disableNetConnect()`', function () {
  it('prevents connection to unmocked hosts', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            nock.disableNetConnect();

            nock('http://www.example.test').get('/').reply(200);

            _context.next = 4;
            return assertRejects(got('https://other.example.test/'), /Nock: Disallowed net connect for "other.example.test:443\/"/);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('prevents connections when no hosts are mocked', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            nock.disableNetConnect();

            _context2.next = 3;
            return assertRejects(got('http://example.test'), function (err) {
              expect(err).to.include({
                code: 'ENETUNREACH',
                message: 'Nock: Disallowed net connect for "example.test:80/"'
              });
              expect(err.stack).to.be.a('string');
              return true;
            });

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));
});

describe('`enableNetConnect()`', function () {
  it('enables real HTTP request only for specified domain, via string', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var onResponse, _ref4, origin;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            onResponse = sinon.spy();
            _context3.next = 3;
            return servers.startHttpServer(function (request, response) {
              onResponse();
              response.writeHead(200);
              response.end();
            });

          case 3:
            _ref4 = _context3.sent;
            origin = _ref4.origin;


            nock.enableNetConnect('localhost');

            _context3.next = 8;
            return got(origin);

          case 8:
            expect(onResponse).to.have.been.calledOnce();

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  it('disallows request for other domains, via string', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            nock.enableNetConnect('localhost');

            _context4.next = 3;
            return assertRejects(got('https://example.test/'), /Nock: Disallowed net connect for "example.test:443\/"/);

          case 3:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));

  it('enables real HTTP request only for specified domain, via regexp', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
    var onResponse, _ref7, origin;

    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            onResponse = sinon.spy();
            _context5.next = 3;
            return servers.startHttpServer(function (request, response) {
              onResponse();
              response.writeHead(200);
              response.end();
            });

          case 3:
            _ref7 = _context5.sent;
            origin = _ref7.origin;


            nock.enableNetConnect(/ocalhos/);

            _context5.next = 8;
            return got(origin);

          case 8:
            expect(onResponse).to.have.been.calledOnce();

          case 9:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  })));

  it('disallows request for other domains, via regexp', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            nock.enableNetConnect(/ocalhos/);

            _context6.next = 3;
            return assertRejects(got('https://example.test/'), /Nock: Disallowed net connect for "example.test:443\/"/);

          case 3:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  })));

  it('enables real HTTP request only for specified domain, via function', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
    var onResponse, _ref10, origin;

    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            onResponse = sinon.spy();
            _context7.next = 3;
            return servers.startHttpServer(function (request, response) {
              onResponse();
              response.writeHead(200);
              response.end();
            });

          case 3:
            _ref10 = _context7.sent;
            origin = _ref10.origin;


            nock.enableNetConnect(function (host) {
              return host.includes('ocalhos');
            });

            _context7.next = 8;
            return got(origin);

          case 8:
            expect(onResponse).to.have.been.calledOnce();

          case 9:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  })));

  it('disallows request for other domains, via function', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            nock.enableNetConnect(function (host) {
              return host.includes('ocalhos');
            });

            _context8.next = 3;
            return assertRejects(got('https://example.test/'), /Nock: Disallowed net connect for "example.test:443\/"/);

          case 3:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  })));

  it('passes the domain to be tested, via function', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
    var matcher;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            matcher = sinon.stub().returns(false);

            nock.enableNetConnect(matcher);

            _context9.next = 4;
            return got('https://example.test/').catch(function () {
              return undefined;
            });

          case 4:
            // ignore rejection, expected

            expect(matcher).to.have.been.calledOnceWithExactly('example.test:443');

          case 5:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  })));
});