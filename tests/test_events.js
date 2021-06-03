"use strict";

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

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var expect = _chai2.default.expect;

var http = _http2.default;
var path = _path2.default;
var sinon = _sinon2.default;

var nock = _2.default;
var got = _got_client2.default;

function ignore() {}

it('emits request and replied events when request has no body', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
  var scope, onRequest, onReplied;
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          scope = nock('http://example.test').get('/').reply();
          onRequest = sinon.spy();
          onReplied = sinon.spy();


          scope.on('request', onRequest);
          scope.on('replied', onReplied);

          _context.next = 7;
          return got('http://example.test');

        case 7:

          scope.done();
          expect(onRequest).to.have.been.calledOnce();
          expect(onReplied).to.have.been.calledOnce();

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, undefined);
})));

it('emits request and request body', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
  var data, scope, onRequest, onReplied;
  return _regenerator2.default.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          data = 'example=123';
          scope = nock('http://example.test').post('/please').reply();
          onRequest = sinon.spy();
          onReplied = sinon.spy();


          scope.on('request', function (req, interceptor, body) {
            onRequest();
            expect(req.path).to.equal('/please');
            expect(interceptor.interceptionCounter).to.equal(1);
            expect(body).to.deep.equal(data);
            expect(onReplied).to.not.have.been.called();
          });

          scope.on('replied', function (req, interceptor) {
            onReplied();
            expect(req.path).to.equal('/please');
            expect(interceptor.interceptionCounter).to.equal(1);
          });

          _context2.next = 8;
          return got.post('http://example.test/please', {
            body: data,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': Buffer.byteLength(data)
            }
          });

        case 8:

          scope.done();
          expect(onRequest).to.have.been.calledOnce();
          expect(onReplied).to.have.been.calledOnce();

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2, undefined);
})));

it('emits request and replied events when response body is a stream', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
  var textFilePath, scope, onRequest, onReplied;
  return _regenerator2.default.wrap(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          textFilePath = path.resolve(__dirname, './assets/reply_file_1.txt');
          scope = nock('http://example.test').get('/').replyWithFile(200, textFilePath);
          onRequest = sinon.spy();
          onReplied = sinon.spy();


          scope.on('request', onRequest);
          scope.on('replied', onReplied);

          _context3.next = 8;
          return got('http://example.test');

        case 8:

          scope.done();
          expect(onRequest).to.have.been.calledOnce();
          expect(onReplied).to.have.been.calledOnce();

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  }, _callee3, undefined);
})));

it('emits no match when no match and no mock', function (done) {
  nock.emitter.once('no match', function () {
    done();
  });

  http.get('http://example.test/abc').once('error', ignore);
});

it('emits no match when no match and mocked', function (done) {
  nock('http://example.test').get('/').reply(418);

  nock.emitter.on('no match', function (req) {
    expect(req.path).to.equal('/definitelymaybe');
    done();
  });

  http.get('http://example.test/definitelymaybe').once('error', ignore);
});

it('emits no match when netConnect is disabled', function (done) {
  nock.disableNetConnect();

  nock.emitter.on('no match', function (req) {
    expect(req.hostname).to.equal('example.test');
    done();
  });

  http.get('http://example.test').once('error', ignore);
});