"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var resolvesInAtLeast = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(promise, durationMillis) {
    var startTime, result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            startTime = process.hrtime();
            _context.next = 3;
            return promise;

          case 3:
            result = _context.sent;

            checkDuration(startTime, durationMillis);
            return _context.abrupt("return", result);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function resolvesInAtLeast(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _got_client = require("./got_client");

var _got_client2 = _interopRequireDefault(_got_client);

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _assertRejects = require("assert-rejects");

var _assertRejects2 = _interopRequireDefault(_assertRejects);

var _stream = require("stream");

var _stream2 = _interopRequireDefault(_stream);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var fs = _fs2.default;
var expect = _chai2.default.expect;

var path = _path2.default;
var http = _http2.default;
var stream = _stream2.default;
var assertRejects = _assertRejects2.default;
var sinon = _sinon2.default;
var nock = _2.default;
var got = _got_client2.default;

var textFilePath = path.resolve(__dirname, './assets/reply_file_1.txt');
var textFileContents = fs.readFileSync(textFilePath, { encoding: 'utf8' });

function checkDuration(start, durationMillis) {
  var hrtime = process.hrtime(start);
  var milliseconds = (hrtime[0] * 1e9 + hrtime[1]) / 1e6 | 0;

  // When asserting delays, we know the code should take at least the delay amount of time to execute,
  // however, the overhead of running the code adds a few milliseconds to anything we are testing.
  // We'd like to test some sort of upper bound too, but that has been problematic with different systems
  // having a wide rage of overhead.
  // We've also seen discrepancies with timings that sometimes result in the passed milliseconds
  // being one shy of the expected duration. Subtracting 5ms makes it more resilient.
  // https://github.com/nock/nock/issues/2045
  // TODO: find a better way to test delays while ensuring the delays aren't too long.
  expect(milliseconds).to.be.at.least(durationMillis - 5, 'delay minimum not satisfied');
  // .and.at.most(durationMillis + bufferMillis, 'delay upper bound exceeded')
}

describe('`delay()`', function () {
  var interceptor = void 0;
  var connSpy = void 0;
  var bodySpy = void 0;

  // As a rule, the tests in this repo have a strategy of only testing the API and not spying on
  // internals for unit tests. These next few tests break that rule to assert the proxy behavior of
  // `delay()`. This is simply to reduce the need of double testing the behavior of `delayBody()`
  // and `delayConnection()` and should not be used as an example for writing new tests.
  beforeEach(function () {
    interceptor = nock('http://example.test').get('/');
    connSpy = sinon.spy(interceptor, 'delayConnection');
    bodySpy = sinon.spy(interceptor, 'delayBody');
  });

  it('should proxy a single number argument', function () {
    interceptor.delay(42);

    expect(connSpy).to.have.been.calledOnceWithExactly(42);
    expect(bodySpy).to.have.been.calledOnceWithExactly(0);
  });

  it('should proxy values from an object argument', function () {
    interceptor.delay({ head: 42, body: 17 });

    expect(connSpy).to.have.been.calledOnceWithExactly(42);
    expect(bodySpy).to.have.been.calledOnceWithExactly(17);
  });

  it('should default missing values from an object argument', function () {
    interceptor.delay({});

    expect(connSpy).to.have.been.calledOnceWithExactly(0);
    expect(bodySpy).to.have.been.calledOnceWithExactly(0);
  });

  it('should throw on invalid arguments', function () {
    expect(function () {
      return interceptor.delay('one million seconds');
    }).to.throw('Unexpected input');
  });

  it('should delay the response when called with "body" and "head"', function (done) {
    nock('http://example.test').get('/').delay({
      head: 200,
      body: 300
    }).reply(200, 'OK');

    var start = process.hrtime();

    http.get('http://example.test', function (res) {
      checkDuration(start, 200);

      res.once('data', function (data) {
        checkDuration(start, 500);
        expect(data.toString()).to.equal('OK');
        res.once('end', done);
      });
    });
  });
});

describe('`delayBody()`', function () {
  it('should delay the clock between the `response` event and the first `data` event', function (done) {
    nock('http://example.test').get('/').delayBody(200).reply(201, 'OK');

    http.get('http://example.test', function (res) {
      var start = process.hrtime();
      res.once('data', function () {
        checkDuration(start, 200);
        done();
      });
    });
  });

  it('should delay the overall response', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var scope, _ref3, body;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            scope = nock('http://example.test').get('/').delayBody(200).reply(200, 'OK');
            _context2.next = 3;
            return resolvesInAtLeast(got('http://example.test/'), 200);

          case 3:
            _ref3 = _context2.sent;
            body = _ref3.body;


            expect(body).to.equal('OK');
            scope.done();

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it('should not have an impact on a response timeout', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var scope, _ref5, body, statusCode;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            scope = nock('http://example.test').get('/').delayConnection(300).delayBody(300).reply(201, 'OK');
            _context3.next = 3;
            return got('http://example.test/', {
              timeout: {
                response: 500
              }
            });

          case 3:
            _ref5 = _context3.sent;
            body = _ref5.body;
            statusCode = _ref5.statusCode;


            expect(statusCode).to.equal(201);
            expect(body).to.equal('OK');
            scope.done();

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  it('should work with a response stream', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var scope, _ref7, body;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            scope = nock('http://example.test').get('/').delayBody(200).reply(200, function () {
              return fs.createReadStream(textFilePath, { encoding: 'utf8' });
            });
            _context4.next = 3;
            return resolvesInAtLeast(got('http://example.test/'), 200);

          case 3:
            _ref7 = _context4.sent;
            body = _ref7.body;


            expect(body).to.equal(textFileContents);
            scope.done();

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));

  it('should work with a response stream of binary buffers', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
    var scope, _ref9, body;

    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            scope = nock('http://example.test').get('/').delayBody(200)
            // No encoding specified, which causes the file to be streamed using
            // buffers instead of strings.
            .reply(200, function () {
              return fs.createReadStream(textFilePath);
            });
            _context5.next = 3;
            return resolvesInAtLeast(got('http://example.test/'), 200);

          case 3:
            _ref9 = _context5.sent;
            body = _ref9.body;


            expect(body).to.equal(textFileContents);
            scope.done();

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  })));

  it('should work with a delayed response stream', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
    var passthrough, scope, _ref11, body;

    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            passthrough = new stream.Transform({
              transform: function transform(chunk, encoding, callback) {
                this.push(chunk.toString());
                callback();
              }
            });
            scope = nock('http://example.test').get('/').delayBody(100).reply(200, function () {
              return passthrough;
            });


            setTimeout(function () {
              return fs.createReadStream(textFilePath).pipe(passthrough);
            }, 125);

            _context6.next = 5;
            return got('http://example.test/');

          case 5:
            _ref11 = _context6.sent;
            body = _ref11.body;


            expect(body).to.equal(textFileContents);
            scope.done();

          case 9:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  })));
});

