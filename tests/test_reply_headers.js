"use strict";

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _got_client = require("./got_client");

var _got_client2 = _interopRequireDefault(_got_client);

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _fakeTimers = require("@sinonjs/fake-timers");

var _fakeTimers2 = _interopRequireDefault(_fakeTimers);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

// Tests for header objects passed to `.reply()`, including header objects
// containing lambdas.

var IncomingMessage = _http2.default.IncomingMessage;
var expect = _chai2.default.expect;

var sinon = _sinon2.default;
var fakeTimers = _fakeTimers2.default;
var nock = _2.default;
var got = _got_client2.default;

describe('`reply()` headers', function () {
  describe('using parameter value', function () {
    it('as array', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var scope, _ref2, headers, rawHeaders;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              scope = nock('http://example.test').get('/').reply(200, 'Hello World!', ['X-My-Header', 'My Header value', 'X-Other-Header', 'My Other Value']);
              _context.next = 3;
              return got('http://example.test/');

            case 3:
              _ref2 = _context.sent;
              headers = _ref2.headers;
              rawHeaders = _ref2.rawHeaders;


              expect(headers).to.deep.equal({
                'x-my-header': 'My Header value',
                'x-other-header': 'My Other Value'
              });
              expect(rawHeaders).to.deep.equal(['X-My-Header', 'My Header value', 'X-Other-Header', 'My Other Value']);
              scope.done();

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined);
    })));

    it('given an invalid array, raises the expected error', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      var scope;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              scope = nock('http://example.test').get('/');


              expect(function () {
                return scope.reply(200, 'Hello World!', ['one', 'two', 'three']);
              }).to.throw(Error, 'Raw headers must be provided as an array with an even number of items. [fieldName, value, ...]');

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    })));

    // https://nodejs.org/api/http.html#http_message_headers
    it('folds duplicate headers the same as Node', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
      var replyHeaders, scope, _ref5, headers, rawHeaders;

      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              replyHeaders = ['Content-Type', 'text/html; charset=utf-8', 'set-cookie', ['set-cookie1=foo', 'set-cookie2=bar'], 'set-cookie', 'set-cookie3=baz', 'CONTENT-TYPE', 'text/xml', 'cookie', 'cookie1=foo; cookie2=bar', 'cookie', 'cookie3=baz', 'x-custom', 'custom1', 'X-Custom', ['custom2', 'custom3']];
              scope = nock('http://example.test').get('/').reply(200, 'Hello World!', replyHeaders);
              _context3.next = 4;
              return got('http://example.test/');

            case 4:
              _ref5 = _context3.sent;
              headers = _ref5.headers;
              rawHeaders = _ref5.rawHeaders;


              expect(headers).to.deep.equal({
                'content-type': 'text/html; charset=utf-8',
                'set-cookie': ['set-cookie1=foo', 'set-cookie2=bar', 'set-cookie3=baz'],
                cookie: 'cookie1=foo; cookie2=bar; cookie3=baz',
                'x-custom': 'custom1, custom2, custom3'
              });
              expect(rawHeaders).to.deep.equal(replyHeaders);

              scope.done();

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    })));

    it('as object', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
      var scope, _ref7, headers, rawHeaders;

      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              scope = nock('http://example.test').get('/').reply(200, 'Hello World!', { 'X-My-Headers': 'My Header value' });
              _context4.next = 3;
              return got('http://example.test/');

            case 3:
              _ref7 = _context4.sent;
              headers = _ref7.headers;
              rawHeaders = _ref7.rawHeaders;


              expect(headers).to.deep.equal({ 'x-my-headers': 'My Header value' });
              expect(rawHeaders).to.deep.equal(['X-My-Headers', 'My Header value']);
              scope.done();

            case 9:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    })));

    it('as Map', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
      var replyHeaders, scope, _ref9, headers, rawHeaders;

      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              replyHeaders = new _map2.default([['X-My-Header', 'My Header value'], ['X-Other-Header', 'My Other Value']]);
              scope = nock('http://example.test').get('/').reply(200, 'Hello World!', replyHeaders);
              _context5.next = 4;
              return got('http://example.test/');

            case 4:
              _ref9 = _context5.sent;
              headers = _ref9.headers;
              rawHeaders = _ref9.rawHeaders;


              expect(headers).to.deep.equal({
                'x-my-header': 'My Header value',
                'x-other-header': 'My Other Value'
              });
              expect(rawHeaders).to.deep.equal(['X-My-Header', 'My Header value', 'X-Other-Header', 'My Other Value']);
              scope.done();

            case 10:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, undefined);
    })));

    it('given invalid data types, raises the expected error', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
      var scope;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              scope = nock('http://example.test').get('/');


              expect(function () {
                return scope.reply(200, 'Hello World!', 'foo: bar');
              }).to.throw(Error, 'Headers must be provided as an array of raw values, a Map, or a plain Object. foo: bar');

              expect(function () {
                return scope.reply(200, 'Hello World!', false);
              }).to.throw(Error, 'Headers must be provided as an array of raw values, a Map, or a plain Object. false');

            case 3:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, undefined);
    })));
  });

  describe('using synchronous reply function', function () {
    it('as array', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
      var scope, _ref12, headers, rawHeaders;

      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              scope = nock('http://example.test').get('/').reply(function () {
                return [200, 'Hello World!', ['X-My-Header', 'My Header value', 'X-Other-Header', 'My Other Value']];
              });
              _context7.next = 3;
              return got('http://example.test/');

            case 3:
              _ref12 = _context7.sent;
              headers = _ref12.headers;
              rawHeaders = _ref12.rawHeaders;


              expect(headers).to.deep.equal({
                'x-my-header': 'My Header value',
                'x-other-header': 'My Other Value'
              });
              expect(rawHeaders).to.deep.equal(['X-My-Header', 'My Header value', 'X-Other-Header', 'My Other Value']);
              scope.done();

            case 9:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, undefined);
    })));

    it('as object', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
      var scope, _ref14, headers, rawHeaders;

      return _regenerator2.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              scope = nock('http://example.test').get('/').reply(function () {
                return [200, 'Hello World!', { 'X-My-Headers': 'My Header value' }];
              });
              _context8.next = 3;
              return got('http://example.test/');

            case 3:
              _ref14 = _context8.sent;
              headers = _ref14.headers;
              rawHeaders = _ref14.rawHeaders;


              expect(headers).to.deep.equal({ 'x-my-headers': 'My Header value' });
              expect(rawHeaders).to.deep.equal(['X-My-Headers', 'My Header value']);
              scope.done();

            case 9:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, undefined);
    })));

    it('as Map', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
      var replyHeaders, scope, _ref16, headers, rawHeaders;

      return _regenerator2.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              replyHeaders = new _map2.default([['X-My-Header', 'My Header value'], ['X-Other-Header', 'My Other Value']]);
              scope = nock('http://example.test').get('/').reply(function () {
                return [200, 'Hello World!', replyHeaders];
              });
              _context9.next = 4;
              return got('http://example.test/');

            case 4:
              _ref16 = _context9.sent;
              headers = _ref16.headers;
              rawHeaders = _ref16.rawHeaders;


              expect(headers).to.deep.equal({
                'x-my-header': 'My Header value',
                'x-other-header': 'My Other Value'
              });
              expect(rawHeaders).to.deep.equal(['X-My-Header', 'My Header value', 'X-Other-Header', 'My Other Value']);
              scope.done();

            case 10:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, undefined);
    })));
  });

  describe('using functions', function () {
    it('sends the result back in the response', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
      var scope, _ref18, headers, rawHeaders;

      return _regenerator2.default.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              scope = nock('http://example.test').get('/').reply(200, 'boo!', {
                'X-My-Headers': function XMyHeaders() {
                  return 'yo!';
                }
              });
              _context10.next = 3;
              return got('http://example.test/');

            case 3:
              _ref18 = _context10.sent;
              headers = _ref18.headers;
              rawHeaders = _ref18.rawHeaders;


              expect(headers).to.deep.equal({ 'x-my-headers': 'yo!' });
              expect(rawHeaders).to.deep.equal(['X-My-Headers', 'yo!']);
              scope.done();

            case 9:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, undefined);
    })));

    it('receives the correct arguments', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
      var myHeaderFnCalled, OverriddenClientRequest, scope;
      return _regenerator2.default.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              myHeaderFnCalled = sinon.spy();
              OverriddenClientRequest = _http2.default.ClientRequest;
              scope = nock('http://example.test').post('/').reply(200, 'boo!', {
                'X-My-Headers': function XMyHeaders(req, res, body) {
                  myHeaderFnCalled();
                  expect(req).to.be.an.instanceof(OverriddenClientRequest);
                  expect(res).to.be.an.instanceof(IncomingMessage);
                  expect(body).to.equal('boo!');
                  return 'gotcha';
                }
              });
              _context11.next = 5;
              return got.post('http://example.test/');

            case 5:

              expect(myHeaderFnCalled).to.have.been.called();
              scope.done();

            case 7:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, undefined);
    })));

    it('is evaluated exactly once', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
      var myHeaderFnCalled, scope;
      return _regenerator2.default.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              myHeaderFnCalled = sinon.spy();
              scope = nock('http://example.test').get('/').reply(200, 'boo!', {
                'X-My-Headers': function XMyHeaders() {
                  myHeaderFnCalled();
                  return 'heya';
                }
              });
              _context12.next = 4;
              return got('http://example.test/');

            case 4:

              expect(myHeaderFnCalled).to.have.been.calledOnce();
              scope.done();

            case 6:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12, undefined);
    })));

    it('when keys are duplicated, is evaluated once per input field name, in correct order', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
      var replyHeaders, scope, _ref22, headers, rawHeaders;

      return _regenerator2.default.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              replyHeaders = ['X-MY-HEADER', function () {
                return 'one';
              }, 'x-my-header', function () {
                return 'two';
              }];
              scope = nock('http://example.test').get('/').reply(200, 'Hello World!', replyHeaders);
              _context13.next = 4;
              return got('http://example.test/');

            case 4:
              _ref22 = _context13.sent;
              headers = _ref22.headers;
              rawHeaders = _ref22.rawHeaders;


              expect(headers).to.deep.equal({ 'x-my-header': 'one, two' });
              expect(rawHeaders).to.deep.equal(['X-MY-HEADER', 'one', 'x-my-header', 'two']);

              scope.done();

            case 10:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13, undefined);
    })));

    it('is re-evaluated for a subsequent request', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14() {
      var counter, scope, _ref24, headers, rawHeaders, _ref25, headers2, rawHeaders2;

      return _regenerator2.default.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              counter = 0;
              scope = nock('http://example.test').get('/').times(2).reply(200, 'boo!', {
                'X-My-Headers': function XMyHeaders() {
                  return "" + ++counter;
                }
              });
              _context14.next = 4;
              return got('http://example.test/');

            case 4:
              _ref24 = _context14.sent;
              headers = _ref24.headers;
              rawHeaders = _ref24.rawHeaders;

              expect(headers).to.deep.equal({ 'x-my-headers': '1' });
              expect(rawHeaders).to.deep.equal(['X-My-Headers', '1']);

              expect(counter).to.equal(1);

              _context14.next = 12;
              return got('http://example.test/');

            case 12:
              _ref25 = _context14.sent;
              headers2 = _ref25.headers;
              rawHeaders2 = _ref25.rawHeaders;

              expect(headers2).to.deep.equal({ 'x-my-headers': '2' });
              expect(rawHeaders2).to.deep.equal(['X-My-Headers', '2']);

              expect(counter).to.equal(2);

              scope.done();

            case 19:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14, undefined);
    })));
  });
});

