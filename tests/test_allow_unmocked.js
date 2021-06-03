"use strict";

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

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

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var expect = _chai2.default.expect;

var http = _http2.default;
var sinon = _sinon2.default;
var nock = _2.default;

var got = _got_client2.default;
var startHttpServer = _servers2.default.startHttpServer;


describe('allowUnmocked option', function () {
  it('with allowUnmocked, mocked request still works', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var scope, _ref2, body, statusCode;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            scope = nock('http://example.test', { allowUnmocked: true }).post('/').reply(200, '99problems');
            _context.next = 3;
            return got.post('http://example.test/');

          case 3:
            _ref2 = _context.sent;
            body = _ref2.body;
            statusCode = _ref2.statusCode;

            expect(statusCode).to.equal(200);
            expect(body).to.equal('99problems');

            scope.done();

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('allow unmocked works after one interceptor is removed', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var _ref4, origin;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return startHttpServer(function (request, response) {
              response.write('live');
              response.end();
            });

          case 2:
            _ref4 = _context2.sent;
            origin = _ref4.origin;


            nock(origin, { allowUnmocked: true }).get('/').reply(200, 'Mocked');

            _context2.t0 = expect;
            _context2.next = 8;
            return got(origin);

          case 8:
            _context2.t1 = _context2.sent.body;
            (0, _context2.t0)(_context2.t1).to.equal('Mocked');
            _context2.t2 = expect;
            _context2.next = 13;
            return got(origin);

          case 13:
            _context2.t3 = _context2.sent.body;
            (0, _context2.t2)(_context2.t3).to.equal('live');

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it('allow unmocked option allows traffic to server', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var _ref6, origin, scope, client, response1, response2, response3;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return startHttpServer(function (request, response) {
              switch (request.url) {
                case '/':
                  response.writeHead(200);
                  response.write('server served a response');
                  break;
                case '/not/available':
                  response.writeHead(404);
                  break;
                case '/abc':
                  response.writeHead(200);
                  response.write('server served a response');
                  break;
              }

              response.end();
            });

          case 2:
            _ref6 = _context3.sent;
            origin = _ref6.origin;
            scope = nock(origin, { allowUnmocked: true }).get('/abc').reply(304, 'served from our mock').get('/wont/get/here').reply(304, 'served from our mock');
            client = got.extend({ prefixUrl: origin, throwHttpErrors: false });
            _context3.next = 8;
            return client('abc');

          case 8:
            response1 = _context3.sent;

            expect(response1.statusCode).to.equal(304);
            expect(response1.body).to.equal('served from our mock');
            expect(scope.isDone()).to.equal(false);

            _context3.next = 14;
            return client('not/available');

          case 14:
            response2 = _context3.sent;

            expect(response2.statusCode).to.equal(404);
            expect(scope.isDone()).to.equal(false);

            _context3.next = 19;
            return client('');

          case 19:
            response3 = _context3.sent;

            expect(response3.statusCode).to.equal(200);
            expect(response3.body).to.equal('server served a response');
            expect(scope.isDone()).to.equal(false);

          case 23:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  it('allow unmocked post with json data', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var _ref8, origin, _ref9, body, statusCode;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return startHttpServer(function (request, response) {
              response.writeHead(200);
              response.write('{"message":"server response"}');
              response.end();
            });

          case 2:
            _ref8 = _context4.sent;
            origin = _ref8.origin;


            nock(origin, { allowUnmocked: true }).get('/not/accessed').reply(200, '{"message":"mocked response"}');

            _context4.next = 7;
            return got.post(origin, {
              json: { some: 'data' },
              responseType: 'json'
            });

          case 7:
            _ref9 = _context4.sent;
            body = _ref9.body;
            statusCode = _ref9.statusCode;

            expect(statusCode).to.equal(200);
            expect(body).to.deep.equal({ message: 'server response' });

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));

  it('allow unmocked passthrough with mismatched bodies', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
    var _ref11, origin, _ref12, body, statusCode;

    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return startHttpServer(function (request, response) {
              response.writeHead(200);
              response.write('{"message":"server response"}');
              response.end();
            });

          case 2:
            _ref11 = _context5.sent;
            origin = _ref11.origin;


            nock(origin, { allowUnmocked: true }).post('/post', { some: 'other data' }).reply(404, '{"message":"server response"}');

            _context5.next = 7;
            return got.post(origin + "/post", {
              json: { some: 'data' },
              responseType: 'json'
            });

          case 7:
            _ref12 = _context5.sent;
            body = _ref12.body;
            statusCode = _ref12.statusCode;

            expect(statusCode).to.equal(200);
            expect(body).to.deep.equal({ message: 'server response' });

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  })));

  it('match path using regexp with allowUnmocked', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
    var scope, _ref14, body, statusCode;

    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            scope = nock('http://example.test', { allowUnmocked: true }).get(/regex$/).reply(200, 'Match regex');
            _context6.next = 3;
            return got('http://example.test/resources/regex');

          case 3:
            _ref14 = _context6.sent;
            body = _ref14.body;
            statusCode = _ref14.statusCode;

            expect(statusCode).to.equal(200);
            expect(body).to.equal('Match regex');

            scope.done();

          case 9:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  })));

  // https://github.com/nock/nock/issues/1076
  it('match hostname using regexp with allowUnmocked', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
    var scope, _ref16, body, statusCode;

    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            scope = nock(/localhost/, { allowUnmocked: true }).get('/no/regex/here').reply(200, 'Match regex');
            _context7.next = 3;
            return got('http://localhost:3000/no/regex/here');

          case 3:
            _ref16 = _context7.sent;
            body = _ref16.body;
            statusCode = _ref16.statusCode;

            expect(statusCode).to.equal(200);
            expect(body).to.equal('Match regex');

            scope.done();

          case 9:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  })));

  // https://github.com/nock/nock/issues/1867
  it('match path using callback with allowUnmocked', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
    var scope, _ref18, statusCode;

    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            scope = nock('http://example.test', { allowUnmocked: true }).get(function (uri) {
              return uri.endsWith('bar');
            }).reply();
            _context8.next = 3;
            return got('http://example.test/foo/bar');

          case 3:
            _ref18 = _context8.sent;
            statusCode = _ref18.statusCode;

            expect(statusCode).to.equal(200);

            scope.done();

          case 7:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  })));

  // https://github.com/nock/nock/issues/835
  it('match multiple paths to domain using regexp with allowUnmocked', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
    var _ref20, origin, scope1, scope2;

    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return startHttpServer(function (request, response) {
              response.write('live');
              response.end();
            });

          case 2:
            _ref20 = _context9.sent;
            origin = _ref20.origin;
            scope1 = nock(/localhost/, { allowUnmocked: true }).get(/alpha/).reply(200, 'this is alpha');
            scope2 = nock(/localhost/, { allowUnmocked: true }).get(/bravo/).reply(200, 'bravo, bravo!');
            _context9.t0 = expect;
            _context9.next = 9;
            return got(origin);

          case 9:
            _context9.t1 = _context9.sent.body;
            (0, _context9.t0)(_context9.t1).to.equal('live');
            _context9.t2 = expect;
            _context9.next = 14;
            return got(origin + "/alphalicious");

          case 14:
            _context9.t3 = _context9.sent.body;
            (0, _context9.t2)(_context9.t3).to.equal('this is alpha');
            _context9.t4 = expect;
            _context9.next = 19;
            return got(origin + "/bravo-company");

          case 19:
            _context9.t5 = _context9.sent.body;
            (0, _context9.t4)(_context9.t5).to.equal('bravo, bravo!');


            scope1.done();
            scope2.done();

          case 23:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  })));

  it('match domain and path with literal query params and allowUnmocked', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
    var scope, _ref22, statusCode;

    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            scope = nock('http://example.test', { allowUnmocked: true }).get('/foo?bar=baz').reply();
            _context10.next = 3;
            return got('http://example.test/foo?bar=baz');

          case 3:
            _ref22 = _context10.sent;
            statusCode = _ref22.statusCode;


            expect(statusCode).to.equal(200);
            scope.done();

          case 7:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, undefined);
  })));

  it('match domain and path using regexp with query params and allowUnmocked', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
    var imgResponse, scope, _ref24, body, statusCode;

    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            imgResponse = 'Matched Images Page';
            scope = nock(/example/, { allowUnmocked: true }).get(/imghp\?hl=en/).reply(200, imgResponse);
            _context11.next = 4;
            return got('http://example.test/imghp?hl=en');

          case 4:
            _ref24 = _context11.sent;
            body = _ref24.body;
            statusCode = _ref24.statusCode;

            expect(statusCode).to.equal(200);
            expect(body).to.equal(imgResponse);

            scope.done();

          case 10:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, undefined);
  })));

  // https://github.com/nock/nock/issues/490
  it('match when query is specified with allowUnmocked', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
    var _ref26, origin, scope;

    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return startHttpServer(function (request, response) {
              response.write('live');
              response.end();
            });

          case 2:
            _ref26 = _context12.sent;
            origin = _ref26.origin;
            scope = nock(origin, { allowUnmocked: true }).get('/search').query({ q: 'cat pictures' }).reply(200, '😻');
            _context12.t0 = expect;
            _context12.next = 8;
            return got(origin);

          case 8:
            _context12.t1 = _context12.sent.body;
            (0, _context12.t0)(_context12.t1).to.equal('live');
            _context12.t2 = expect;
            _context12.next = 13;
            return got(origin + "/search?q=cat%20pictures");

          case 13:
            _context12.t3 = _context12.sent.body;
            (0, _context12.t2)(_context12.t3).to.equal('😻');


            scope.done();

          case 16:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, undefined);
  })));

  // https://github.com/nock/nock/issues/1832
  it('should only emit "finish" once even if an unmocked request is created after playback as started', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
    var _ref28, origin, port, scope, req, finishSpy;

    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return startHttpServer(function (request, response) {
              return response.end();
            });

          case 2:
            _ref28 = _context13.sent;
            origin = _ref28.origin;
            port = _ref28.port;
            scope = nock(origin, { allowUnmocked: true }).post('/', 'foo').reply();
            req = http.request({
              host: 'localhost',
              port: port,
              method: 'POST',
              path: '/'
            });
            finishSpy = sinon.spy();

            req.on('finish', finishSpy);

            return _context13.abrupt("return", new _promise2.default(function (resolve) {
              req.on('response', function () {
                expect(finishSpy).to.have.been.calledOnce();
                expect(scope.isDone()).to.be.false();
                resolve();
              });
              req.write('bar'); // a mismatched body causes a late unmocked request
              req.end();
            }));

          case 10:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, undefined);
  })));
});