describe('`delayConnection()`', function () {
  it('should cause a timeout error when larger than options.timeout', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
    var scope;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            scope = nock('http://example.test').get('/').delayConnection(1000).reply(200, {});
            _context7.next = 3;
            return assertRejects(got('http://example.test', { timeout: 10 }), function (err) {
              return err.code === 'ETIMEDOUT';
            });

          case 3:

            scope.done();

          case 4:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  })));

  it('should delay the clock before the `response` event', function (done) {
    nock('http://example.test').get('/').delayConnection(200).reply();

    var req = http.request('http://example.test', function () {
      checkDuration(start, 200);
      done();
    });

    req.end();
    var start = process.hrtime();
  });

  it('should delay the overall response', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
    var scope, _ref14, body;

    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            scope = nock('http://example.test').get('/').delayConnection(200).reply(200, 'OK');
            _context8.next = 3;
            return resolvesInAtLeast(got('http://example.test'), 200);

          case 3:
            _ref14 = _context8.sent;
            body = _ref14.body;


            expect(body).to.equal('OK');
            scope.done();

          case 7:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  })));

  it('should provide the proper arguments when using reply a callback', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
    var replyStub, scope;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            replyStub = sinon.stub().returns('');
            scope = nock('http://example.test').post('/').delayConnection(100).reply(200, replyStub);
            _context9.next = 4;
            return got.post('http://example.test', { body: 'OK' });

          case 4:

            expect(replyStub).to.have.been.calledOnceWithExactly('/', 'OK');
            scope.done();

          case 6:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  })));

  it('should delay a JSON response when using a reply callback', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
    var scope, _ref17, body, headers, statusCode;

    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            scope = nock('http://example.test').get('/').delayConnection(100).reply(200, function () {
              return { a: 1 };
            });
            _context10.next = 3;
            return got('http://example.test');

          case 3:
            _ref17 = _context10.sent;
            body = _ref17.body;
            headers = _ref17.headers;
            statusCode = _ref17.statusCode;


            expect(body).to.equal('{"a":1}');
            expect(headers).to.have.property('content-type', 'application/json');
            expect(statusCode).to.equal(200);
            scope.done();

          case 11:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, undefined);
  })));

  it('should work with `replyWithFile()`', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
    var scope, _ref19, body;

    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            scope = nock('http://example.test').get('/').delayConnection(200).replyWithFile(200, textFilePath);
            _context11.next = 3;
            return resolvesInAtLeast(got('http://example.test'), 200);

          case 3:
            _ref19 = _context11.sent;
            body = _ref19.body;


            expect(body).to.equal(textFileContents);
            scope.done();

          case 7:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, undefined);
  })));

  it('should work with a generic stream from the reply callback', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
    var scope, _ref21, body;

    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            scope = nock('http://example.test').get('/').delayConnection(200).reply(200, function () {
              return fs.createReadStream(textFilePath);
            });
            _context12.next = 3;
            return resolvesInAtLeast(got('http://example.test'), 200);

          case 3:
            _ref21 = _context12.sent;
            body = _ref21.body;


            expect(body).to.equal(textFileContents);
            scope.done();

          case 7:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, undefined);
  })));

  it('should work with a generic stream from the reply callback', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
    var scope, _ref23, body, statusCode;

    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            scope = nock('http://example.test').get('/').delayConnection(200).reply(200, function () {
              return fs.createReadStream(textFilePath);
            });
            _context13.next = 3;
            return resolvesInAtLeast(got('http://example.test'), 200);

          case 3:
            _ref23 = _context13.sent;
            body = _ref23.body;
            statusCode = _ref23.statusCode;


            expect(statusCode).to.equal(200);
            expect(body).to.equal(textFileContents);
            scope.done();

          case 9:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, undefined);
  })));

  it('should delay errors when `replyWithError()` is used', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14() {
    return _regenerator2.default.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            nock('http://example.test').get('/').delayConnection(100).replyWithError('this is an error message');

            _context14.next = 3;
            return resolvesInAtLeast(assertRejects(got('http://example.test'), /this is an error message/), 100);

          case 3:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, undefined);
  })));

  it('emits a timeout - with setTimeout', function (done) {
    nock('http://example.test').get('/').delayConnection(10000).reply(200, 'OK');

    var onEnd = sinon.spy();

    var req = http.request('http://example.test', function (res) {
      res.once('end', onEnd);
    });

    req.setTimeout(5000, function () {
      expect(onEnd).not.to.have.been.called();
      done();
    });

    req.end();
  });

  it('emits a timeout - with options.timeout', function (done) {
    nock('http://example.test').get('/').delayConnection(10000).reply(200, 'OK');

    var onEnd = sinon.spy();

    var req = http.request('http://example.test', { timeout: 5000 }, function (res) {
      res.once('end', onEnd);
    });

    req.on('timeout', function () {
      expect(onEnd).not.to.have.been.called();
      done();
    });

    req.end();
  });

  it('does not emit a timeout when timeout > delayConnection', function (done) {
    var responseText = 'okeydoke!';
    var scope = nock('http://example.test').get('/').delayConnection(300).reply(200, responseText);

    var req = http.request('http://example.test', function (res) {
      res.setEncoding('utf8');

      var body = '';

      res.on('data', function (chunk) {
        body += chunk;
      });

      res.once('end', function () {
        expect(body).to.equal(responseText);
        scope.done();
        done();
      });
    });

    req.setTimeout(60000, function () {
      expect.fail('socket timed out unexpectedly');
    });

    req.end();
  });
});