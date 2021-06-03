"use strict";

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

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var expect = _chai2.default.expect;

var nock = _2.default;
var got = _got_client2.default;

describe('`defaultReplyHeaders()`', function () {
  it('when no headers are specified on the request, default reply headers work', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var _ref2, headers, rawHeaders;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            nock('http://example.test').defaultReplyHeaders({
              'X-Powered-By': 'Meeee',
              'X-Another-Header': ['foo', 'bar']
            }).get('/').reply(200, '');

            _context.next = 3;
            return got('http://example.test/');

          case 3:
            _ref2 = _context.sent;
            headers = _ref2.headers;
            rawHeaders = _ref2.rawHeaders;


            expect(headers).to.deep.equal({
              'x-powered-by': 'Meeee',
              'x-another-header': 'foo, bar'
            });

            expect(rawHeaders).to.deep.equal(['X-Powered-By', 'Meeee', 'X-Another-Header', ['foo', 'bar']]);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('default reply headers can be provided as a raw array', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var defaultHeaders, _ref4, headers, rawHeaders;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            defaultHeaders = ['X-Powered-By', 'Meeee', 'X-Another-Header', ['foo', 'bar']];

            nock('http://example.test').defaultReplyHeaders(defaultHeaders).get('/').reply(200, '');

            _context2.next = 4;
            return got('http://example.test/');

          case 4:
            _ref4 = _context2.sent;
            headers = _ref4.headers;
            rawHeaders = _ref4.rawHeaders;


            expect(headers).to.deep.equal({
              'x-powered-by': 'Meeee',
              'x-another-header': 'foo, bar'
            });

            expect(rawHeaders).to.deep.equal(defaultHeaders);

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it('default reply headers can be provided as a Map', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var defaultHeaders, _ref6, headers, rawHeaders;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            defaultHeaders = new _map2.default([['X-Powered-By', 'Meeee'], ['X-Another-Header', ['foo', 'bar']]]);

            nock('http://example.test').defaultReplyHeaders(defaultHeaders).get('/').reply(200, '');

            _context3.next = 4;
            return got('http://example.test/');

          case 4:
            _ref6 = _context3.sent;
            headers = _ref6.headers;
            rawHeaders = _ref6.rawHeaders;


            expect(headers).to.deep.equal({
              'x-powered-by': 'Meeee',
              'x-another-header': 'foo, bar'
            });

            expect(rawHeaders).to.deep.equal(['X-Powered-By', 'Meeee', 'X-Another-Header', ['foo', 'bar']]);

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  it('when headers are specified on the request, they override default reply headers', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var _ref8, headers;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            nock('http://example.test').defaultReplyHeaders({
              'X-Powered-By': 'Meeee',
              'X-Another-Header': 'Hey man!'
            }).get('/').reply(200, '', { A: 'b' });

            _context4.next = 3;
            return got('http://example.test/');

          case 3:
            _ref8 = _context4.sent;
            headers = _ref8.headers;


            expect(headers).to.deep.equal({
              'x-powered-by': 'Meeee',
              'x-another-header': 'Hey man!',
              a: 'b'
            });

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));

  it('default reply headers as functions work', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
    var date, message, _ref10, headers;

    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            date = new Date().toUTCString();
            message = 'A message.';


            nock('http://example.test').defaultReplyHeaders({
              'Content-Length': function ContentLength(req, res, body) {
                return body.length;
              },
              Date: function Date() {
                return date;
              },
              Foo: function Foo() {
                return 'foo';
              }
            }).get('/').reply(200, message, { foo: 'bar' });

            _context5.next = 5;
            return got('http://example.test');

          case 5:
            _ref10 = _context5.sent;
            headers = _ref10.headers;


            expect(headers).to.deep.equal({
              'content-length': message.length.toString(),
              date: date,
              foo: 'bar'
            });

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  })));

  it('reply should not cause an error on header conflict', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
    var scope, _ref12, statusCode, headers, body;

    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            scope = nock('http://example.test').defaultReplyHeaders({
              'content-type': 'application/json'
            });


            scope.get('/').reply(200, '<html></html>', {
              'Content-Type': 'application/xml'
            });

            _context6.next = 4;
            return got('http://example.test/');

          case 4:
            _ref12 = _context6.sent;
            statusCode = _ref12.statusCode;
            headers = _ref12.headers;
            body = _ref12.body;


            expect(statusCode).to.equal(200);
            expect(headers['content-type']).to.equal('application/xml');
            expect(body).to.equal('<html></html>');

          case 11:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  })));

  it('direct reply headers override defaults when casing differs', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
    var scope, _ref14, headers, rawHeaders;

    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            scope = nock('http://example.test').defaultReplyHeaders({
              'X-Default-Only': 'default',
              'X-Overridden': 'default'
            }).get('/').reply(200, 'Success!', {
              'X-Reply-Only': 'from-reply',
              'x-overridden': 'from-reply'
            });
            _context7.next = 3;
            return got('http://example.test/');

          case 3:
            _ref14 = _context7.sent;
            headers = _ref14.headers;
            rawHeaders = _ref14.rawHeaders;


            expect(headers).to.deep.equal({
              'x-default-only': 'default',
              'x-reply-only': 'from-reply',
              'x-overridden': 'from-reply' // note this overrode the default value, despite the case difference
            });
            expect(rawHeaders).to.deep.equal(['X-Reply-Only', 'from-reply', 'x-overridden', 'from-reply', 'X-Default-Only', 'default']
            // note 'X-Overridden' from the defaults is not included
            );
            scope.done();

          case 9:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  })));

  it('dynamic reply headers override defaults when casing differs', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
    var scope, _ref16, headers, rawHeaders;

    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            scope = nock('http://example.test').defaultReplyHeaders({
              'X-Default-Only': 'default',
              'X-Overridden': 'default'
            }).get('/').reply(function () {
              return [200, 'Success!', {
                'X-Reply-Only': 'from-reply',
                'x-overridden': 'from-reply'
              }];
            });
            _context8.next = 3;
            return got('http://example.test/');

          case 3:
            _ref16 = _context8.sent;
            headers = _ref16.headers;
            rawHeaders = _ref16.rawHeaders;


            expect(headers).to.deep.equal({
              'x-default-only': 'default',
              'x-reply-only': 'from-reply',
              'x-overridden': 'from-reply'
            });
            expect(rawHeaders).to.deep.equal(['X-Reply-Only', 'from-reply', 'x-overridden', 'from-reply', 'X-Default-Only', 'default']);
            scope.done();

          case 9:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  })));
});