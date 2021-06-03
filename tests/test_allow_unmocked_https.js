"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _servers = require("./servers");

var _servers2 = _interopRequireDefault(_servers);

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
var servers = _servers2.default;

describe('allowUnmocked option (https)', function () {
  it('Nock with allowUnmocked and an url match', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var _ref2, origin, scope, _ref3, body, statusCode;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return servers.startHttpsServer(function (req, res) {
              res.writeHead(200);
              res.end({ status: 'default' });
            });

          case 2:
            _ref2 = _context.sent;
            origin = _ref2.origin;
            scope = nock(origin, { allowUnmocked: true }).get('/urlMatch').reply(201, (0, _stringify2.default)({ status: 'intercepted' }));
            _context.next = 7;
            return got(origin + "/urlMatch", {
              https: { certificateAuthority: servers.ca }
            });

          case 7:
            _ref3 = _context.sent;
            body = _ref3.body;
            statusCode = _ref3.statusCode;


            expect(statusCode).to.equal(201);
            expect(body).to.equal('{"status":"intercepted"}');

            scope.done();

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('allow unmocked option works with https', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var _ref5, origin, client, scope, response1, response2, response3;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return servers.startHttpsServer(function (request, response) {
              if (request.url === '/does/not/exist') {
                response.writeHead(404);
                response.end();
                return;
              }

              response.writeHead(200);
              response.write('server response');
              response.end();
            });

          case 2:
            _ref5 = _context2.sent;
            origin = _ref5.origin;
            client = got.extend({
              prefixUrl: origin,
              throwHttpErrors: false,
              https: { certificateAuthority: servers.ca }
            });
            scope = nock(origin, { allowUnmocked: true }).get('/abc').reply(200, 'mocked response').get('/wont/get/here').reply(500);
            _context2.next = 8;
            return client('abc');

          case 8:
            response1 = _context2.sent;

            expect(response1.statusCode).to.equal(200);
            expect(response1.body).to.equal('mocked response');
            expect(scope.isDone()).to.equal(false);
            _context2.next = 14;
            return client('does/not/exist');

          case 14:
            response2 = _context2.sent;


            expect(response2.statusCode).to.equal(404);
            expect(scope.isDone()).to.equal(false);
            _context2.next = 19;
            return client('');

          case 19:
            response3 = _context2.sent;


            expect(response3.statusCode).to.equal(200);
            expect(response3.body).to.equal('server response');
            expect(scope.isDone()).to.equal(false);

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it('allow unmocked option works with https for a partial match', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var _ref7, origin, _ref8, statusCode, body;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return servers.startHttpsServer(function (request, response) {
              response.writeHead(201);
              response.write('foo');
              response.end();
            });

          case 2:
            _ref7 = _context3.sent;
            origin = _ref7.origin;


            nock(origin, { allowUnmocked: true }).get('/foo').query({ foo: 'bar' }).reply(418);

            // no query so wont match the interceptor
            _context3.next = 7;
            return got(origin + "/foo", {
              https: { certificateAuthority: servers.ca }
            });

          case 7:
            _ref8 = _context3.sent;
            statusCode = _ref8.statusCode;
            body = _ref8.body;


            expect(statusCode).to.equal(201);
            expect(body).to.equal('foo');

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));
});