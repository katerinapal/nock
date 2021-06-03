"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _servers = require("./servers");

var _servers2 = _interopRequireDefault(_servers);

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var expect = _chai2.default.expect;

var http = _http2.default;
var sinon = _sinon2.default;
var nock = _2.default;

var startHttpServer = _servers2.default.startHttpServer;

// Because `Got` makes use of the `http(s).request` convenience function, it can not be used during these tests.

describe('Direct use of `ClientRequest`', function () {
  it('should intercept GET requests', function (done) {
    var dataSpy = sinon.spy();

    var scope = nock('http://example.test').get('/dsad').reply(202, 'HEHE!');

    var req = new http.ClientRequest({
      host: 'example.test',
      path: '/dsad'
    });

    req.on('response', function (res) {
      expect(res.statusCode).to.equal(202);
      res.on('end', function () {
        expect(dataSpy).to.have.been.calledOnce();
        scope.done();
        done();
      });
      res.on('data', function (data) {
        dataSpy();
        expect(data).to.be.instanceof(Buffer);
        expect(data.toString()).to.equal('HEHE!');
      });
    });

    req.end();
  });

  it('should intercept POST requests', function (done) {
    var dataSpy = sinon.spy();

    var scope = nock('http://example.test').post('/posthere/please', 'heyhey this is the body').reply(201, 'DOOONE!');

    var req = new http.ClientRequest({
      host: 'example.test',
      path: '/posthere/please',
      method: 'POST'
    });
    req.write('heyhey this is the body');

    req.on('response', function (res) {
      expect(res.statusCode).to.equal(201);
      res.on('end', function () {
        expect(dataSpy).to.have.been.calledOnce();
        scope.done();
        done();
      });
      res.on('data', function (data) {
        dataSpy();
        expect(data).to.be.instanceof(Buffer);
        expect(data.toString()).to.equal('DOOONE!');
      });
    });

    req.end();
  });

  it('should execute optional callback', function (done) {
    var scope = nock('http://example.test').get('/').reply(201);

    var reqOpts = {
      host: 'example.test',
      path: '/',
      method: 'GET'
    };
    var req = new http.ClientRequest(reqOpts, function (res) {
      expect(res.statusCode).to.equal(201);
      scope.done();
      done();
    });
    req.end();
  });

  it('should throw an expected error when creating with empty options', function () {
    expect(function () {
      return new http.ClientRequest();
    }).to.throw('Creating a ClientRequest with empty `options` is not supported in Nock');
  });

  it('should pass thru a live request when no interceptors and net connect is allowed', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var _ref2, origin, req;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return startHttpServer(function (request, response) {
              response.writeHead(201);
              response.end();
            });

          case 2:
            _ref2 = _context.sent;
            origin = _ref2.origin;
            req = new http.ClientRequest(origin);
            _context.next = 7;
            return new _promise2.default(function (resolve) {
              req.on('response', function (res) {
                expect(res.statusCode).to.equal(201);
                resolve();
              });
              req.end();
            });

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('should emit an expected error when no interceptors and net connect is disallowed', function (done) {
    nock.disableNetConnect();
    new http.ClientRequest({ port: 12345, path: '/' }).on('error', function (err) {
      expect(err.message).to.equal('Nock: Disallowed net connect for "localhost:12345/"');
      done();
    });
  });
});