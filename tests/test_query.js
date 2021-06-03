"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assertRejects = require("assert-rejects");

var _assertRejects2 = _interopRequireDefault(_assertRejects);

var _got_client = require("./got_client");

var _got_client2 = _interopRequireDefault(_got_client);

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var expect = _chai2.default.expect;

var sinon = _sinon2.default;
var url = _url2.default;
var nock = _2.default;
var got = _got_client2.default;
var assertRejects = _assertRejects2.default;

describe('query params in path', function () {
  it('matches that query string', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var scope, _ref2, statusCode;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            scope = nock('http://example.test').get('/foo?bar=baz').reply();
            _context.next = 3;
            return got('http://example.test/foo?bar=baz');

          case 3:
            _ref2 = _context.sent;
            statusCode = _ref2.statusCode;


            expect(statusCode).to.equal(200);
            scope.done();

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));
});

describe('`query()`', function () {
  describe('when called with an object', function () {
    it('matches a query string of the same name=value', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      var scope, _ref4, statusCode;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              scope = nock('http://example.test').get('/').query({ foo: 'bar' }).reply();
              _context2.next = 3;
              return got('http://example.test/?foo=bar');

            case 3:
              _ref4 = _context2.sent;
              statusCode = _ref4.statusCode;


              expect(statusCode).to.equal(200);
              scope.done();

            case 7:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    })));

    it('matches multiple query strings of the same name=value', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
      var scope, _ref6, statusCode;

      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              scope = nock('http://example.test').get('/').query({ foo: 'bar', baz: 'foz' }).reply();
              _context3.next = 3;
              return got('http://example.test/?foo=bar&baz=foz');

            case 3:
              _ref6 = _context3.sent;
              statusCode = _ref6.statusCode;


              expect(statusCode).to.equal(200);
              scope.done();

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    })));

    it('matches multiple query strings of the same name=value regardless of order', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
      var scope, _ref8, statusCode;

      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              scope = nock('http://example.test').get('/').query({ foo: 'bar', baz: 'foz' }).reply();
              _context4.next = 3;
              return got('http://example.test/?baz=foz&foo=bar');

            case 3:
              _ref8 = _context4.sent;
              statusCode = _ref8.statusCode;


              expect(statusCode).to.equal(200);
              scope.done();

            case 7:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    })));

    it('matches query values regardless of their type of declaration', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
      var scope, _ref10, statusCode;

      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              scope = nock('http://example.test').get('/').query({ num: 1, bool: true, empty: null, str: 'fou' }).reply();
              _context5.next = 3;
              return got('http://example.test/?num=1&bool=true&empty=&str=fou');

            case 3:
              _ref10 = _context5.sent;
              statusCode = _ref10.statusCode;


              expect(statusCode).to.equal(200);
              scope.done();

            case 7:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, undefined);
    })));

    it("doesn't match query values of requests without query string", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
      var scope1, scope2, _ref12, statusCode, body;

      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              scope1 = nock('http://example.test').get('/').query({ num: 1, bool: true, empty: null, str: 'fou' }).reply(200, 'scope1');
              scope2 = nock('http://example.test').get('/').reply(200, 'scope2');
              _context6.next = 4;
              return got('http://example.test/');

            case 4:
              _ref12 = _context6.sent;
              statusCode = _ref12.statusCode;
              body = _ref12.body;


              expect(statusCode).to.equal(200);
              expect(body).to.equal('scope2');
              scope2.done();
              expect(scope1.isDone()).to.be.false();

            case 11:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, undefined);
    })));

    it('matches a query string using regexp', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
      var scope, _ref14, statusCode;

      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              scope = nock('http://example.test').get('/').query({ foo: /.*/ }).reply();
              _context7.next = 3;
              return got('http://example.test/?foo=bar');

            case 3:
              _ref14 = _context7.sent;
              statusCode = _ref14.statusCode;


              expect(statusCode).to.equal(200);
              scope.done();

            case 7:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, undefined);
    })));

    it('throws if query params have already been defined', function () {
      var interceptor = nock('http://example.test').get('/?foo=bar');

      expect(function () {
        interceptor.query({ foo: 'baz' });
      }).to.throw(Error, 'Query parameters have already been defined');
    });

    it('throws if it was already called', function () {
      var interceptor = nock('http://example.test').get('/').query({ foo: 'bar' });

      expect(function () {
        interceptor.query({ baz: 'qux' });
      }).to.throw(Error, 'Query parameters have already been defined');
    });

    it('matches a query string that contains special RFC3986 characters', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
      var scope, _ref16, statusCode;

      return _regenerator2.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              scope = nock('http://example.test').get('/').query({ 'foo&bar': 'hello&world' }).reply();
              _context8.next = 3;
              return got('http://example.test/', {
                searchParams: { 'foo&bar': 'hello&world' }
              });

            case 3:
              _ref16 = _context8.sent;
              statusCode = _ref16.statusCode;


              expect(statusCode).to.equal(200);
              scope.done();

            case 7:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, undefined);
    })));

    it('expects unencoded query params', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
      var scope, _ref18, statusCode;

      return _regenerator2.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              scope = nock('http://example.test').get('/').query({ foo: 'hello%20world' }).reply();
              _context9.next = 3;
              return assertRejects(got('http://example.test/?foo=hello%20world'), /Nock: No match for request/);

            case 3:
              _context9.next = 5;
              return got('http://example.test/?foo=hello%2520world');

            case 5:
              _ref18 = _context9.sent;
              statusCode = _ref18.statusCode;

              expect(statusCode).to.equal(200);
              scope.done();

            case 9:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9, undefined);
    })));

    it('matches a query string with pre-encoded values', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
      var scope, _ref20, statusCode;

      return _regenerator2.default.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              scope = nock('http://example.test', { encodedQueryParams: true }).get('/').query({ foo: 'hello%20world' }).reply();
              _context10.next = 3;
              return got('http://example.test/?foo=hello%20world');

            case 3:
              _ref20 = _context10.sent;
              statusCode = _ref20.statusCode;

              expect(statusCode).to.equal(200);
              scope.done();

            case 7:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10, undefined);
    })));

    it('when called with "{}" will allow a match against ending in ?', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
      var scope, _ref22, statusCode;

      return _regenerator2.default.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              scope = nock('http://example.test').get('/noquerystring').query({}).reply();
              _context11.next = 3;
              return got('http://example.test/noquerystring?');

            case 3:
              _ref22 = _context11.sent;
              statusCode = _ref22.statusCode;

              expect(statusCode).to.equal(200);
              scope.done();

            case 7:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, undefined);
    })));

    it('will not match when a query string does not match name=value', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
      return _regenerator2.default.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              nock('http://example.test').get('/').query({ foo: 'bar' }).reply();

              _context12.next = 3;
              return assertRejects(got('http://example.test/?foo=baz'), /Nock: No match for request/);

            case 3:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12, undefined);
    })));

    it('will not match when a query string is present that was not registered', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
      return _regenerator2.default.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              nock('http://example.test').get('/').query({ foo: 'bar' }).reply();

              _context13.next = 3;
              return assertRejects(got('http://example.test/?foo=bar&baz=foz'), /Nock: No match for request/);

            case 3:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13, undefined);
    })));

    it('will not match when a query string is malformed', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14() {
      return _regenerator2.default.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              // This is a valid query string so it's not really malformed, just not
              // matching. Should this test be removed?
              nock('http://example.test').get('/').query({ foo: 'bar' }).reply();

              _context14.next = 3;
              return assertRejects(got('http://example.test/?foobar'), /Nock: No match for request/);

            case 3:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14, undefined);
    })));

    it('will not match when a query string has fewer correct values than expected', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15() {
      return _regenerator2.default.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              nock('http://example.test').get('/').query({
                num: 1,
                bool: true,
                empty: null,
                str: 'fou'
              }).reply();

              _context15.next = 3;
              return assertRejects(got('http://example.test/?num=1str=fou'), /Nock: No match for request/);

            case 3:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15, undefined);
    })));

    it('query matching should not consider request arrays equal to comma-separated expectations', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16() {
      return _regenerator2.default.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              nock('http://example.test').get('/').query({ foo: 'bar,baz' }).reply();

              _context16.next = 3;
              return assertRejects(got('http://example.test?foo[]=bar&foo[]=baz'), /Nock: No match for request/);

            case 3:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16, undefined);
    })));

    it('query matching should not consider comma-separated requests equal to array expectations', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17() {
      return _regenerator2.default.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              nock('http://example.test').get('/').query({ foo: ['bar', 'baz'] }).reply();

              _context17.next = 3;
              return assertRejects(got('http://example.test?foo=bar%2Cbaz'), /Nock: No match for request/);

            case 3:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17, undefined);
    })));
  });

  describe('when called with URLSearchParams', function () {
    it('matches', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18() {
      var params, scope, _ref30, statusCode;

      return _regenerator2.default.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              params = new url.URLSearchParams({ foo: 'bar' });
              scope = nock('http://example.test').get('/').query(params).reply();
              _context18.next = 4;
              return got('http://example.test?foo=bar');

            case 4:
              _ref30 = _context18.sent;
              statusCode = _ref30.statusCode;


              expect(statusCode).to.equal(200);
              scope.done();

            case 8:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18, undefined);
    })));
  });

  describe('when called with invalid arguments', function () {
    it('throws the expected error', function () {
      var interceptor = nock('http://example.test').get('/');

      expect(function () {
        interceptor.query('foo=bar');
      }).to.throw(Error, 'Argument Error: foo=bar');
    });
  });

  describe('when called with `true`', function () {
    it('will allow all query strings to pass', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19() {
      var scope, _ref32, statusCode;

      return _regenerator2.default.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              scope = nock('http://example.test').get('/').query(true).reply();
              _context19.next = 3;
              return got('http://example.test/?foo=hello%20world');

            case 3:
              _ref32 = _context19.sent;
              statusCode = _ref32.statusCode;

              expect(statusCode).to.equal(200);
              scope.done();

            case 7:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19, undefined);
    })));

    it('will match when the path has no query', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20() {
      var scope, _ref34, statusCode;

      return _regenerator2.default.wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              scope = nock('http://example.test').get('/').query(true).reply();
              _context20.next = 3;
              return got('http://example.test/');

            case 3:
              _ref34 = _context20.sent;
              statusCode = _ref34.statusCode;

              expect(statusCode).to.equal(200);
              scope.done();

            case 7:
            case "end":
              return _context20.stop();
          }
        }
      }, _callee20, undefined);
    })));
  });

  describe('when called with a function', function () {
    it('function called with actual queryObject', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21() {
      var queryFn, scope, _ref36, statusCode;

      return _regenerator2.default.wrap(function _callee21$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              queryFn = sinon.stub().returns(true);
              scope = nock('http://example.test').get('/').query(queryFn).reply();
              _context21.next = 4;
              return got('http://example.test/?foo=bar&a=1&b=2');

            case 4:
              _ref36 = _context21.sent;
              statusCode = _ref36.statusCode;

              expect(statusCode).to.equal(200);

              expect(queryFn).to.have.been.calledOnceWithExactly({
                foo: 'bar',
                a: '1',
                b: '2'
              });

              scope.done();

            case 9:
            case "end":
              return _context21.stop();
          }
        }
      }, _callee21, undefined);
    })));

    it('function return true the query treat as matched', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee22() {
      var scope, _ref38, statusCode;

      return _regenerator2.default.wrap(function _callee22$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              scope = nock('http://example.test').get('/').query(function () {
                return true;
              }).reply();
              _context22.next = 3;
              return got('http://example.test/?ignore=the&actual=query');

            case 3:
              _ref38 = _context22.sent;
              statusCode = _ref38.statusCode;

              expect(statusCode).to.equal(200);
              scope.done();

            case 7:
            case "end":
              return _context22.stop();
          }
        }
      }, _callee22, undefined);
    })));

    it('function return false the query treat as un-matched', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee23() {
      return _regenerator2.default.wrap(function _callee23$(_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              nock('http://example.test').get('/').query(function () {
                return false;
              }).reply();

              _context23.next = 3;
              return assertRejects(got('http://example.test/?i=should&pass=?'), /Nock: No match for request/);

            case 3:
            case "end":
              return _context23.stop();
          }
        }
      }, _callee23, undefined);
    })));
  });
});