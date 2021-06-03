"use strict";

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var fakeTimers = _fakeTimers2.default;
var nock = _2.default;
var got = _got_client2.default;

// https://github.com/nock/nock/issues/1334
it('should still return successfully when fake timer is enabled', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
  var clock, scope;
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          clock = fakeTimers.install();
          scope = nock('http://example.test').get('/').reply();
          _context.next = 4;
          return got('http://example.test');

        case 4:

          clock.uninstall();
          scope.done();

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, undefined);
})));