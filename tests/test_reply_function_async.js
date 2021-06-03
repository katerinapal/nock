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

var _assertRejects = require("assert-rejects");

var _assertRejects2 = _interopRequireDefault(_assertRejects);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

// Tests for invoking `.reply()` with a function which invokes the error-first
// callback with the response body or an array containing the status code and
// optional response body and headers.

var expect = _chai2.default.expect;

var assertRejects = _assertRejects2.default;
var sinon = _sinon2.default;
var nock = _2.default;
var got = _got_client2.default;

describe('asynchronous `reply()` function', function () {
  describe('using callback', function () {
    it('reply can take a callback', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var scope, _ref2, body;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              scope = nock('http://example.test').get('/').reply(200, function (path, requestBody, callback) {
                return callback(null, 'Hello World!');
              });
              _context.next = 3;
              return got('http://example.test/', {
                responseType: 'buffer'
              });

            case 3:
              _ref2 = _context.sent;
              body = _ref2.body;


              expect(body).to.be.an.instanceOf(Buffer);
              expect(body.toString('utf8')).to.equal('Hello World!');
              scope.done();

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined);
    })));

    it('reply takes a callback for status code', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      var responseBody, scope, _ref4, statusCode, headers, body;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              responseBody = 'Hello, world!';
              scope = nock('http://example.test').get('/').reply(function (path, requestBody, callback) {
                setTimeout(function () {
                  return callback(null, [202, responseBody, { 'X-Custom-Header': 'abcdef' }]);
                }, 1);
              });
              _context2.next = 4;
              return got('http://example.test/');

            case 4:
              _ref4 = _context2.sent;
              statusCode = _ref4.statusCode;
              headers = _ref4.headers;
              body = _ref4.body;


              expect(statusCode).to.equal(202);
              expect(headers).to.deep.equal({ 'x-custom-header': 'abcdef' });
              expect(body).to.equal(responseBody);
              scope.done();

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    })));

    it('should get request headers', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
      var scope, _ref6, statusCode, body;

      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              scope = nock('http://example.test').get('/yo').reply(201, function (path, reqBody, cb) {
                expect(this.req.path).to.equal('/yo');
                expect(this.req.headers).to.deep.equal({
                  'accept-encoding': 'gzip, deflate, br',
                  host: 'example.test',
                  'x-my-header': 'some-value',
                  'x-my-other-header': 'some-other-value',
                  'user-agent': 'got (https://github.com/sindresorhus/got)'
                });
                setTimeout(function () {
                  cb(null, 'foobar');
                }, 1e3);
              });
              _context3.next = 3;
              return got('http://example.test/yo', {
                headers: {
                  'x-my-header': 'some-value',
                  'x-my-other-header': 'some-other-value'
                }
              });

            case 3:
              _ref6 = _context3.sent;
              statusCode = _ref6.statusCode;
              body = _ref6.body;


              expect(statusCode).to.equal(201);
              expect(body).to.equal('foobar');

              scope.done();

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    })));

    it('reply should throw on error on the callback', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              nock('http://example.test').get('/').reply(500, function (path, requestBody, callback) {
                return callback(new Error('Database failed'));
              });

              _context4.next = 3;
              return assertRejects(got('http://example.test'), /Database failed/);

            case 3:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    })));

    it('an error passed to the callback propagates when [err, fullResponseArray] is expected', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              nock('http://example.test').get('/').reply(function (path, requestBody, callback) {
                callback(Error('boom'));
              });

              _context5.next = 3;
              return assertRejects(got('http://example.test'), /boom/);

            case 3:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, undefined);
    })));

    it('subsequent calls to the reply callback are ignored', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
      var replyFnCalled, scope, _ref10, statusCode, body;

      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              replyFnCalled = sinon.spy();
              scope = nock('http://example.test').get('/').reply(201, function (path, requestBody, callback) {
                replyFnCalled();
                callback(null, 'one');
                callback(null, 'two');
                callback(new Error('three'));
              });
              _context6.next = 4;
              return got('http://example.test/');

            case 4:
              _ref10 = _context6.sent;
              statusCode = _ref10.statusCode;
              body = _ref10.body;


              expect(replyFnCalled).to.have.been.calledOnce();
              expect(statusCode).to.equal(201);
              expect(body).to.equal('one');

              scope.done();

            case 11:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, undefined);
    })));
  });

  describe('using async/promises', function () {
    it('reply can take a status code with an 2-arg async function, and passes it the correct arguments', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
      var scope, _ref13, statusCode, body;

      return _regenerator2.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              scope = nock('http://example.com').post('/foo').reply(201, function () {
                var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(path, requestBody) {
                  return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                      switch (_context7.prev = _context7.next) {
                        case 0:
                          expect(path).to.equal('/foo');
                          expect(requestBody).to.equal('request-body');
                          return _context7.abrupt("return", 'response-body');

                        case 3:
                        case "end":
                          return _context7.stop();
                      }
                    }
                  }, _callee7, undefined);
                }));

                return function (_x, _x2) {
                  return _ref12.apply(this, arguments);
                };
              }());
              _context8.next = 3;
              return got.post('http://example.com/foo', {
                body: 'request-body'
              });

            case 3:
              _ref13 = _context8.sent;
              statusCode = _ref13.statusCode;
              body = _ref13.body;


              expect(statusCode).to.equal(201);
              expect(body).to.equal('response-body');
              scope.done();

            case 9:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, undefined);
    })));

    it('reply can take a status code with a 0-arg async function, and passes it the correct arguments', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
      var scope, _ref16, statusCode, body;

      return _regenerator2.default.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              scope = nock('http://example.com').get('/').reply((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        return _context9.abrupt("return", [201, 'Hello World!']);

                      case 1:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9, undefined);
              })));
              _context10.next = 3;
              return got('http://example.com/');

            case 3:
              _ref16 = _context10.sent;
              statusCode = _ref16.statusCode;
              body = _ref16.body;


              expect(statusCode).to.equal(201);
              expect(body).to.equal('Hello World!');
              scope.done();

            case 9:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, undefined);
    })));

    it('when reply is called with a status code and an async function that throws, it propagates the error', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
      return _regenerator2.default.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              nock('http://example.test').get('/').reply(201, (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
                return _regenerator2.default.wrap(function _callee11$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        throw Error('oh no!');

                      case 1:
                      case "end":
                        return _context11.stop();
                    }
                  }
                }, _callee11, undefined);
              })));

              _context12.next = 3;
              return assertRejects(got('http://example.test'), /oh no!/);

            case 3:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12, undefined);
    })));

    it('when reply is called with an async function that throws, it propagates the error', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14() {
      return _regenerator2.default.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              nock('http://example.test').get('/').reply((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
                return _regenerator2.default.wrap(function _callee13$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        throw Error('oh no!');

                      case 1:
                      case "end":
                        return _context13.stop();
                    }
                  }
                }, _callee13, undefined);
              })));

              _context14.next = 3;
              return assertRejects(got('http://example.test'), /oh no!/);

            case 3:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14, undefined);
    })));
  });
});