describe('`replyContentLength()`', function () {
  it('sends explicit content-length header with response', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15() {
    var response, scope, _ref27, headers;

    return _regenerator2.default.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            response = { hello: 'world' };
            scope = nock('http://example.test').replyContentLength().get('/').reply(200, response);
            _context15.next = 4;
            return got('http://example.test/');

          case 4:
            _ref27 = _context15.sent;
            headers = _ref27.headers;


            expect(headers['content-length']).to.equal("" + (0, _stringify2.default)(response).length);
            scope.done();

          case 8:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, undefined);
  })));
});

describe('`replyDate()`', function () {
  it('sends explicit date header with response', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16() {
    var date, scope, _ref29, headers;

    return _regenerator2.default.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            date = new Date();
            scope = nock('http://example.test').replyDate(date).get('/').reply();
            _context16.next = 4;
            return got('http://example.test/');

          case 4:
            _ref29 = _context16.sent;
            headers = _ref29.headers;


            expect(headers.date).to.equal(date.toUTCString());
            scope.done();

          case 8:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, undefined);
  })));

  describe('with mock timers', function () {
    var clock = void 0;
    beforeEach(function () {
      clock = fakeTimers.install();
    });
    afterEach(function () {
      if (clock) {
        clock.uninstall();
        clock = undefined;
      }
    });

    it('sends date header with response', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17() {
      var scope, req, _ref31, headers, date;

      return _regenerator2.default.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              scope = nock('http://example.test').replyDate().get('/').reply();
              req = got('http://example.test/');

              clock.tick();
              _context17.next = 5;
              return req;

            case 5:
              _ref31 = _context17.sent;
              headers = _ref31.headers;
              date = new Date();

              expect(headers).to.include({ date: date.toUTCString() });

              scope.done();

            case 10:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17, undefined);
    })));
  });
});