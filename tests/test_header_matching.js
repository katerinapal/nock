"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

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

var _assertRejects = require("assert-rejects");

var _assertRejects2 = _interopRequireDefault(_assertRejects);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var http = _http2.default;
var assertRejects = _assertRejects2.default;
var expect = _chai2.default.expect;

var sinon = _sinon2.default;
var nock = _2.default;
var got = _got_client2.default;

describe('Header matching', function () {
  describe('`Scope.matchHeader()`', function () {
    it('should match headers with function: gets the expected argument', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var matchHeaderStub, scope, _ref2, statusCode, body;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              matchHeaderStub = sinon.stub().returns(true);
              scope = nock('http://example.test').matchHeader('x-my-headers', matchHeaderStub)
              // `.matchHeader()` is called on the interceptor. It precedes the call to
              // `.get()`.
              .get('/').reply(200, 'Hello World!');
              _context.next = 4;
              return got('http://example.test/', {
                headers: { 'X-My-Headers': 456 }
              });

            case 4:
              _ref2 = _context.sent;
              statusCode = _ref2.statusCode;
              body = _ref2.body;


              // TODO: It's surprising that this function receives a number instead of
              // a string. Probably this behavior should be changed.
              expect(matchHeaderStub).to.have.been.calledOnceWithExactly(456);
              expect(statusCode).to.equal(200);
              expect(body).to.equal('Hello World!');
              scope.done();

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined);
    })));

    it('should not match headers with function: does not match when match declined', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              nock('http://example.test').matchHeader('x-my-headers', function () {
                return false;
              })
              // `.matchHeader()` is called on the interceptor. It precedes the call to
              // `.get()`.
              .get('/').reply(200, 'Hello World!');

              _context2.next = 3;
              return assertRejects(got('http://example.test/', {
                headers: { 'X-My-Headers': 456 }
              }), /Nock: No match for request/);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    })));

    it('should not consume mock request when match is declined by function', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
      var scope;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              scope = nock('http://example.test').matchHeader('x-my-headers', function () {
                return false;
              })
              // `.matchHeader()` is called on the interceptor. It precedes the call to
              // `.get()`.
              .get('/').reply(200, 'Hello World!');
              _context3.next = 3;
              return assertRejects(got('http://example.test/', {
                headers: { '-My-Headers': 456 }
              }), /Nock: No match for request/);

            case 3:

              expect(scope.isDone()).to.be.false();

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    })));

    it('should match headers on all Interceptors created from Scope', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
      var scope, response1, response2;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              scope = nock('http://example.test').matchHeader('accept', 'application/json').get('/one').reply(200, { hello: 'world' }).get('/two').reply(200, { a: 1, b: 2, c: 3 });
              _context4.next = 3;
              return got('http://example.test/one', {
                headers: { Accept: 'application/json' }
              });

            case 3:
              response1 = _context4.sent;


              expect(response1.statusCode).to.equal(200);
              expect(response1.body).to.equal('{"hello":"world"}');

              _context4.next = 8;
              return got('http://example.test/two', {
                headers: { Accept: 'application/json' }
              });

            case 8:
              response2 = _context4.sent;

              expect(response2.statusCode).to.equal(200);
              expect(response2.body).to.equal('{"a":1,"b":2,"c":3}');

              scope.done();

            case 12:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    })));
  });

  describe('`Interceptor.matchHeader()`', function () {
    it('should match a simple header', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
      var scope, _ref7, statusCode, body;

      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              scope = nock('http://example.test').get('/').matchHeader('x-my-headers', 'My custom Header value').reply(200, 'Hello World!');
              _context5.next = 3;
              return got('http://example.test/', {
                headers: { 'X-My-Headers': 'My custom Header value' }
              });

            case 3:
              _ref7 = _context5.sent;
              statusCode = _ref7.statusCode;
              body = _ref7.body;


              expect(statusCode).to.equal(200);
              expect(body).to.equal('Hello World!');
              scope.done();

            case 9:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, undefined);
    })));

    // https://github.com/nock/nock/issues/399
    // https://github.com/nock/nock/issues/822
    it('should match headers coming in as an array', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
      var scope, _ref9, statusCode;

      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              scope = nock('http://example.test').get('/').matchHeader('x-my-headers', 'My custom Header value').reply();
              _context6.next = 3;
              return got('http://example.test/', {
                headers: { 'X-My-Headers': ['My custom Header value'] }
              });

            case 3:
              _ref9 = _context6.sent;
              statusCode = _ref9.statusCode;


              expect(statusCode).to.equal(200);
              scope.done();

            case 7:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, undefined);
    })));

    it('should match multiple headers', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
      var scope, response1, response2;
      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              scope = nock('http://example.test').get('/').matchHeader('x-my-headers', 'My custom Header value').reply(200, 'Hello World!').get('/').matchHeader('x-my-headers', 'other value').reply(200, 'Hello World other value!');
              _context7.next = 3;
              return got('http://example.test/', {
                headers: { 'X-My-Headers': 'other value' }
              });

            case 3:
              response1 = _context7.sent;


              expect(response1.statusCode).to.equal(200);
              expect(response1.body).to.equal('Hello World other value!');

              _context7.next = 8;
              return got('http://example.test/', {
                headers: { 'X-My-Headers': 'My custom Header value' }
              });

            case 8:
              response2 = _context7.sent;


              expect(response2.statusCode).to.equal(200);
              expect(response2.body).to.equal('Hello World!');

              scope.done();

            case 12:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, undefined);
    })));

    it('should match headers with regexp', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
      var scope, _ref12, statusCode, body;

      return _regenerator2.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              scope = nock('http://example.test').get('/').matchHeader('x-my-headers', /My He.d.r [0-9.]+/).reply(200, 'Hello World!');
              _context8.next = 3;
              return got('http://example.test/', {
                headers: { 'X-My-Headers': 'My Header 1.0' }
              });

            case 3:
              _ref12 = _context8.sent;
              statusCode = _ref12.statusCode;
              body = _ref12.body;


              expect(statusCode).to.equal(200);
              expect(body).to.equal('Hello World!');
              scope.done();

            case 9:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, undefined);
    })));

    it('should match headers provided as numbers with regexp', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
      var scope, _ref14, statusCode, body;

      return _regenerator2.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              scope = nock('http://example.test').get('/').matchHeader('x-my-headers', /\d+/).reply(200, 'Hello World!');
              _context9.next = 3;
              return got('http://example.test/', {
                headers: { 'X-My-Headers': 123 }
              });

            case 3:
              _ref14 = _context9.sent;
              statusCode = _ref14.statusCode;
              body = _ref14.body;


              expect(statusCode).to.equal(200);
              expect(body).to.equal('Hello World!');
              scope.done();

            case 9:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, undefined);
    })));

    it('should match headers with function that gets the expected argument', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
      var matchHeaderStub, scope, _ref16, statusCode, body;

      return _regenerator2.default.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              matchHeaderStub = sinon.stub().returns(true);
              scope = nock('http://example.test').get('/').matchHeader('x-my-headers', matchHeaderStub).reply(200, 'Hello World!');
              _context10.next = 4;
              return got('http://example.test/', {
                headers: { 'X-My-Headers': 456 }
              });

            case 4:
              _ref16 = _context10.sent;
              statusCode = _ref16.statusCode;
              body = _ref16.body;


              // TODO: It's surprising that this function receives a number instead of
              // a string. Probably this behavior should be changed.
              expect(matchHeaderStub).to.have.been.calledOnceWithExactly(456);
              expect(statusCode).to.equal(200);
              expect(body).to.equal('Hello World!');
              scope.done();

            case 11:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, undefined);
    })));

    it('should match headers with function and allow unmocked: matches when match accepted', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
      var scope, _ref18, statusCode, body;

      return _regenerator2.default.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              scope = nock('http://example.test', { allowUnmocked: true }).get('/').matchHeader('x-my-headers', function () {
                return true;
              }).reply(200, 'Hello World!');
              _context11.next = 3;
              return got('http://example.test/', {
                headers: { 'X-My-Headers': 456 }
              });

            case 3:
              _ref18 = _context11.sent;
              statusCode = _ref18.statusCode;
              body = _ref18.body;


              expect(statusCode).to.equal(200);
              expect(body).to.equal('Hello World!');
              scope.done();

            case 9:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, undefined);
    })));

    it('should not match headers with function: does not match when match declined', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
      return _regenerator2.default.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              nock('http://example.test').get('/').matchHeader('x-my-headers', function () {
                return false;
              }).reply(200, 'Hello World!');

              _context12.next = 3;
              return assertRejects(got('http://example.test/', {
                headers: { 'X-My-Headers': 456 }
              }), /Nock: No match for request/);

            case 3:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12, undefined);
    })));

    it('should not consume mock request when match is declined by function', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
      var scope;
      return _regenerator2.default.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              scope = nock('http://example.test').get('/').matchHeader('x-my-headers', function () {
                return false;
              }).reply(200, 'Hello World!');
              _context13.next = 3;
              return assertRejects(got('http://example.test/', {
                headers: { '-My-Headers': 456 }
              }), /Nock: No match for request/);

            case 3:

              expect(scope.isDone()).to.be.false();

            case 4:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13, undefined);
    })));

    it('should match basic authentication header', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14() {
      var username, password, authString, expectedAuthHeader, scope, _ref22, statusCode, body;

      return _regenerator2.default.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              username = 'testuser';
              password = 'testpassword';
              authString = Buffer.from(username + ":" + password).toString('base64');
              expectedAuthHeader = "Basic " + authString;
              scope = nock('http://example.test').get('/').matchHeader('Authorization', function (val) {
                return val === expectedAuthHeader;
              }).reply(200, 'Hello World!');
              _context14.next = 7;
              return got('http://example.test/', {
                username: username,
                password: password
              });

            case 7:
              _ref22 = _context14.sent;
              statusCode = _ref22.statusCode;
              body = _ref22.body;


              expect(statusCode).to.equal(200);
              expect(body).to.equal('Hello World!');
              scope.done();

            case 13:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14, undefined);
    })));
  });

  describe('`Scope#reqheaders`', function () {
    it('should fail when specified request header is missing', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15() {
      return _regenerator2.default.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              nock('http://example.test', {
                reqheaders: {
                  'X-App-Token': 'apptoken',
                  'X-Auth-Token': 'apptoken'
                }
              }).post('/').reply(200, { status: 'ok' });

              _context15.next = 3;
              return assertRejects(got.post('http://example.test/', {
                headers: { 'X-App-Token': 'apptoken' }
              }), /Nock: No match for request/);

            case 3:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15, undefined);
    })));

    it('should match when request header matches regular expression', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16() {
      var scope, _ref25, statusCode;

      return _regenerator2.default.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              scope = nock('http://example.test', {
                reqheaders: { 'X-My-Super-Power': /.+/ }
              }).post('/').reply();
              _context16.next = 3;
              return got.post('http://example.test/', {
                headers: { 'X-My-Super-Power': 'mullet growing' }
              });

            case 3:
              _ref25 = _context16.sent;
              statusCode = _ref25.statusCode;


              expect(statusCode).to.equal(200);
              scope.done();

            case 7:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16, undefined);
    })));

    it('should not match when request header does not match regular expression', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17() {
      var scope;
      return _regenerator2.default.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              scope = nock('http://example.test', {
                reqheaders: {
                  'X-My-Super-Power': /Mullet.+/
                }
              }).post('/').reply();
              _context17.next = 3;
              return assertRejects(got.post('http://example.test/', {
                headers: { 'X-My-Super-Power': 'mullet growing' }
              }), /Nock: No match/);

            case 3:

              expect(scope.isDone()).to.be.false();

            case 4:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17, undefined);
    })));

    // https://github.com/nock/nock/issues/399
    // https://github.com/nock/nock/issues/822
    it('should match when headers are coming in as an array', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18() {
      var scope, _ref28, statusCode;

      return _regenerator2.default.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              scope = nock('http://example.test', {
                reqheaders: { 'x-my-headers': 'My custom Header value' }
              }).get('/').reply();
              _context18.next = 3;
              return got('http://example.test/', {
                headers: { 'X-My-Headers': ['My custom Header value'] }
              });

            case 3:
              _ref28 = _context18.sent;
              statusCode = _ref28.statusCode;


              expect(statusCode).to.equal(200);
              scope.done();

            case 7:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18, undefined);
    })));

    it('should throw if reqheaders are not an object', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19() {
      var options;
      return _regenerator2.default.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              options = {
                reqheaders: 'Content-Type: text/plain'
              };


              expect(function () {
                return nock('http://example.test', options).get('/');
              }).to.throw('Headers must be provided as an object');

            case 2:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19, undefined);
    })));

    it('should matche when request header satisfies the header function', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20() {
      var scope, _ref31, statusCode;

      return _regenerator2.default.wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              scope = nock('http://example.test', {
                reqheaders: {
                  'X-My-Super-Power': function XMySuperPower(value) {
                    return value === 'mullet growing';
                  }
                }
              }).post('/').reply();
              _context20.next = 3;
              return got.post('http://example.test/', {
                headers: { 'X-My-Super-Power': 'mullet growing' }
              });

            case 3:
              _ref31 = _context20.sent;
              statusCode = _ref31.statusCode;


              expect(statusCode).to.equal(200);
              scope.done();

            case 7:
            case "end":
              return _context20.stop();
          }
        }
      }, _callee20, undefined);
    })));

    it('should not match when request header does not satisfy the header function', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21() {
      var scope;
      return _regenerator2.default.wrap(function _callee21$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              scope = nock('http://example.test', {
                reqheaders: {
                  'X-My-Super-Power': function XMySuperPower(value) {
                    return value === 'Mullet Growing';
                  }
                }
              }).post('/').reply();
              _context21.next = 3;
              return assertRejects(got.post('http://example.test/', {
                headers: { 'X-My-Super-Power': 'mullet growing' }
              }), /Nock: No match/);

            case 3:

              expect(scope.isDone()).to.be.false();

            case 4:
            case "end":
              return _context21.stop();
          }
        }
      }, _callee21, undefined);
    })));

    it('should not fail when specified request header is not missing', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee22() {
      var scope, _ref34, statusCode;

      return _regenerator2.default.wrap(function _callee22$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              scope = nock('http://example.test', {
                reqheaders: {
                  'X-App-Token': 'apptoken',
                  'X-Auth-Token': 'apptoken'
                }
              }).post('/').reply();
              _context22.next = 3;
              return got.post('http://example.test/', {
                headers: {
                  'X-App-Token': 'apptoken',
                  'X-Auth-Token': 'apptoken'
                }
              });

            case 3:
              _ref34 = _context22.sent;
              statusCode = _ref34.statusCode;


              expect(statusCode).to.equal(200);
              scope.done();

            case 7:
            case "end":
              return _context22.stop();
          }
        }
      }, _callee22, undefined);
    })));

    it('should be case insensitive', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee23() {
      var scope, _ref36, statusCode;

      return _regenerator2.default.wrap(function _callee23$(_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              scope = nock('http://example.test', {
                reqheaders: {
                  'x-app-token': 'apptoken',
                  'x-auth-token': 'apptoken'
                }
              }).post('/').reply();
              _context23.next = 3;
              return got.post('http://example.test/', {
                headers: {
                  'X-App-TOKEN': 'apptoken',
                  'X-Auth-TOKEN': 'apptoken'
                }
              });

            case 3:
              _ref36 = _context23.sent;
              statusCode = _ref36.statusCode;


              expect(statusCode).to.equal(200);
              scope.done();

            case 7:
            case "end":
              return _context23.stop();
          }
        }
      }, _callee23, undefined);
    })));

    // https://github.com/nock/nock/issues/966
    it('mocking succeeds when mocked and specified request headers have falsy values', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee24() {
      var scope, _ref38, statusCode;

      return _regenerator2.default.wrap(function _callee24$(_context24) {
        while (1) {
          switch (_context24.prev = _context24.next) {
            case 0:
              scope = nock('http://example.test', {
                reqheaders: {
                  'x-foo': 0
                }
              }).post('/').reply();
              _context24.next = 3;
              return got.post('http://example.test/', {
                headers: {
                  'X-Foo': 0
                }
              });

            case 3:
              _ref38 = _context24.sent;
              statusCode = _ref38.statusCode;


              expect(statusCode).to.equal(200);
              scope.done();

            case 7:
            case "end":
              return _context24.stop();
          }
        }
      }, _callee24, undefined);
    })));

    it('multiple interceptors override headers from unrelated request', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee25() {
      var res1, res2;
      return _regenerator2.default.wrap(function _callee25$(_context25) {
        while (1) {
          switch (_context25.prev = _context25.next) {
            case 0:
              nock.define([{
                scope: 'https://example.test:443',
                method: 'get',
                path: '/bar',
                reqheaders: {
                  'x-foo': 'bar'
                },
                status: 200,
                response: {}
              }, {
                scope: 'https://example.test:443',
                method: 'get',
                path: '/baz',
                reqheaders: {
                  'x-foo': 'baz'
                },
                status: 200,
                response: {}
              }]);

              _context25.next = 3;
              return got('https://example.test/bar', {
                headers: { 'x-foo': 'bar' }
              });

            case 3:
              res1 = _context25.sent;

              expect(res1.statusCode).to.equal(200);

              _context25.next = 7;
              return got('https://example.test/baz', {
                headers: { 'x-foo': 'baz' }
              });

            case 7:
              res2 = _context25.sent;

              expect(res2.statusCode).to.equal(200);

            case 9:
            case "end":
              return _context25.stop();
          }
        }
      }, _callee25, undefined);
    })));
  });

  describe('`Scope#badheaders`', function () {
    it('should prevent match when badheaders are present', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee26() {
      var scope;
      return _regenerator2.default.wrap(function _callee26$(_context26) {
        while (1) {
          switch (_context26.prev = _context26.next) {
            case 0:
              scope = nock('http://example.test', {
                badheaders: ['cookie']
              }).get('/').reply();
              _context26.next = 3;
              return assertRejects(got('http://example.test/', {
                headers: { Cookie: 'cookie', Donut: 'donut' }
              }), /Nock: No match for request/);

            case 3:

              expect(scope.isDone()).to.be.false();

            case 4:
            case "end":
              return _context26.stop();
          }
        }
      }, _callee26, undefined);
    })));

    it('should not prevent match when badheaders are absent but other headers are present', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee27() {
      var scope;
      return _regenerator2.default.wrap(function _callee27$(_context27) {
        while (1) {
          switch (_context27.prev = _context27.next) {
            case 0:
              scope = nock('http://example.test', {
                badheaders: ['cookie']
              }).get('/').reply();
              _context27.next = 3;
              return got('http://example.test/', { headers: { Donut: 'donut' } });

            case 3:

              scope.done();

            case 4:
            case "end":
              return _context27.stop();
          }
        }
      }, _callee27, undefined);
    })));
  });

  describe('Host header handling', function () {
    // The next three tests cover the special case for the Host header where it's only used for
    // matching if it's defined on the scope and the request. See https://github.com/nock/nock/pull/196
    it('Host header is used for matching if defined on the scope and request', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee28() {
      var scope, _ref43, statusCode;

      return _regenerator2.default.wrap(function _callee28$(_context28) {
        while (1) {
          switch (_context28.prev = _context28.next) {
            case 0:
              scope = nock('http://example.test', {
                reqheaders: { host: 'example.test' }
              }).get('/').reply();
              _context28.next = 3;
              return got('http://example.test/', {
                headers: { Host: 'example.test' }
              });

            case 3:
              _ref43 = _context28.sent;
              statusCode = _ref43.statusCode;


              expect(statusCode).to.equal(200);
              scope.done();

            case 7:
            case "end":
              return _context28.stop();
          }
        }
      }, _callee28, undefined);
    })));

    it('Host header is ignored during matching if not defined on the request', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee29() {
      var scope, _ref45, statusCode;

      return _regenerator2.default.wrap(function _callee29$(_context29) {
        while (1) {
          switch (_context29.prev = _context29.next) {
            case 0:
              scope = nock('http://example.test', {
                reqheaders: { host: 'some.other.domain.test' }
              }).get('/').reply();
              _context29.next = 3;
              return got('http://example.test/');

            case 3:
              _ref45 = _context29.sent;
              statusCode = _ref45.statusCode;


              expect(statusCode).to.equal(200);
              scope.done();

            case 7:
            case "end":
              return _context29.stop();
          }
        }
      }, _callee29, undefined);
    })));

    it('Host header is used to reject a match if defined on the scope and request', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee30() {
      return _regenerator2.default.wrap(function _callee30$(_context30) {
        while (1) {
          switch (_context30.prev = _context30.next) {
            case 0:
              nock('http://example.test', {
                reqheaders: { host: 'example.test' }
              }).get('/').reply();

              _context30.next = 3;
              return assertRejects(got('http://example.test/', {
                headers: { Host: 'some.other.domain.test' }
              }), /Nock: No match for request/);

            case 3:
            case "end":
              return _context30.stop();
          }
        }
      }, _callee30, undefined);
    })));
  });
});

it('header manipulation', function (done) {
  // This test seems to depend on behavior of the `http` module.
  var scope = nock('http://example.test').get('/accounts').reply(200, { accounts: [{ id: 1, name: 'Joe Blow' }] });

  var req = http.request({ host: 'example.test', path: '/accounts' }, function (res) {
    res.on('end', function () {
      scope.done();
      done();
    });
    // Streams start in 'paused' mode and must be started.
    // See https://nodejs.org/api/stream.html#stream_class_stream_readable
    res.resume();
  });

  req.setHeader('X-Custom-Header', 'My Value');
  expect(req.getHeader('X-Custom-Header')).to.equal('My Value');

  req.removeHeader('X-Custom-Header');
  expect(req.getHeader('X-Custom-Header')).to.be.undefined();

  req.end();
});