"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _servers = require("./servers");

var _servers2 = _interopRequireDefault(_servers);

var _got_client = require("./got_client");

var _got_client2 = _interopRequireDefault(_got_client);

var _assertRejects = require("assert-rejects");

var _assertRejects2 = _interopRequireDefault(_assertRejects);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var http = _http2.default;
var expect = _chai2.default.expect;

var nock = _2.default;
var sinon = _sinon2.default;
var assertRejects = _assertRejects2.default;

var got = _got_client2.default;
var servers = _servers2.default;

describe('Nock lifecycle functions', function () {
  describe('`activate()`', function () {
    it('double activation throws exception', function () {
      nock.restore();
      expect(nock.isActive()).to.be.false();

      nock.activate();
      expect(nock.isActive()).to.be.true();

      expect(function () {
        return nock.activate();
      }).to.throw(Error, 'Nock already active');

      expect(nock.isActive()).to.be.true();
    });

    it('(re-)activate after restore', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var onResponse, _ref2, origin, scope;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              onResponse = sinon.spy();
              _context.next = 3;
              return servers.startHttpServer(function (request, response) {
                onResponse();

                if (request.url === '/') {
                  response.writeHead(200);
                  response.write('server served a response');
                }

                response.end();
              });

            case 3:
              _ref2 = _context.sent;
              origin = _ref2.origin;
              scope = nock(origin).get('/').reply(304, 'served from our mock');


              nock.restore();
              expect(nock.isActive()).to.be.false();

              _context.t0 = expect;
              _context.next = 11;
              return got(origin);

            case 11:
              _context.t1 = _context.sent;
              _context.t2 = { statusCode: 200 };
              (0, _context.t0)(_context.t1).to.include(_context.t2);


              expect(scope.isDone()).to.be.false();

              nock.activate();
              expect(nock.isActive()).to.be.true();

              _context.t3 = expect;
              _context.next = 20;
              return got(origin);

            case 20:
              _context.t4 = _context.sent;
              _context.t5 = { statusCode: 304 };
              (0, _context.t3)(_context.t4).to.include(_context.t5);


              expect(scope.isDone()).to.be.true();

              expect(onResponse).to.have.been.calledOnce();

            case 25:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined);
    })));
  });

  describe('`cleanAll()`', function () {
    it('removes a half-consumed mock', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              nock('http://example.test').get('/').twice().reply();

              _context2.next = 3;
              return got('http://example.test/');

            case 3:

              nock.cleanAll();

              _context2.next = 6;
              return assertRejects(got('http://example.test/'), function (err) {
                expect(err).to.include({ name: 'RequestError', code: 'ENOTFOUND' });
                return true;
              });

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    })));

    it('removes pending mocks from all scopes', function () {
      var scope1 = nock('http://example.test').get('/somepath').reply(200, 'hey');
      expect(scope1.pendingMocks()).to.deep.equal(['GET http://example.test:80/somepath']);
      var scope2 = nock('http://example.test').get('/somepath').reply(200, 'hey');
      expect(scope2.pendingMocks()).to.deep.equal(['GET http://example.test:80/somepath']);

      nock.cleanAll();

      expect(scope1.pendingMocks()).to.be.empty();
      expect(scope2.pendingMocks()).to.be.empty();
    });

    it('removes persistent mocks', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              nock('http://example.test').persist().get('/').reply();

              nock.cleanAll();

              _context3.next = 4;
              return assertRejects(got('http://example.test/'), function (err) {
                expect(err).to.include({
                  name: 'RequestError',
                  code: 'ENOTFOUND'
                });
                return true;
              });

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    })));

    it('should be safe to call in the middle of a request', function (done) {
      // This covers a race-condition where cleanAll() is called while a request
      // is in mid-flight. The request itself should continue to process normally.
      // Notably, `cleanAll` is being called before the Interceptor is marked as
      // consumed and removed from the global map. Having this test wait until the
      // response event means we verify it didn't throw an error when attempting
      // to remove an Interceptor that doesn't exist in the global map `allInterceptors`.
      nock('http://example.test').get('/').reply();

      var req = http.request('http://example.test', function () {
        done();
      });
      req.once('socket', function () {
        nock.cleanAll();
      });

      req.end();
    });
  });

  describe('`isDone()`', function () {
    it('returns false while a mock is pending, and true after it is consumed', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
      var scope;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              scope = nock('http://example.test').get('/').reply();


              expect(nock.isDone()).to.be.false();

              _context4.next = 4;
              return got('http://example.test/');

            case 4:

              expect(nock.isDone()).to.be.true();

              scope.done();

            case 6:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    })));
  });

  describe('`pendingMocks()`', function () {
    it('returns the expected array while a mock is pending, and an empty array after it is consumed', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              nock('http://example.test').get('/').reply();

              expect(nock.pendingMocks()).to.deep.equal(['GET http://example.test:80/']);

              _context5.next = 4;
              return got('http://example.test/');

            case 4:

              expect(nock.pendingMocks()).to.be.empty();

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, undefined);
    })));
  });

  describe('`activeMocks()`', function () {
    it('returns the expected array for incomplete mocks', function () {
      nock('http://example.test').get('/').reply(200);
      expect(nock.activeMocks()).to.deep.equal(['GET http://example.test:80/']);
    });

    it("activeMocks doesn't return completed mocks", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              nock('http://example.test').get('/').reply();

              _context6.next = 3;
              return got('http://example.test/');

            case 3:
              expect(nock.activeMocks()).to.be.empty();

            case 4:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, undefined);
    })));
  });

  describe('resetting nock catastrophically while a request is in progress', function () {
    it('is handled gracefully', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
      var somethingBad, responseBody, scope, _ref9, body;

      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              somethingBad = function somethingBad() {
                nock.cleanAll();
              };
              // While invoking cleanAll() from a nock request handler isn't very
              // realistic, it's possible that user code under test could crash, causing
              // before or after hooks to fire, which invoke `nock.cleanAll()`. A little
              // extreme, though if this does happen, we may as well be graceful about it.


              responseBody = 'hi';
              scope = nock('http://example.test').get('/somepath').reply(200, function (uri, requestBody) {
                somethingBad();
                return responseBody;
              });
              _context7.next = 5;
              return got('http://example.test/somepath');

            case 5:
              _ref9 = _context7.sent;
              body = _ref9.body;


              expect(body).to.equal(responseBody);
              scope.done();

            case 9:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, undefined);
    })));
  });

  describe('`abortPendingRequests()`', function () {
    it('prevents the request from completing', function (done) {
      var onRequest = sinon.spy();

      nock('http://example.test').get('/').delayConnection(100).reply(200, 'OK');

      http.get('http://example.test', onRequest);

      setTimeout(function () {
        expect(onRequest).not.to.have.been.called();
        done();
      }, 200);
      process.nextTick(nock.abortPendingRequests);
    });
  });
});