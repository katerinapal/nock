"use strict";

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

// These tests use `setTimeout` before verifying emitted events to ensure any
// number of `nextTicks` or `setImmediate` can process first.

// Node will emit a `prefinish` event after `socket`, but it's an internal,
// undocumented event that Nock does not emulate.

// The order of tests run sequentially through a ClientRequest's lifetime.
// Starting the top by aborting requests early on then aborting later and later.
describe('`ClientRequest.abort()`', function () {
  it('Emits the expected event sequence when `write` is called on an aborted request', function (done) {
    var scope = nock('http://example.test').get('/').reply();

    var req = http.request('http://example.test');
    var emitSpy = sinon.spy(req, 'emit');
    req.abort();
    req.write('foo');

    setTimeout(function () {
      expect(emitSpy).to.have.been.calledOnceWithExactly('abort');
      expect(scope.isDone()).to.be.false();
      done();
    }, 10);
  });

  it('Emits the expected event sequence when `end` is called on an aborted request', function (done) {
    var scope = nock('http://example.test').get('/').reply();

    var req = http.request('http://example.test');
    var emitSpy = sinon.spy(req, 'emit');
    req.abort();
    req.end();

    setTimeout(function () {
      expect(emitSpy).to.have.been.calledOnceWithExactly('abort');
      expect(scope.isDone()).to.be.false();
      done();
    }, 10);
  });

  it('Emits the expected event sequence when `flushHeaders` is called on an aborted request', function (done) {
    var scope = nock('http://example.test').get('/').reply();

    var req = http.request('http://example.test');
    var emitSpy = sinon.spy(req, 'emit');
    req.abort();
    req.flushHeaders();

    setTimeout(function () {
      expect(emitSpy).to.have.been.calledOnceWithExactly('abort');
      expect(scope.isDone()).to.be.false();
      done();
    }, 10);
  });

  it('Emits the expected event sequence when aborted immediately after `end`', function (done) {
    var scope = nock('http://example.test').get('/').reply();

    var req = http.request('http://example.test');
    var emitSpy = sinon.spy(req, 'emit');
    req.end();
    req.abort();

    setTimeout(function () {
      expect(emitSpy).to.have.been.calledOnceWithExactly('abort');
      expect(scope.isDone()).to.be.false();
      done();
    }, 10);
  });

  it('Emits the expected event sequence when aborted inside a `socket` event listener', function (done) {
    var scope = nock('http://example.test').get('/').reply();

    var req = http.request('http://example.test');
    var emitSpy = sinon.spy(req, 'emit');

    req.on('socket', function () {
      req.abort();
    });
    req.on('error', function (err) {
      expect(err.message).to.equal('socket hang up');
      expect(err.code).to.equal('ECONNRESET');
    });
    req.end();

    setTimeout(function () {
      var events = emitSpy.args.map(function (i) {
        return i[0];
      });
      expect(events).to.deep.equal(['socket', 'abort', 'error', 'close']);
      expect(scope.isDone()).to.be.false();
      done();
    }, 10);
  });

  it('Emits the expected event sequence when aborted multiple times', function (done) {
    var scope = nock('http://example.test').get('/').reply();

    var req = http.request('http://example.test');
    var emitSpy = sinon.spy(req, 'emit');

    req.on('error', function () {}); // listen for error so it doesn't bubble
    req.on('socket', function () {
      req.abort();
      req.abort();
      req.abort();
    });
    req.end();

    setTimeout(function () {
      var events = emitSpy.args.map(function (i) {
        return i[0];
      });
      // important: `abort` and `error` events only fire once and the `close` event still fires at the end
      expect(events).to.deep.equal(['socket', 'abort', 'error', 'close']);
      expect(scope.isDone()).to.be.false();
      done();
    }, 10);
  });

  // The Interceptor is considered consumed just prior to the `finish` event on the request,
  // all tests below assert the Scope is done.

  it('Emits the expected event sequence when aborted inside a `finish` event listener', function (done) {
    var scope = nock('http://example.test').get('/').reply();

    var req = http.request('http://example.test');
    var emitSpy = sinon.spy(req, 'emit');

    req.on('finish', function () {
      req.abort();
    });
    req.on('error', function (err) {
      expect(err.message).to.equal('socket hang up');
      expect(err.code).to.equal('ECONNRESET');
    });
    req.end();

    setTimeout(function () {
      var events = emitSpy.args.map(function (i) {
        return i[0];
      });
      expect(events).to.deep.equal(['socket', 'finish', 'abort', 'error', 'close']);
      scope.done();
      done();
    }, 10);
  });

  it('Emits the expected event sequence when aborted after a delay from the `finish` event', function (done) {
    // use the delay functionality to create a window where the abort is called during the artificial connection wait.
    var scope = nock('http://example.test').get('/').delay(100).reply();

    var req = http.request('http://example.test');
    var emitSpy = sinon.spy(req, 'emit');

    req.on('finish', function () {
      setTimeout(function () {
        req.abort();
      }, 10);
    });
    req.on('error', function (err) {
      expect(err.message).to.equal('socket hang up');
      expect(err.code).to.equal('ECONNRESET');
    });
    req.end();

    setTimeout(function () {
      var events = emitSpy.args.map(function (i) {
        return i[0];
      });
      expect(events).to.deep.equal(['socket', 'finish', 'abort', 'error', 'close']);
      scope.done();
      done();
    }, 200);
  });

  it('Emits the expected event sequence when aborted inside a `response` event listener', function (done) {
    var scope = nock('http://example.test').get('/').reply();

    var req = http.request('http://example.test');
    var emitSpy = sinon.spy(req, 'emit');

    req.on('response', function () {
      req.abort();
    });
    req.end();

    setTimeout(function () {
      var events = emitSpy.args.map(function (i) {
        return i[0];
      });
      expect(events).to.deep.equal(['socket', 'finish', 'response', 'abort', 'close']);
      scope.done();
      done();
    }, 10);
  });
});