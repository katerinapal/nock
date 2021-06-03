"use strict";

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

// Tests for invoking `.reply()` with a synchronous function which return the
// response body or an array containing the status code and optional response
// body and headers.

var assertRejects = _assertRejects2.default;
var expect = _chai2.default.expect;

var sinon = _sinon2.default;
var nock = _2.default;
var got = _got_client2.default;

describe('synchronous `reply()` function', function () {
  describe('when invoked with status code followed by function', function () {
    it('passes through a string', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var scope, _ref2, statusCode, body;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              scope = nock('http://example.test').get('/').reply(201, function () {
                return 'OK!';
              });
              _context.next = 3;
              return got('http://example.test');

            case 3:
              _ref2 = _context.sent;
              statusCode = _ref2.statusCode;
              body = _ref2.body;

              expect(statusCode).to.equal(201);
              expect(body).to.be.a('string').and.to.equal('OK!');
              scope.done();

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined);
    })));

    it('stringifies an object', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      var exampleResponse, scope, _ref4, statusCode, body;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              exampleResponse = { message: 'OK!' };
              scope = nock('http://example.test').get('/').reply(201, function () {
                return exampleResponse;
              });
              _context2.next = 4;
              return got('http://example.test');

            case 4:
              _ref4 = _context2.sent;
              statusCode = _ref4.statusCode;
              body = _ref4.body;

              expect(statusCode).to.equal(201);
              expect(body).to.be.a('string').and.to.equal((0, _stringify2.default)(exampleResponse));
              scope.done();

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    })));

    it('stringifies a number', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
      var scope, _ref6, statusCode, body;

      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              scope = nock('http://example.test').get('/').reply(201, function () {
                return 123;
              });
              _context3.next = 3;
              return got('http://example.test');

            case 3:
              _ref6 = _context3.sent;
              statusCode = _ref6.statusCode;
              body = _ref6.body;

              expect(statusCode).to.equal(201);
              expect(body).to.be.a('string').and.to.equal('123');
              scope.done();

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    })));

    it('stringifies an array', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
      var scope, _ref8, statusCode, body;

      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              scope = nock('http://example.test').get('/').reply(201, function () {
                return [123];
              });
              _context4.next = 3;
              return got('http://example.test');

            case 3:
              _ref8 = _context4.sent;
              statusCode = _ref8.statusCode;
              body = _ref8.body;

              expect(statusCode).to.equal(201);
              expect(body).to.be.a('string').and.to.equal('[123]');
              scope.done();

            case 9:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    })));

    it('stringifies a boolean', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
      var scope, _ref10, statusCode, body;

      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              scope = nock('http://example.test').get('/').reply(201, function () {
                return false;
              });
              _context5.next = 3;
              return got('http://example.test');

            case 3:
              _ref10 = _context5.sent;
              statusCode = _ref10.statusCode;
              body = _ref10.body;

              expect(statusCode).to.equal(201);
              expect(body).to.be.a('string').and.to.equal('false');
              scope.done();

            case 9:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, undefined);
    })));

    it('stringifies null', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
      var scope, _ref12, statusCode, body;

      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              scope = nock('http://example.test').get('/').reply(201, function () {
                return null;
              });
              _context6.next = 3;
              return got('http://example.test');

            case 3:
              _ref12 = _context6.sent;
              statusCode = _ref12.statusCode;
              body = _ref12.body;

              expect(statusCode).to.equal(201);
              expect(body).to.be.a('string').and.to.equal('null');
              scope.done();

            case 9:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, undefined);
    })));

    it("isn't invoked until request matches", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
      var onReply, scope;
      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              onReply = sinon.spy();
              scope = nock('http://example.test').get('/').reply(200, function (uri, body) {
                onReply();
                return '';
              });


              expect(onReply).not.to.have.been.called();
              _context7.next = 5;
              return got('http://example.test/');

            case 5:
              expect(onReply).to.have.been.calledOnce();

              scope.done();

            case 7:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, undefined);
    })));

    context('when the request has a string body', function () {
      it('passes through a string', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
        var exampleRequestBody, exampleResponseBody, scope;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                exampleRequestBody = 'key=val';
                exampleResponseBody = 'foo';
                scope = nock('http://example.test').post('/endpoint', exampleRequestBody).reply(404, function () {
                  return exampleResponseBody;
                });
                _context8.next = 5;
                return assertRejects(got.post('http://example.test/endpoint', {
                  body: exampleRequestBody
                }), function (_ref15) {
                  var _ref15$response = _ref15.response,
                      statusCode = _ref15$response.statusCode,
                      body = _ref15$response.body;

                  expect(statusCode).to.equal(404);
                  expect(body).to.equal(exampleResponseBody);
                  return true;
                });

              case 5:
                scope.done();

              case 6:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, undefined);
      })));
    });

    describe('the reply function arguments', function () {
      context('when the request has a non-JSON string', function () {
        it('receives the URL and body', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
          var exampleRequestBody, replyFnCalled, scope;
          return _regenerator2.default.wrap(function _callee9$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  exampleRequestBody = 'key=val';
                  replyFnCalled = sinon.spy();
                  scope = nock('http://example.test').post('/endpoint', exampleRequestBody).reply(404, function (uri, requestBody) {
                    replyFnCalled();
                    expect(uri).to.equal('/endpoint');
                    expect(requestBody).to.equal(exampleRequestBody);
                  });
                  _context9.next = 5;
                  return assertRejects(got.post('http://example.test/endpoint', {
                    body: exampleRequestBody
                  }), function (_ref17) {
                    var _ref17$response = _ref17.response,
                        statusCode = _ref17$response.statusCode,
                        body = _ref17$response.body;

                    expect(statusCode).to.equal(404);
                    expect(body).to.equal('');
                    return true;
                  });

                case 5:

                  expect(replyFnCalled).to.have.been.called();
                  scope.done();

                case 7:
                case "end":
                  return _context9.stop();
              }
            }
          }, _callee9, undefined);
        })));
      });

      context('when the request has a JSON string', function () {
        it('when content-type is json, receives the parsed body', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
          var exampleRequestBody, replyFnCalled, scope, _ref19, statusCode;

          return _regenerator2.default.wrap(function _callee10$(_context10) {
            while (1) {
              switch (_context10.prev = _context10.next) {
                case 0:
                  exampleRequestBody = (0, _stringify2.default)({ id: 1, name: 'bob' });
                  replyFnCalled = sinon.spy();
                  scope = nock('http://example.test').post('/').reply(201, function (uri, requestBody) {
                    replyFnCalled();
                    expect(requestBody).to.be.an('object').and.to.deep.equal(JSON.parse(exampleRequestBody));
                  });
                  _context10.next = 5;
                  return got.post('http://example.test/', {
                    headers: { 'Content-Type': 'application/json' },
                    body: exampleRequestBody
                  });

                case 5:
                  _ref19 = _context10.sent;
                  statusCode = _ref19.statusCode;

                  expect(replyFnCalled).to.have.been.called();
                  expect(statusCode).to.equal(201);
                  scope.done();

                case 10:
                case "end":
                  return _context10.stop();
              }
            }
          }, _callee10, undefined);
        })));

        // Regression test for https://github.com/nock/nock/issues/1642
        it('when content-type is json (as array), receives the parsed body', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
          var exampleRequestBody, replyFnCalled, scope, _ref21, statusCode;

          return _regenerator2.default.wrap(function _callee11$(_context11) {
            while (1) {
              switch (_context11.prev = _context11.next) {
                case 0:
                  exampleRequestBody = (0, _stringify2.default)({ id: 1, name: 'bob' });
                  replyFnCalled = sinon.spy();
                  scope = nock('http://example.test').post('/').reply(201, function (uri, requestBody) {
                    replyFnCalled();
                    expect(requestBody).to.be.an('object').and.to.to.deep.equal(JSON.parse(exampleRequestBody));
                  });
                  _context11.next = 5;
                  return got.post('http://example.test/', {
                    // Providing the field value as an array is probably a bug on the callers behalf,
                    // but it is still allowed by Node
                    headers: { 'Content-Type': ['application/json', 'charset=utf8'] },
                    body: exampleRequestBody
                  });

                case 5:
                  _ref21 = _context11.sent;
                  statusCode = _ref21.statusCode;

                  expect(replyFnCalled).to.have.been.called();
                  expect(statusCode).to.equal(201);
                  scope.done();

                case 10:
                case "end":
                  return _context11.stop();
              }
            }
          }, _callee11, undefined);
        })));

        it('without content-type header, receives the body as string', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
          var exampleRequestBody, replyFnCalled, scope, _ref23, statusCode;

          return _regenerator2.default.wrap(function _callee12$(_context12) {
            while (1) {
              switch (_context12.prev = _context12.next) {
                case 0:
                  exampleRequestBody = (0, _stringify2.default)({ id: 1, name: 'bob' });
                  replyFnCalled = sinon.spy();
                  scope = nock('http://example.test').post('/').reply(201, function (uri, requestBody) {
                    replyFnCalled();
                    expect(requestBody).to.be.a('string').and.to.equal(exampleRequestBody);
                  });
                  _context12.next = 5;
                  return got.post('http://example.test/', {
                    body: exampleRequestBody
                  });

                case 5:
                  _ref23 = _context12.sent;
                  statusCode = _ref23.statusCode;

                  expect(replyFnCalled).to.have.been.called();
                  expect(statusCode).to.equal(201);
                  scope.done();

                case 10:
                case "end":
                  return _context12.stop();
              }
            }
          }, _callee12, undefined);
        })));
      });
    });
  });

  // This signature is supported today, however it seems unnecessary. This is
  // just as easily accomplished with a function returning an array:
  // `.reply(() => [201, 'ABC', { 'X-My-Headers': 'My custom header value' }])`
  it('invoked with status code, function returning array, and headers', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
    var scope, _ref25, headers;

    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            scope = nock('http://example.test').get('/').reply(201, function () {
              return 'ABC';
            }, { 'X-My-Headers': 'My custom header value' });
            _context13.next = 3;
            return got('http://example.test/');

          case 3:
            _ref25 = _context13.sent;
            headers = _ref25.headers;


            expect(headers).to.deep.equal({ 'x-my-headers': 'My custom header value' });

            scope.done();

          case 7:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, undefined);
  })));

  describe('when invoked with function returning array', function () {
    it('handles status code alone', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14() {
      var scope, _ref27, statusCode, body;

      return _regenerator2.default.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              scope = nock('http://example.test').get('/').reply(function () {
                return [202];
              });
              _context14.next = 3;
              return got('http://example.test/');

            case 3:
              _ref27 = _context14.sent;
              statusCode = _ref27.statusCode;
              body = _ref27.body;


              expect(statusCode).to.equal(202);
              expect(body).to.equal('');
              scope.done();

            case 9:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14, undefined);
    })));

    it('handles status code and string body', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15() {
      var exampleResponse, scope;
      return _regenerator2.default.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              exampleResponse = 'This is a body';
              scope = nock('http://example.test').get('/').reply(function () {
                return [401, exampleResponse];
              });
              _context15.next = 4;
              return assertRejects(got('http://example.test/'), function (_ref29) {
                var _ref29$response = _ref29.response,
                    statusCode = _ref29$response.statusCode,
                    body = _ref29$response.body;

                expect(statusCode).to.equal(401);
                expect(body).to.equal(exampleResponse);
                return true;
              });

            case 4:
              scope.done();

            case 5:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15, undefined);
    })));

    it('handles status code and body object', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16() {
      var exampleResponse, scope, _ref31, statusCode, body;

      return _regenerator2.default.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              exampleResponse = { message: 'OK!' };
              scope = nock('http://example.test').get('/').reply(function () {
                return [202, exampleResponse];
              });
              _context16.next = 4;
              return got('http://example.test/');

            case 4:
              _ref31 = _context16.sent;
              statusCode = _ref31.statusCode;
              body = _ref31.body;


              expect(statusCode).to.equal(202);
              expect(body).to.equal((0, _stringify2.default)(exampleResponse));
              scope.done();

            case 10:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16, undefined);
    })));

    it('handles status code and body as number', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17() {
      var scope, _ref33, statusCode, body;

      return _regenerator2.default.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              scope = nock('http://example.test').get('/').reply(function () {
                return [202, 123];
              });
              _context17.next = 3;
              return got('http://example.test/');

            case 3:
              _ref33 = _context17.sent;
              statusCode = _ref33.statusCode;
              body = _ref33.body;


              expect(statusCode).to.equal(202);
              expect(body).to.be.a('string').and.to.to.equal('123');
              scope.done();

            case 9:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17, undefined);
    })));

    it('handles status code, string body, and headers object', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18() {
      var exampleBody, scope, _ref35, statusCode, body, headers, rawHeaders;

      return _regenerator2.default.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              exampleBody = 'this is the body';
              scope = nock('http://example.test').get('/').reply(function () {
                return [202, exampleBody, { 'x-key': 'value', 'x-key-2': 'value 2' }];
              });
              _context18.next = 4;
              return got('http://example.test/');

            case 4:
              _ref35 = _context18.sent;
              statusCode = _ref35.statusCode;
              body = _ref35.body;
              headers = _ref35.headers;
              rawHeaders = _ref35.rawHeaders;


              expect(statusCode).to.equal(202);
              expect(body).to.equal(exampleBody);
              expect(headers).to.deep.equal({
                'x-key': 'value',
                'x-key-2': 'value 2'
              });
              expect(rawHeaders).to.deep.equal(['x-key', 'value', 'x-key-2', 'value 2']);
              scope.done();

            case 14:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18, undefined);
    })));

    it('when given a non-array, raises the expected error', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19() {
      return _regenerator2.default.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              nock('http://example.test').get('/abc').reply(function () {
                return 'ABC';
              });

              _context19.next = 3;
              return assertRejects(got('http://example.test/abc'), function (err) {
                expect(err).to.be.an.instanceOf(Error).and.include({
                  message: 'A single function provided to .reply MUST return an array'
                });
                return true;
              });

            case 3:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19, undefined);
    })));

    it('when given an empty array, raises the expected error', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20() {
      return _regenerator2.default.wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              nock('http://example.test').get('/abc').reply(function () {
                return [];
              });

              _context20.next = 3;
              return assertRejects(got('http://example.test/abc'), function (err) {
                expect(err).to.be.an.instanceOf(Error).and.include({
                  message: 'Invalid undefined value for status code'
                });
                return true;
              });

            case 3:
            case "end":
              return _context20.stop();
          }
        }
      }, _callee20, undefined);
    })));

    it('when given an array with too many entries, raises the expected error', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21() {
      return _regenerator2.default.wrap(function _callee21$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              nock('http://example.test').get('/abc').reply(function () {
                return ['user', 'probably', 'intended', 'this', 'to', 'be', 'JSON'];
              });

              _context21.next = 3;
              return assertRejects(got('http://example.test/abc'), function (err) {
                expect(err).to.be.an.instanceOf(Error).and.include({
                  message: 'The array returned from the .reply callback contains too many values'
                });
                return true;
              });

            case 3:
            case "end":
              return _context21.stop();
          }
        }
      }, _callee21, undefined);
    })));

    it('when given extraneous arguments, raises the expected error', function () {
      var interceptor = nock('http://example.test').get('/');

      expect(function () {
        return interceptor.reply(function () {
          return [200];
        }, { 'x-my-header': 'some-value' });
      }).to.throw(Error, 'Invalid arguments');
    });
  });
});