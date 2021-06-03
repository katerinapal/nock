"use strict";

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

it('url encoding', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
  var scope, _ref2, statusCode;

  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          scope = nock('http://example.test').get('/key?a=[1]').reply(200);
          _context.next = 3;
          return got('http://example.test/key?a=[1]');

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