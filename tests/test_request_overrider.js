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

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _https = require("https");

var _https2 = _interopRequireDefault(_https);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

// Tests of the RequestOverrider, which mocks http.ClientRequest and
// https.ClientRequest. The goal is to provide parity of behavior, both
// documented and undocumented, with the real version.
//
// While most of nock's tests are functional tests which invoke Nock's public
// API and make assertions about requests, usually with got, the tests of the
// request overrider tend to use http directly, and make lower-level
// assertions about how the mock client responds. Here the code under test is
// the part of Nock that must interface with all http clients.

var http = _http2.default;
var https = _https2.default;
var URL = _url2.default.URL;
var expect = _chai2.default.expect;

var sinon = _sinon2.default;
var nock = _2.default;

var got = _got_client2.default;
var servers = _servers2.default;

describe('Request Overrider', function () {
  it('response is an http.IncomingMessage instance', function (done) {
    var responseText = 'incoming message!';
    var scope = nock('http://example.test').get('/somepath').reply(200, responseText);

    http.request({
      host: 'example.test',
      path: '/somepath'
    }, function (res) {
      res.resume();
      expect(res).to.be.an.instanceof(http.IncomingMessage);
      scope.done();
      done();
    }).end();
  });

  it('emits the response event', function (done) {
    var scope = nock('http://example.test').get('/').reply();

    var req = http.get('http://example.test');

    req.on('response', function () {
      scope.done();
      done();
    });
  });

  it('write callback called', function (done) {
    var scope = nock('http://example.test').filteringRequestBody(/mia/, 'nostra').post('/', 'mamma nostra').reply();

    var reqWriteCallback = sinon.spy();

    var req = http.request({
      host: 'example.test',
      method: 'POST',
      path: '/',
      port: 80
    }, function (res) {
      expect(reqWriteCallback).to.have.been.calledOnce();
      expect(res.statusCode).to.equal(200);
      res.on('end', function () {
        scope.done();
        done();
      });
      // Streams start in 'paused' mode and must be started.
      // See https://nodejs.org/api/stream.html#stream_class_stream_readable
      res.resume();
    });

    req.write('mamma mia', null, function () {
      reqWriteCallback();
      req.end();
    });
  });

  it('write callback is not called if the provided chunk is an empty buffer', function (done) {
    var scope = nock('http://example.test').post('/').reply();

    var reqWriteCallback = sinon.spy();

    var req = http.request({
      host: 'example.test',
      method: 'POST',
      path: '/'
    }, function (res) {
      expect(res.statusCode).to.equal(200);
      res.on('end', function () {
        expect(reqWriteCallback).to.not.have.been.called();
        scope.done();
        done();
      });
      // Streams start in 'paused' mode and must be started.
      // See https://nodejs.org/api/stream.html#stream_class_stream_readable
      res.resume();
    });

    var buf = Buffer.from('');
    req.write(buf, null, reqWriteCallback);
    req.end();
  });

  it('end callback called', function (done) {
    var scope = nock('http://example.test').filteringRequestBody(/mia/, 'nostra').post('/', 'mamma nostra').reply();

    var reqEndCallback = sinon.spy();

    var req = http.request({
      host: 'example.test',
      method: 'POST',
      path: '/',
      port: 80
    }, function (res) {
      expect(reqEndCallback).to.have.been.calledOnce();
      expect(res.statusCode).to.equal(200);
      res.on('end', function () {
        scope.done();
        done();
      });
      // Streams start in 'paused' mode and must be started.
      // See https://nodejs.org/api/stream.html#stream_class_stream_readable
      res.resume();
    });

    req.end('mamma mia', null, reqEndCallback);
  });

  // https://github.com/nock/nock/issues/1509
  it('end callback called when end has callback, but no buffer', function (done) {
    var scope = nock('http://example.test').post('/').reply();

    var reqEndCallback = sinon.spy();

    var req = http.request({
      host: 'example.test',
      method: 'POST',
      path: '/',
      port: 80
    }, function (res) {
      expect(reqEndCallback).to.have.been.calledOnce();
      expect(res.statusCode).to.equal(200);
      res.on('end', function () {
        scope.done();
        done();
      });
      // Streams start in 'paused' mode and must be started.
      // See https://nodejs.org/api/stream.html#stream_class_stream_readable
      res.resume();
    });

    req.end(reqEndCallback);
  });

  it('request.end called with all three arguments', function (done) {
    var scope = nock('http://example.test').post('/', 'foobar').reply();

    var reqEndCallback = sinon.spy();

    var req = http.request({
      host: 'example.test',
      method: 'POST',
      path: '/'
    }, function (res) {
      expect(reqEndCallback).to.have.been.calledOnce();
      res.on('end', function () {
        scope.done();
        done();
      });
      res.resume();
    });

    // hex(foobar) == 666F6F626172
    req.end('666F6F626172', 'hex', reqEndCallback);
  });

  it('request.end called with only data and encoding', function (done) {
    var scope = nock('http://example.test').post('/', 'foobar').reply();

    var req = http.request({
      host: 'example.test',
      method: 'POST',
      path: '/'
    }, function (res) {
      res.on('end', function () {
        scope.done();
        done();
      });
      res.resume();
    });

    // hex(foobar) == 666F6F626172
    req.end('666F6F626172', 'hex');
  });

  it('request.end called with only data and a callback', function (done) {
    var scope = nock('http://example.test').post('/', 'foobar').reply();

    var reqEndCallback = sinon.spy();

    var req = http.request({
      host: 'example.test',
      method: 'POST',
      path: '/'
    }, function (res) {
      expect(reqEndCallback).to.have.been.calledOnce();
      res.on('end', function () {
        scope.done();
        done();
      });
      res.resume();
    });

    req.end('foobar', reqEndCallback);
  });

  // https://github.com/nock/nock/issues/2112
  it('request.end can be called multiple times without a chunk and not error', function (done) {
    var scope = nock('http://example.test').get('/').reply();

    var req = http.request({
      host: 'example.test',
      method: 'GET',
      path: '/'
    }, function (res) {
      res.on('end', function () {
        scope.done();
        done();
      });
      res.resume();
    });

    req.end();
    req.end();
    req.end();
  });

  it('should emit an error if `write` is called after `end`', function (done) {
    nock('http://example.test').get('/').reply();

    var req = http.request('http://example.test');

    req.on('error', function (err) {
      expect(err.message).to.equal('write after end');
      expect(err.code).to.equal('ERR_STREAM_WRITE_AFTER_END');
      done();
    });

    req.end();
    req.write('foo');
  });

  // http://github.com/nock/nock/issues/139
  it('should emit "finish" on the request before emitting "end" on the response', function (done) {
    var scope = nock('http://example.test').post('/').reply();

    var onFinish = sinon.spy();

    var req = http.request({
      host: 'example.test',
      method: 'POST',
      path: '/',
      port: 80
    }, function (res) {
      expect(onFinish).to.have.been.calledOnce();
      expect(res.statusCode).to.equal(200);

      res.on('end', function () {
        expect(onFinish).to.have.been.calledOnce();
        scope.done();
        done();
      });
      // Streams start in 'paused' mode and must be started.
      // See https://nodejs.org/api/stream.html#stream_class_stream_readable
      res.resume();
    });

    req.on('finish', onFinish);

    req.end('mamma mia');
  });

  it('should update the writable attributes before emitting the "finish" event', function (done) {
    nock('http://example.test').post('/').reply();

    var req = http.request({
      host: 'example.test',
      method: 'POST',
      path: '/',
      port: 80
    });

    // `writableEnded` was added in v12.9.0 to rename `finished` which was deprecated in v13.4.0. it's just an alias,
    // but it only denotes that `end` was called on the request not that the socket has finished flushing (hence the rename).
    expect(req.finished).to.be.false();
    var hasWriteable = 'writableEnded' in req; // to support v10
    expect(req.writableEnded).to.equal(hasWriteable ? false : undefined);

    // `writableFinished` denotes all data has been flushed to the underlying system, immediately before
    // the 'finish' event is emitted. Nock's "socket" is instantaneous so these attributes never differ.
    expect(req.writableFinished).to.equal(hasWriteable ? false : undefined);

    req.on('finish', function () {
      expect(req.finished).to.be.true();
      expect(req.writableEnded).to.equal(hasWriteable ? true : undefined);
      expect(req.writableFinished).to.equal(hasWriteable ? true : undefined);

      done();
    });

    req.end('mamma mia');
  });

  // TODO Convert to async / got.
  it('pause response before data', function (done) {
    var scope = nock('http://example.test').get('/pauser').reply(200, 'nobody');

    var req = http.request({
      host: 'example.test',
      path: '/pauser'
    });

    var didTimeout = sinon.spy();
    var onData = sinon.spy();

    req.on('response', function (res) {
      res.pause();

      setTimeout(function () {
        didTimeout();
        res.resume();
      }, 500);

      res.on('data', function () {
        onData();
        expect(didTimeout).to.have.been.calledOnce();
      });

      res.on('end', function () {
        expect(onData).to.have.been.calledOnce();
        scope.done();
        done();
      });
    });

    req.end();
  });

  it('accept URL as request target', function (done) {
    var onData = sinon.spy();

    var scope = nock('http://example.test').get('/').reply(200, 'Hello World!');

    http.get(new URL('http://example.test'), function (res) {
      expect(res.statusCode).to.equal(200);

      res.on('data', function (data) {
        onData();
        expect(data).to.be.an.instanceof(Buffer);
        expect(data.toString()).to.equal('Hello World!');
      });

      res.on('end', function () {
        expect(onData).to.have.been.calledOnce();
        scope.done();
        done();
      });
    });
  });

  it('request has path', function (done) {
    var scope = nock('http://example.test').get('/the/path/to/infinity').reply(200);

    var req = http.request({
      hostname: 'example.test',
      port: 80,
      method: 'GET',
      path: '/the/path/to/infinity'
    }, function (res) {
      scope.done();
      expect(req.path).to.equal('/the/path/to/infinity');
      done();
    });
    req.end();
  });

  it('has a req property on the response', function (done) {
    var scope = nock('http://example.test').get('/like-wtf').reply(200);

    var req = http.request('http://example.test/like-wtf', function (res) {
      res.on('end', function () {
        expect(res.req).to.be.an.instanceof(http.ClientRequest);
        scope.done();
        done();
      });
      // Streams start in 'paused' mode and must be started.
      // See https://nodejs.org/api/stream.html#stream_class_stream_readable
      res.resume();
    });
    req.end();
  });

  // Hopefully address https://github.com/nock/nock/issues/146, at least in spirit.
  it('request with a large buffer', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var replyLength, responseBody, scope, _ref2, body;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            replyLength = 1024 * 1024;
            responseBody = Buffer.from(new Array(replyLength + 1).join('.'));
            // Confidence check.

            expect(responseBody.length).to.equal(replyLength);

            scope = nock('http://example.test').get('/').reply(200, responseBody, { 'Content-Encoding': 'gzip' });
            _context.next = 6;
            return got('http://example.test', {
              responseType: 'buffer',
              decompress: false
            });

          case 6:
            _ref2 = _context.sent;
            body = _ref2.body;

            expect(body).to.deep.equal(responseBody);
            scope.done();

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('.setNoDelay', function (done) {
    nock('http://example.test').get('/yay').reply(200, 'Hi');

    var req = http.request({
      host: 'example.test',
      path: '/yay',
      port: 80
    }, function (res) {
      expect(res.statusCode).to.equal(200);
      res.on('end', done);
      // Streams start in 'paused' mode and must be started.
      // See https://nodejs.org/api/stream.html#stream_class_stream_readable
      res.resume();
    });

    req.setNoDelay(true);

    req.end();
  });

  it('request emits socket', function (done) {
    nock('http://example.test').get('/').reply(200, 'hey');

    var req = http.get('http://example.test');
    // Using `this`, so can't use arrow function.
    req.once('socket', function (socket) {
      // https://github.com/nock/nock/pull/769
      // https://github.com/nock/nock/pull/779
      expect(this).to.equal(req);
      expect(socket).to.be.an.instanceof(Object);
      done();
    });
  });

  it('socket is shared and aliased correctly', function (done) {
    nock('http://example.test').get('/').reply();

    var req = http.get('http://example.test');

    req.once('response', function (res) {
      expect(req.socket).to.equal(req.connection);
      expect(req.socket).to.equal(res.socket);
      expect(res.socket).to.equal(res.client);
      expect(res.socket).to.equal(res.connection);
      done();
    });
  });

  it('socket emits connect and secureConnect', function (done) {
    nock('https://example.test').post('/').reply(200, 'hey');

    var req = https.request({
      host: 'example.test',
      path: '/',
      method: 'POST'
    });

    var onConnect = sinon.spy();
    var onSecureConnect = sinon.spy();

    req.on('socket', function (socket) {
      socket.once('connect', function () {
        onConnect();
        req.end();
      });
      socket.once('secureConnect', onSecureConnect);
    });

    req.once('response', function (res) {
      res.setEncoding('utf8');
      res.on('data', function (data) {
        expect(data).to.equal('hey');
        expect(onConnect).to.have.been.calledOnce();
        expect(onSecureConnect).to.have.been.calledOnce();
        done();
      });
    });
  });

  it('socket has address() method', function (done) {
    nock('http://example.test').get('/').reply();

    var req = http.get('http://example.test');
    req.once('socket', function (socket) {
      expect(socket.address()).to.deep.equal({
        port: 80,
        family: 'IPv4',
        address: '127.0.0.1'
      });
      done();
    });
  });

  it('socket has address() method, https/IPv6', function (done) {
    nock('https://example.test').get('/').reply();

    var req = https.get('https://example.test', { family: 6 });
    req.once('socket', function (socket) {
      expect(socket.address()).to.deep.equal({
        port: 443,
        family: 'IPv6',
        address: '::1'
      });
      done();
    });
  });

  it('socket has setKeepAlive() method', function (done) {
    nock('http://example.test').get('/').reply(200, 'hey');

    var req = http.get('http://example.test');
    req.once('socket', function (socket) {
      socket.setKeepAlive(true);
      done();
    });
  });

  it('socket has ref() and unref() method', function (done) {
    nock('http://example.test').get('/').reply(200, 'hey');

    var req = http.get('http://example.test');
    req.once('socket', function (socket) {
      expect(socket).to.respondTo('ref').and.to.to.respondTo('unref');
      // FIXME: These functions, and many of the other Socket functions, should
      // actually return `this`.
      // https://github.com/nock/nock/pull/1770#discussion_r343425097
      expect(socket.ref()).to.be.undefined();
      expect(socket.unref()).to.be.undefined();
      done();
    });
  });

  it('socket has destroy() method', function (done) {
    nock('http://example.test').get('/').reply(200, 'hey');

    var req = http.get('http://example.test');
    req.on('error', function () {}); // listen for error so it doesn't bubble
    req.once('socket', function (socket) {
      socket.destroy();
      done();
    });
  });

  it('calling Socket#destroy() multiple times only emits a single `close` event', function (done) {
    nock('http://example.test').get('/').reply(200, 'hey');

    var req = http.get('http://example.test');
    req.on('error', function () {}); // listen for error so it doesn't bubble
    req.once('socket', function (socket) {
      var closeSpy = sinon.spy();
      socket.on('close', closeSpy);

      socket.destroy().destroy().destroy();

      setTimeout(function () {
        expect(closeSpy).to.have.been.calledOnce();
        done();
      }, 10);
    });
  });

  it('socket has getPeerCertificate() method which returns a random base64 string', function (done) {
    nock('http://example.test').get('/').reply();

    var req = http.get('http://example.test');
    req.once('socket', function (socket) {
      var first = socket.getPeerCertificate();
      var second = socket.getPeerCertificate();
      expect(first).to.be.a('string');
      expect(second).to.be.a('string').and.not.equal(first);
      done();
    });
  });

  it('abort destroys socket', function (done) {
    nock('http://example.test').get('/').reply(200, 'hey');

    var req = http.get('http://example.test');
    // Ignore errors.
    req.once('error', function () {});
    req.once('socket', function (socket) {
      req.abort();
      expect(socket.destroyed).to.be.true();
      done();
    });
  });

  it('should throw expected error when creating request with missing options', function (done) {
    expect(function () {
      return http.request();
    }).to.throw(Error, 'Making a request with empty `options` is not supported in Nock');
    done();
  });

  // https://github.com/nock/nock/issues/1558
  it("mocked requests have 'method' property", function (done) {
    var scope = nock('http://example.test').get('/somepath').reply(200, {});

    var req = http.request({
      host: 'example.test',
      path: '/somepath',
      method: 'GET',
      port: 80
    });

    expect(req.method).to.equal('GET');

    req.on('response', function (res) {
      expect(res.req.method).to.equal('GET');
      scope.done();
      done();
    });

    req.end();
  });

  // https://github.com/nock/nock/issues/1493
  it("response has 'complete' property and it's true after end", function (done) {
    var scope = nock('http://example.test').get('/').reply(200, 'Hello World!');

    var req = http.request({
      host: 'example.test',
      method: 'GET',
      path: '/',
      port: 80
    }, function (res) {
      res.on('end', function () {
        expect(res.complete).to.be.true();
        scope.done();
        done();
      });
      // Streams start in 'paused' mode and must be started.
      // See https://nodejs.org/api/stream.html#stream_class_stream_readable
      res.resume();
    });
    req.end();
  });

  it('Request with `Expect: 100-continue` triggers continue event', function (done) {
    // This is a replacement for a wide-bracket regression test that was added
    // for https://github.com/nock/nock/issues/256.
    //
    // The behavior was subsequently changed so 'continue' is emitted only when
    // the `Expect: 100-continue` header is present.
    //
    // This test was adapted from this test from Node:
    // https://github.com/nodejs/node/blob/1b2d3f7ae7f0391908b70b0333a5adef3c8cb79d/test/parallel/test-http-expect-continue.js#L35
    //
    // Related:
    // https://tools.ietf.org/html/rfc2616#section-8.2.3
    // https://github.com/nodejs/node/issues/10487
    var exampleRequestBody = 'this is the full request body';

    var scope = nock('http://example.test').post('/', exampleRequestBody).reply();

    var req = http.request({
      host: 'example.test',
      method: 'POST',
      path: '/',
      port: 80,
      headers: { Expect: '100-continue' }
    });

    var onData = sinon.spy();

    req.on('response', function (res) {
      expect(res.statusCode).to.equal(200);
      // The `end` event will not fire without a `data` listener, though it
      // will never fire since the body is empty. This is consistent with
      // the Node docs:
      // https://nodejs.org/api/http.html#http_class_http_clientrequest
      res.on('data', onData);
      res.on('end', function () {
        expect(onData).not.to.have.been.called();
        scope.done();
        done();
      });
    });

    req.on('continue', function () {
      req.end(exampleRequestBody);
    });
  });

  // https://github.com/nock/nock/issues/1836
  it('when http.get and http.request have been overridden before nock overrides them, http.get calls through to the expected method', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var overriddenRequest, overriddenGet, _ref4, origin, req;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // Obtain the original `http.request()` and stub it out, as a library might.
            nock.restore();
            overriddenRequest = sinon.stub(http, 'request').callThrough();
            overriddenGet = sinon.stub(http, 'get').callThrough();

            // Let Nock override them again.

            nock.activate();

            _context2.next = 6;
            return servers.startHttpServer(function (request, response) {
              response.writeHead(200);
              response.end();
            });

          case 6:
            _ref4 = _context2.sent;
            origin = _ref4.origin;
            req = http.get(origin);

            expect(overriddenGet).to.have.been.calledOnce();
            expect(overriddenRequest).not.to.have.been.called();

            req.abort();

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  // https://github.com/nock/nock/issues/1836
  it('when http.get and http.request have been overridden before nock overrides them, http.request calls through to the expected method', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var overriddenRequest, overriddenGet, req;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // Obtain the original `http.request()` and stub it out, as a library might.
            nock.restore();
            overriddenRequest = sinon.stub(http, 'request').callThrough();
            overriddenGet = sinon.stub(http, 'get').callThrough();

            // Let Nock override them again.

            nock.activate();

            req = http.request({
              host: 'localhost',
              path: '/',
              port: 1234
            });

            expect(overriddenRequest).to.have.been.calledOnce();
            expect(overriddenGet).not.to.have.been.called();

            req.abort();

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));
});