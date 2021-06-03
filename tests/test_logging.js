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

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var debug = _debug2.default;
var sinon = _sinon2.default;
var expect = _chai2.default.expect;

var nock = _2.default;
var got = _got_client2.default;

describe('Logging using the `debug` package', function () {
  var logFn = void 0;
  beforeEach(function () {
    logFn = sinon.stub(debug, 'log');
    debug.enable('nock*');
  });

  afterEach(function () {
    debug.disable('nock*');
  });

  it('match debugging works', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var exampleBody;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            nock('http://example.test').post('/deep/link').reply(200, 'Hello World!');

            exampleBody = 'Hello yourself!';
            _context.next = 4;
            return got.post('http://example.test/deep/link', { body: exampleBody });

          case 4:

            // the log function will have been a few dozen times, there are a few specific to matching we want to validate:

            // the log when an interceptor is chosen
            expect(logFn).to.have.been.calledWith(sinon.match('matched base path (1 interceptor)'));

            // the log of the Interceptor match
            expect(logFn).to.have.been.calledWith(
            // debug namespace for the scope that includes the host
            sinon.match('nock.scope:example.test'),
            // This is a JSON blob which contains, among other things the complete
            // request URL.
            sinon.match('"href":"http://example.test/deep/link"'),
            // This is the JSON-stringified body.
            "\"" + exampleBody + "\"");

            expect(logFn).to.have.been.calledWith(sinon.match('query matching skipped'));

            expect(logFn).to.have.been.calledWith(sinon.match('matching http://example.test:80/deep/link to POST http://example.test:80/deep/link: true'));
            expect(logFn).to.have.been.calledWith(sinon.match('interceptor identified, starting mocking'));

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));
});