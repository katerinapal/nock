"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _got_client = require("./got_client");

var _got_client2 = _interopRequireDefault(_got_client);

var _ = require("..");

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var nock = _2.default;
var got = _got_client2.default;

describe('`query()` complex encoding', function () {
  it('query with array', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var expectedQuery, encodedQuery, scope;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // In Node 10.x this can be updated:
            // const exampleQuery = new URLSearchParams([
            //   ['list', 123],
            //   ['list', 456],
            //   ['list', 789],
            //   ['a', 'b'],
            // ])
            expectedQuery = { list: [123, 456, 789], a: 'b' };
            encodedQuery = 'list=123&list=456&list=789&a=b';
            scope = nock('http://example.test').get('/test').query(expectedQuery).reply();
            _context.next = 5;
            return got("http://example.test/test?" + encodedQuery);

          case 5:

            scope.done();

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  // These tests enforce the historical behavior of query strings as encoded by
  // the `qs` library. These are not standard, although they are compatible with
  // the `qs` option to `request`.
  it('query with array which contains unencoded value', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var expectedQuery, encodedQuery, scope;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            expectedQuery = {
              list: ['hello%20world', '2hello%20world', 3],
              a: 'b'
            };
            encodedQuery = 'list%5B0%5D=hello%2520world&list%5B1%5D=2hello%2520world&list%5B2%5D=3&a=b';
            scope = nock('http://example.test').get('/test').query(expectedQuery).reply();
            _context2.next = 5;
            return got("http://example.test/test?" + encodedQuery);

          case 5:

            scope.done();

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it('query with array which contains pre-encoded values ', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var expectedQuery, queryString, scope;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            expectedQuery = { list: ['hello%20world', '2hello%20world'] };
            queryString = 'list%5B0%5D=hello%20world&list%5B1%5D=2hello%20world';
            scope = nock('http://example.test', { encodedQueryParams: true }).get('/test').query(expectedQuery).reply();
            _context3.next = 5;
            return got("http://example.test/test?" + queryString);

          case 5:

            scope.done();

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  it('query with object', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var expectedQuery, encodedQuery, scope;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            expectedQuery = {
              a: {
                b: ['c', 'd']
              },
              e: [1, 2, 3, 4],
              q: '(nodejs)'
            };
            encodedQuery = 'a[b][0]=c&a[b][1]=d&e[0]=1&e[1]=2&e[2]=3&e[3]=4&q=(nodejs)';
            scope = nock('http://example.test').get('/test').query(expectedQuery).reply();
            _context4.next = 5;
            return got("http://example.test/test?" + encodedQuery);

          case 5:

            scope.done();

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));

  it('query with object which contains unencoded value', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
    var exampleQuery, encodedQuery, scope;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            exampleQuery = {
              a: {
                b: 'hello%20world'
              }
            };
            encodedQuery = 'a%5Bb%5D=hello%2520world';
            scope = nock('http://example.test').get('/test').query(exampleQuery).reply();
            _context5.next = 5;
            return got("http://example.test/test?" + encodedQuery);

          case 5:

            scope.done();

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  })));

  it('query with object which contains pre-encoded values', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
    var queryString, exampleQuery, scope;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            queryString = 'a%5Bb%5D=hello%20world';
            exampleQuery = {
              a: {
                b: 'hello%20world'
              }
            };
            scope = nock('http://example.test', { encodedQueryParams: true }).get('/test').query(exampleQuery).reply();
            _context6.next = 5;
            return got("http://example.test/test?" + queryString);

          case 5:

            scope.done();

          case 6:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  })));

  it('query with array and regexp', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
    var encodedQuery, expectedQuery, scope;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            // In Node 10.x this can be updated:
            // const exampleQuery = new URLSearchParams([
            //   ['list', 123],
            //   ['list', 456],
            //   ['list', 789],
            //   ['foo', 'bar'],
            //   ['a', 'b'],
            // ]).toString()
            encodedQuery = 'list=123&list=456&list=789&foo=bar&a=b';
            expectedQuery = {
              list: [123, 456, 789],
              foo: /.*/,
              a: 'b'
            };
            scope = nock('http://example.test').get('/test').query(expectedQuery).reply();
            _context7.next = 5;
            return got("http://example.test/test?" + encodedQuery);

          case 5:

            scope.done();

          case 6:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  })));
});