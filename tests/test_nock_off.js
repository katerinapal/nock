"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _servers = require("./servers");

var _servers2 = _interopRequireDefault(_servers);

var _got_client = require("./got_client");

var _got_client2 = _interopRequireDefault(_got_client);

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var expect = _chai2.default.expect;

var http = _http2.default;
var nock = _2.default;

var got = _got_client2.default;
var httpsServer = _servers2.default;

describe('NOCK_OFF env var', function () {
  var original = void 0;
  beforeEach(function () {
    original = process.env.NOCK_OFF;
    process.env.NOCK_OFF = 'true';
  });
  afterEach(function () {
    process.env.NOCK_OFF = original;
  });

  it('when true, https mocks reach the live server', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var responseBody, _ref2, origin, scope, _ref3, body;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            responseBody = 'the real thing';
            _context.next = 3;
            return httpsServer.startHttpsServer(function (request, response) {
              response.writeHead(200);
              response.end(responseBody);
            });

          case 3:
            _ref2 = _context.sent;
            origin = _ref2.origin;
            scope = nock(origin, { allowUnmocked: true }).get('/').reply(200, 'mock');
            _context.next = 8;
            return got(origin, {
              https: { certificateAuthority: httpsServer.ca }
            });

          case 8:
            _ref3 = _context.sent;
            body = _ref3.body;

            expect(body).to.equal(responseBody);
            scope.done();

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('when true before import, Nock does not activate', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var originalClient, newNock;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            nock.restore();
            originalClient = http.ClientRequest;


            delete require.cache[require.resolve('..')];
            newNock = _2.default;


            expect(http.ClientRequest).to.equal(originalClient);
            expect(newNock.isActive()).to.equal(false);

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));
});