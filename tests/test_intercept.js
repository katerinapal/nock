"use strict";

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _set = require("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

var _got_client = require("./got_client");

var _got_client2 = _interopRequireDefault(_got_client);

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _assertRejects = require("assert-rejects");

var _assertRejects2 = _interopRequireDefault(_assertRejects);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _https = require("https");

var _https2 = _interopRequireDefault(_https);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var http = _http2.default;
var https = _https2.default;
var expect = _chai2.default.expect;

var sinon = _sinon2.default;
var assertRejects = _assertRejects2.default;
var url = _url2.default;
var nock = _2.default;
var got = _got_client2.default;

var acceptableGlobalKeys = new _set2.default([].concat((0, _toConsumableArray3.default)((0, _keys2.default)(global)), ['_key', '__core-js_shared__', 'fetch', 'Response', 'Headers', 'Request']));

describe('Intercept', function () {
  it('invalid or missing method parameter throws an exception', function () {
    expect(function () {
      return nock('https://example.test').intercept('/somepath');
    }).to.throw('The "method" parameter is required for an intercept call.');
  });

  it("should throw when the path doesn't include a leading slash and there is no base path", function () {
    expect(function () {
      return nock('http://example.test').get('no-leading-slash');
    }).to.throw("Non-wildcard URL path strings must begin with a slash (otherwise they won't match anything)");
  });

  // https://github.com/nock/nock/issues/1730
  it('should throw when the path is empty and there is no base path', function () {
    expect(function () {
      return nock('http://example.test').get('');
    }).to.throw("Non-wildcard URL path strings must begin with a slash (otherwise they won't match anything) (got: )");
  });

  it('should intercept a basic GET request', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var scope, _ref2, statusCode;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            scope = nock('http://example.test').get('/').reply(201);
            _context.next = 3;
            return got('http://example.test/');

          case 3:
            _ref2 = _context.sent;
            statusCode = _ref2.statusCode;


            expect(statusCode).to.equal(201);
            scope.done();

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('should intercept a request with a base path', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var scope, _ref4, statusCode;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            scope = nock('http://example.test/abc').get('/def').reply(201);
            _context2.next = 3;
            return got('http://example.test/abc/def');

          case 3:
            _ref4 = _context2.sent;
            statusCode = _ref4.statusCode;


            expect(statusCode).to.equal(201);
            scope.done();

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it('should intercept a request with a base path and no interceptor path', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var scope, _ref6, statusCode;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            scope = nock('http://example.test/abc').get('').reply(201);
            _context3.next = 3;
            return got('http://example.test/abc');

          case 3:
            _ref6 = _context3.sent;
            statusCode = _ref6.statusCode;


            expect(statusCode).to.equal(201);
            scope.done();

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  it('should intercept a request with a base path and an interceptor path without a leading slash', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var scope, _ref8, statusCode;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            scope = nock('http://example.test/abc').get('def').reply(201);
            _context4.next = 3;
            return got('http://example.test/abcdef');

          case 3:
            _ref8 = _context4.sent;
            statusCode = _ref8.statusCode;


            expect(statusCode).to.equal(201);
            scope.done();

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));

  it('should intercept a basic POST request', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
    var scope, _ref10, statusCode, body;

    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            scope = nock('http://example.test').post('/form').reply(201, 'OK!');
            _context5.next = 3;
            return got.post('http://example.test/form', {
              responseType: 'buffer'
            });

          case 3:
            _ref10 = _context5.sent;
            statusCode = _ref10.statusCode;
            body = _ref10.body;


            expect(statusCode).to.equal(201);
            expect(body).to.be.an.instanceOf(Buffer);
            expect(body.toString('utf8')).to.equal('OK!');
            scope.done();

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  })));

  it('post with empty response body', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
    var scope, _ref12, statusCode, body;

    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            scope = nock('http://example.test').post('/form').reply();
            _context6.next = 3;
            return got.post('http://example.test/form', {
              responseType: 'buffer'
            });

          case 3:
            _ref12 = _context6.sent;
            statusCode = _ref12.statusCode;
            body = _ref12.body;


            expect(statusCode).to.equal(200);
            expect(body).to.be.an.instanceOf(Buffer);
            expect(body).to.have.lengthOf(0);
            scope.done();

          case 10:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  })));

  it('post, lowercase', function (done) {
    var onData = sinon.spy();

    var scope = nock('http://example.test').post('/form').reply(200, 'OK!');

    // Since this is testing a lowercase `method`, it's using the `http` module.
    var req = http.request({
      host: 'example.test',
      method: 'post',
      path: '/form',
      port: 80
    }, function (res) {
      expect(res.statusCode).to.equal(200);
      res.on('data', function (data) {
        onData();
        expect(data).to.be.an.instanceOf(Buffer);
        expect(data.toString()).to.equal('OK!');
      });
      res.on('end', function () {
        expect(onData).to.have.been.calledOnce();
        scope.done();
        done();
      });
    });

    req.end();
  });

  it('post with regexp as spec', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
    var input, scope, _ref14, body;

    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            input = 'key=val';
            scope = nock('http://example.test').post('/echo', /key=v.?l/g).reply(200, function (uri, body) {
              return ['OK', uri, body].join(' ');
            });
            _context7.next = 4;
            return got.post('http://example.test/echo', { body: input });

          case 4:
            _ref14 = _context7.sent;
            body = _ref14.body;


            expect(body).to.equal('OK /echo key=val');
            scope.done();

          case 8:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  })));

  it('post with function as spec', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
    var scope, _ref16, body;

    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            scope = nock('http://example.test').post('/echo', function (body) {
              return body === 'key=val';
            }).reply(200, function (uri, body) {
              return ['OK', uri, body].join(' ');
            });
            _context8.next = 3;
            return got.post('http://example.test/echo', {
              body: 'key=val'
            });

          case 3:
            _ref16 = _context8.sent;
            body = _ref16.body;


            expect(body).to.equal('OK /echo key=val');
            scope.done();

          case 7:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  })));

  it('post with chaining on call', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
    var input, scope, _ref18, body;

    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            input = 'key=val';
            scope = nock('http://example.test').post('/echo', input).reply(200, function (uri, body) {
              return ['OK', uri, body].join(' ');
            });
            _context9.next = 4;
            return got.post('http://example.test/echo', { body: input });

          case 4:
            _ref18 = _context9.sent;
            body = _ref18.body;


            expect(body).to.equal('OK /echo key=val');
            scope.done();

          case 8:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  })));

  it('should intercept a basic DELETE request', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
    var scope, _ref20, statusCode;

    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            scope = nock('https://example.test').delete('/').reply(204);
            _context10.next = 3;
            return got.delete('https://example.test');

          case 3:
            _ref20 = _context10.sent;
            statusCode = _ref20.statusCode;


            expect(statusCode).to.equal(204);
            scope.done();

          case 7:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, undefined);
  })));

  // Not sure what is the intent of this test.
  it('reply with callback and filtered path and body', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
    var scope, _ref22, body;

    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            scope = nock('http://example.test').filteringPath(/.*/, '*').filteringRequestBody(/.*/, '*').post('*', '*').reply(200, function (uri, body) {
              return ['OK', uri, body].join(' ');
            });
            _context11.next = 3;
            return got.post('http://example.test/original/path', {
              body: 'original=body'
            });

          case 3:
            _ref22 = _context11.sent;
            body = _ref22.body;


            expect(body).to.equal('OK /original/path original=body');
            scope.done();

          case 7:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, undefined);
  })));

  it('should intercept a basic HEAD request', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
    var scope, _ref24, statusCode;

    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            scope = nock('http://example.test').head('/').reply(201, 'OK!');
            _context12.next = 3;
            return got.head('http://example.test/');

          case 3:
            _ref24 = _context12.sent;
            statusCode = _ref24.statusCode;


            expect(statusCode).to.equal(201);
            scope.done();

          case 7:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, undefined);
  })));

  it('body data is differentiating', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
    var scope, response1, response2;
    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            scope = nock('http://example.test').post('/', 'abc').reply(200, 'Hey 1').post('/', 'def').reply(200, 'Hey 2');
            _context13.next = 3;
            return got.post('http://example.test/', { body: 'abc' });

          case 3:
            response1 = _context13.sent;

            expect(response1).to.include({ statusCode: 200, body: 'Hey 1' });

            _context13.next = 7;
            return got.post('http://example.test/', { body: 'def' });

          case 7:
            response2 = _context13.sent;

            expect(response2).to.include({ statusCode: 200, body: 'Hey 2' });

            scope.done();

          case 10:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, undefined);
  })));

  it('chaining', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14() {
    var scope, response1, response2;
    return _regenerator2.default.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            scope = nock('http://example.test').get('/').reply(200, 'Hello World!').post('/form').reply(201, 'OK!');
            _context14.next = 3;
            return got.post('http://example.test/form');

          case 3:
            response1 = _context14.sent;

            expect(response1).to.include({ statusCode: 201, body: 'OK!' });

            _context14.next = 7;
            return got('http://example.test/');

          case 7:
            response2 = _context14.sent;

            expect(response2).to.include({ statusCode: 200, body: 'Hello World!' });

            scope.done();

          case 10:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, undefined);
  })));

  it('encoding', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15() {
    var scope, _ref28, body;

    return _regenerator2.default.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            scope = nock('http://example.test').get('/').reply(200, 'Hello World!');
            _context15.next = 3;
            return got('http://example.test/', { encoding: 'base64' });

          case 3:
            _ref28 = _context15.sent;
            body = _ref28.body;


            expect(body).to.be.a('string').and.equal('SGVsbG8gV29ybGQh');

            scope.done();

          case 7:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, undefined);
  })));

  it('on interceptor, filter path with function', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16() {
    var scope, _ref30, statusCode;

    return _regenerator2.default.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            // Interceptor.filteringPath simply proxies to Scope.filteringPath, this test covers the proxy,
            // testing the logic of filteringPath itself is done in test_scope.js.
            scope = nock('http://example.test').get('/?a=2&b=1').filteringPath(function () {
              return '/?a=2&b=1';
            }).reply(200, 'Hello World!');
            _context16.next = 3;
            return got('http://example.test/', {
              searchParams: { a: '1', b: '2' }
            });

          case 3:
            _ref30 = _context16.sent;
            statusCode = _ref30.statusCode;


            expect(statusCode).to.equal(200);
            scope.done();

          case 7:
          case "end":
            return _context16.stop();
        }
      }
    }, _callee16, undefined);
  })));

  it('chaining API', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17() {
    var scope, response1, response2;
    return _regenerator2.default.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            scope = nock('http://example.test').get('/one').reply(200, 'first one').get('/two').reply(200, 'second one');
            _context17.next = 3;
            return got('http://example.test/one');

          case 3:
            response1 = _context17.sent;

            expect(response1).to.include({ statusCode: 200, body: 'first one' });

            _context17.next = 7;
            return got('http://example.test/two');

          case 7:
            response2 = _context17.sent;

            expect(response2).to.include({ statusCode: 200, body: 'second one' });

            scope.done();

          case 10:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17, undefined);
  })));

  it('same URI', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18() {
    var scope, response1, response2;
    return _regenerator2.default.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            scope = nock('http://example.test').get('/abc').reply(200, 'first one').get('/abc').reply(201, 'second one');
            _context18.next = 3;
            return got('http://example.test/abc');

          case 3:
            response1 = _context18.sent;

            expect(response1).to.include({ statusCode: 200, body: 'first one' });

            _context18.next = 7;
            return got('http://example.test/abc');

          case 7:
            response2 = _context18.sent;

            expect(response2).to.include({ statusCode: 201, body: 'second one' });

            scope.done();

          case 10:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18, undefined);
  })));

  // TODO Should this test be kept?
  it('can use hostname instead of host', function (done) {
    var scope = nock('http://example.test').get('/').reply(200, 'Hello World!');

    var req = http.request({
      hostname: 'example.test',
      path: '/'
    }, function (res) {
      expect(res.statusCode).to.equal(200);
      res.on('end', function () {
        scope.done();
        done();
      });
      // Streams start in 'paused' mode and must be started.
      // See https://nodejs.org/api/stream.html#stream_class_stream_readable
      res.resume();
    });

    req.end();
  });

  it('hostname is case insensitive', function (done) {
    var scope = nock('http://example.test').get('/path').reply();

    var req = http.request({
      hostname: 'EXAMPLE.test',
      path: '/path',
      method: 'GET'
    }, function () {
      scope.done();
      done();
    });
    req.end();
  });

  it('can take a port', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19() {
    var scope, _ref34, statusCode;

    return _regenerator2.default.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            scope = nock('http://example.test:3333').get('/').reply();
            _context19.next = 3;
            return got('http://example.test:3333/');

          case 3:
            _ref34 = _context19.sent;
            statusCode = _ref34.statusCode;


            expect(statusCode).to.equal(200);
            scope.done();

          case 7:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19, undefined);
  })));

  it('can use https', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20() {
    var scope, _ref36, statusCode;

    return _regenerator2.default.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            scope = nock('https://example.test').get('/').reply();
            _context20.next = 3;
            return got('https://example.test/', {
              responseType: 'buffer'
            });

          case 3:
            _ref36 = _context20.sent;
            statusCode = _ref36.statusCode;


            expect(statusCode).to.equal(200);
            scope.done();

          case 7:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20, undefined);
  })));

  it('emits error when listeners are added after `req.end()` call', function (done) {
    nock('http://example.test').get('/').reply();

    var req = http.request({
      host: 'example.test',
      path: '/wrong-path'
    }, function (res) {
      expect.fail(new Error('should not come here!'));
    });

    req.end();

    req.on('error', function (err) {
      expect(err.message.trim()).to.equal("Nock: No match for request " + (0, _stringify2.default)({
        method: 'GET',
        url: 'http://example.test/wrong-path',
        headers: {}
      }, null, 2));
      done();
    });
  });

  it('emits error if https route is missing', function (done) {
    nock('https://example.test').get('/').reply(200, 'Hello World!');

    var req = https.request({
      host: 'example.test',
      path: '/abcdef892932'
    }, function (res) {
      expect.fail(new Error('should not come here!'));
    });
    req.on('error', function (err) {
      expect(err.message.trim()).to.equal("Nock: No match for request " + (0, _stringify2.default)({
        method: 'GET',
        url: 'https://example.test/abcdef892932',
        headers: {}
      }, null, 2));
      done();
    });
    req.end();
  });

  it('emits error if https route is missing, non-standard port', function (done) {
    nock('https://example.test:123').get('/').reply(200, 'Hello World!');

    var req = https.request({
      host: 'example.test',
      port: 123,
      path: '/dsadsads'
    }, function (res) {
      expect.fail(new Error('should not come here!'));
    });

    req.on('error', function (err) {
      expect(err.message.trim()).to.equal("Nock: No match for request " + (0, _stringify2.default)({
        method: 'GET',
        url: 'https://example.test:123/dsadsads',
        headers: {}
      }, null, 2));
      done();
    });
    req.end();
  });

  it('scopes are independent', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21() {
    var scope1, scope2;
    return _regenerator2.default.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            scope1 = nock('http://example.test').get('/').reply(200, 'Hello World!');
            scope2 = nock('http://example.test').get('/').reply(200, 'Hello World!');
            _context21.next = 4;
            return got('http://example.test/');

          case 4:

            expect(scope1.isDone()).to.be.true();
            expect(scope2.isDone()).to.be.false();

          case 6:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21, undefined);
  })));

  it('two scopes with the same request are consumed', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee22() {
    var scope1, scope2;
    return _regenerator2.default.wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            scope1 = nock('http://example.test').get('/').reply(200, 'Hello World!');
            scope2 = nock('http://example.test').get('/').reply(200, 'Hello World!');
            _context22.next = 4;
            return got('http://example.test/');

          case 4:
            _context22.next = 6;
            return got('http://example.test/');

          case 6:

            scope1.done();
            scope2.done();

          case 8:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22, undefined);
  })));

  // TODO: Move this test to test_header_matching.
  it('username and password works', function (done) {
    var scope = nock('http://example.test').get('/').reply(200, 'Welcome, username');

    http.request({
      hostname: 'example.test',
      auth: 'username:password',
      path: '/'
    }, function (res) {
      scope.done();
      done();
    }).end();
  });

  it('Matches with a username and password in the URL', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee23() {
    var scope, _ref40, statusCode;

    return _regenerator2.default.wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            scope = nock('http://example.test').get('/abc').reply(function () {
              // TODO Investigate why we don't get an authorization header.
              // expect(this.req.headers).to.include({ Authorization: 'foobar' })
              return [200];
            });
            _context23.next = 3;
            return got('http://username:password@example.test/abc');

          case 3:
            _ref40 = _context23.sent;
            statusCode = _ref40.statusCode;

            expect(statusCode).to.equal(200);

            scope.done();

          case 7:
          case "end":
            return _context23.stop();
        }
      }
    }, _callee23, undefined);
  })));

  it('different port works', function (done) {
    var scope = nock('http://example.test:8081').get('/').reply();

    http.request({
      hostname: 'example.test',
      port: 8081,
      path: '/'
    }, function (res) {
      scope.done();
      done();
    }).end();
  });

  it('explicitly specifiying port 80 works', function (done) {
    var scope = nock('http://example.test:80').get('/').reply();

    http.request({
      hostname: 'example.test',
      port: 80,
      path: '/'
    }, function (res) {
      scope.done();
      done();
    }).end();
  });

  it('post with object', function (done) {
    var scope = nock('http://example.test').post('/claim', { some_data: 'something' }).reply();

    http.request({
      hostname: 'example.test',
      port: 80,
      method: 'POST',
      path: '/claim'
    }, function (res) {
      scope.done();
      done();
    }).end('{"some_data":"something"}');
  });

  it('accept string as request target', function (done) {
    var responseBody = 'Hello World!';
    var onData = sinon.spy();
    var scope = nock('http://example.test').get('/').reply(200, responseBody);

    http.get('http://example.test', function (res) {
      expect(res.statusCode).to.equal(200);

      res.on('data', function (data) {
        onData();
        expect(data).to.be.an.instanceOf(Buffer);
        expect(data.toString()).to.equal(responseBody);
      });

      res.on('end', function () {
        expect(onData).to.have.been.calledOnce();
        scope.done();
        done();
      });
    });
  });

  it('sending binary and receiving JSON should work', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee24() {
    var scope, _ref42, statusCode, body;

    return _regenerator2.default.wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            scope = nock('http://example.test').post('/').reply(201, { foo: '61' }, { 'Content-Type': 'application/json' });
            _context24.next = 3;
            return got.post('http://example.test/', {
              // This is an encoded JPEG.
              body: Buffer.from('ffd8ffe000104a46494600010101006000600000ff', 'hex'),
              headers: { Accept: 'application/json', 'Content-Length': 23861 }
            });

          case 3:
            _ref42 = _context24.sent;
            statusCode = _ref42.statusCode;
            body = _ref42.body;

            expect(statusCode).to.equal(201);
            expect(body).to.be.a('string').and.have.lengthOf(12);
            expect(JSON.parse(body)).to.deep.equal({ foo: '61' });
            scope.done();

          case 10:
          case "end":
            return _context24.stop();
        }
      }
    }, _callee24, undefined);
  })));

  it('do not match when conditionally = false but should match after trying again when = true', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee25() {
    var enabled, scope, _ref44, statusCode;

    return _regenerator2.default.wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            enabled = false;
            scope = nock('http://example.test', { conditionally: function conditionally() {
                return enabled;
              } }).get('/').reply(200);
            _context25.next = 4;
            return assertRejects(got('http://example.test/'), /Nock: No match for request/);

          case 4:
            expect(scope.isDone()).to.be.false();

            enabled = true;

            _context25.next = 8;
            return got('http://example.test/');

          case 8:
            _ref44 = _context25.sent;
            statusCode = _ref44.statusCode;


            expect(statusCode).to.equal(200);
            scope.done();

          case 12:
          case "end":
            return _context25.stop();
        }
      }
    }, _callee25, undefined);
  })));

  // TODO: Try to convert to async/got.
  it('get correct filtering with scope and request headers filtering', function (done) {
    var responseText = 'OK!';
    var requestHeaders = { host: 'foo.example.test' };

    var scope = nock('http://foo.example.test', {
      filteringScope: function filteringScope(scope) {
        return (/^http:\/\/.*\.example\.test/.test(scope)
        );
      }
    }).get('/path').reply(200, responseText, { 'Content-Type': 'text/plain' });

    var onData = sinon.spy();
    var req = http.get('http://bar.example.test/path', function (res) {
      expect(req.getHeaders()).to.deep.equal({ host: requestHeaders.host });

      res.on('data', function (data) {
        onData();
        expect(data.toString()).to.equal(responseText);
      });
      res.on('end', function () {
        expect(onData).to.have.been.calledOnce();
        scope.done();
        done();
      });
    });
  });

  it('different subdomain with reply callback and filtering scope', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee26() {
    var responseText, scope, _ref46, body;

    return _regenerator2.default.wrap(function _callee26$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            responseText = 'OK!';
            // We scope for www.example.test but through scope filtering we will accept
            // any <subdomain>.example.test.

            scope = nock('http://example.test', {
              filteringScope: function filteringScope(scope) {
                return (/^http:\/\/.*\.example/.test(scope)
                );
              }
            }).get('/').reply(200, function () {
              return responseText;
            });
            _context26.next = 4;
            return got('http://a.example.test');

          case 4:
            _ref46 = _context26.sent;
            body = _ref46.body;

            expect(body).to.equal(responseText);
            scope.done();

          case 8:
          case "end":
            return _context26.stop();
        }
      }
    }, _callee26, undefined);
  })));

  it('succeeds even when host request header is not specified', function (done) {
    var scope = nock('http://example.test').post('/resource').reply();

    var opts = {
      method: 'POST',
      headers: {
        'X-App-TOKEN': 'apptoken',
        'X-Auth-TOKEN': 'apptoken'
      }
    };

    var req = http.request('http://example.test/resource', opts, function (res) {
      res.on('end', function () {
        scope.done();
        done();
      });
      res.resume();
    });

    req.end();
  });

  // https://github.com/nock/nock/issues/158
  // mikeal/request with strictSSL: true
  // https://github.com/request/request/blob/3c0cddc7c8eb60b470e9519da85896ed7ee0081e/request.js#L943-L950
  it('should denote the response client is authorized for HTTPS requests', function (done) {
    var scope = nock('https://example.test').get('/what').reply();

    https.get('https://example.test/what', function (res) {
      expect(res).to.have.nested.property('socket.authorized').that.is.true();

      res.on('end', function () {
        scope.done();
        done();
      });
      res.resume();
    });
  });

  it('match domain using regexp', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee27() {
    var scope, _ref48, statusCode;

    return _regenerator2.default.wrap(function _callee27$(_context27) {
      while (1) {
        switch (_context27.prev = _context27.next) {
          case 0:
            scope = nock(/regexexample\.test/).get('/resources').reply();
            _context27.next = 3;
            return got('http://regexexample.test/resources');

          case 3:
            _ref48 = _context27.sent;
            statusCode = _ref48.statusCode;

            expect(statusCode).to.equal(200);
            scope.done();

          case 7:
          case "end":
            return _context27.stop();
        }
      }
    }, _callee27, undefined);
  })));

  // https://github.com/nock/nock/issues/1137
  it('match domain using regexp with path as callback', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee28() {
    var scope, _ref50, statusCode;

    return _regenerator2.default.wrap(function _callee28$(_context28) {
      while (1) {
        switch (_context28.prev = _context28.next) {
          case 0:
            scope = nock(/.*/).get(function () {
              return true;
            }).reply(200, 'Match regex');
            _context28.next = 3;
            return got('http://example.test/resources');

          case 3:
            _ref50 = _context28.sent;
            statusCode = _ref50.statusCode;

            expect(statusCode).to.equal(200);
            scope.done();

          case 7:
          case "end":
            return _context28.stop();
        }
      }
    }, _callee28, undefined);
  })));

  // https://github.com/nock/nock/issues/508
  it('match multiple interceptors with regexp domain', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee29() {
    var response1, response2;
    return _regenerator2.default.wrap(function _callee29$(_context29) {
      while (1) {
        switch (_context29.prev = _context29.next) {
          case 0:
            nock(/chainregex/).get('/').reply(200, 'Match regex').get('/').reply(500, 'Match second intercept');

            _context29.next = 3;
            return got('http://chainregex.test/');

          case 3:
            response1 = _context29.sent;

            expect(response1).to.include({ statusCode: 200, body: 'Match regex' });

            _context29.next = 7;
            return got('http://chainregex.test/', {
              throwHttpErrors: false
            });

          case 7:
            response2 = _context29.sent;

            expect(response2).to.include({
              statusCode: 500,
              body: 'Match second intercept'
            });

          case 9:
          case "end":
            return _context29.stop();
        }
      }
    }, _callee29, undefined);
  })));

  it('interceptors should work in any order', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee30() {
    var response2, response1;
    return _regenerator2.default.wrap(function _callee30$(_context30) {
      while (1) {
        switch (_context30.prev = _context30.next) {
          case 0:
            nock('http://some.test').get('/path1?query=1').reply(200, 'response for path1/query1').get('/path2?query=2').reply(200, 'response for path2/query2');

            // Calling second request before first
            _context30.next = 3;
            return got('http://some.test/path2?query=2');

          case 3:
            response2 = _context30.sent;

            expect(response2).to.include({
              statusCode: 200,
              body: 'response for path2/query2'
            });

            // Calling first request after second
            _context30.next = 7;
            return got('http://some.test/path1?query=1');

          case 7:
            response1 = _context30.sent;

            expect(response1).to.include({
              statusCode: 200,
              body: 'response for path1/query1'
            });

          case 9:
          case "end":
            return _context30.stop();
        }
      }
    }, _callee30, undefined);
  })));

  it('interceptors should work in any order with filteringScope', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee31() {
    var response2, response1;
    return _regenerator2.default.wrap(function _callee31$(_context31) {
      while (1) {
        switch (_context31.prev = _context31.next) {
          case 0:
            nock('http://some.test', {
              filteringScope: function filteringScope(scope) {
                return true;
              }
            }).get('/path1?query=1').reply(200, 'response for path1/query1').get('/path2?query=2').reply(200, 'response for path2/query2');

            // Calling second request before first
            _context31.next = 3;
            return got('http://other.test/path2?query=2');

          case 3:
            response2 = _context31.sent;

            expect(response2).to.include({
              statusCode: 200,
              body: 'response for path2/query2'
            });

            // Calling first request after second
            _context31.next = 7;
            return got('http://other.test/path1?query=1');

          case 7:
            response1 = _context31.sent;

            expect(response1).to.include({
              statusCode: 200,
              body: 'response for path1/query1'
            });

          case 9:
          case "end":
            return _context31.stop();
        }
      }
    }, _callee31, undefined);
  })));

  // FIXME: This marked as `skip` because it is an existing bug.
  // https://github.com/nock/nock/issues/1108
  it.skip('match hostname as regex and string in tandem', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee32() {
    var scope1, scope2, response1, response2;
    return _regenerator2.default.wrap(function _callee32$(_context32) {
      while (1) {
        switch (_context32.prev = _context32.next) {
          case 0:
            scope1 = nock(/.*/).get('/hello/world').reply();
            scope2 = nock('http://example.test').get('/hello/planet').reply();
            _context32.next = 4;
            return got('http://example.test/hello/world');

          case 4:
            response1 = _context32.sent;

            expect(response1.statusCode).to.equal(200);
            scope1.done();

            _context32.next = 9;
            return got('http://example.test/hello/planet');

          case 9:
            response2 = _context32.sent;

            expect(response2.statusCode).to.equal(200);
            scope2.done();

          case 12:
          case "end":
            return _context32.stop();
        }
      }
    }, _callee32, undefined);
  })));

  it('match domain using intercept callback', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee33() {
    var validUrl, response1, response2;
    return _regenerator2.default.wrap(function _callee33$(_context33) {
      while (1) {
        switch (_context33.prev = _context33.next) {
          case 0:
            validUrl = ['/cats', '/dogs'];


            nock('http://example.test').get(function (uri) {
              return validUrl.indexOf(uri) >= 0;
            }).reply(200, 'Match intercept').get('/cats').reply(200, 'Match intercept 2');

            _context33.next = 4;
            return got('http://example.test/cats');

          case 4:
            response1 = _context33.sent;

            expect(response1).to.include({ statusCode: 200, body: 'Match intercept' });

            _context33.next = 8;
            return got('http://example.test/cats');

          case 8:
            response2 = _context33.sent;

            expect(response2).to.include({ statusCode: 200, body: 'Match intercept 2' });

          case 10:
          case "end":
            return _context33.stop();
        }
      }
    }, _callee33, undefined);
  })));

  it('match path using regexp', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee34() {
    var _ref57, statusCode, body;

    return _regenerator2.default.wrap(function _callee34$(_context34) {
      while (1) {
        switch (_context34.prev = _context34.next) {
          case 0:
            nock('http://example.test').get(/regex$/).reply(200, 'Match regex');

            _context34.next = 3;
            return got('http://example.test/resources/regex');

          case 3:
            _ref57 = _context34.sent;
            statusCode = _ref57.statusCode;
            body = _ref57.body;

            expect(statusCode).to.equal(200);
            expect(body).to.equal('Match regex');

          case 8:
          case "end":
            return _context34.stop();
        }
      }
    }, _callee34, undefined);
  })));

  // https://github.com/nock/nock/issues/2134
  it('match path using regexp with global flag', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee35() {
    var _ref59, statusCode, body;

    return _regenerator2.default.wrap(function _callee35$(_context35) {
      while (1) {
        switch (_context35.prev = _context35.next) {
          case 0:
            nock('http://example.test').get(/foo/g).reply(200, 'Match regex');

            _context35.next = 3;
            return got('http://example.test/foo/bar');

          case 3:
            _ref59 = _context35.sent;
            statusCode = _ref59.statusCode;
            body = _ref59.body;

            expect(statusCode).to.equal(200);
            expect(body).to.equal('Match regex');

          case 8:
          case "end":
            return _context35.stop();
        }
      }
    }, _callee35, undefined);
  })));

  it('match path using function', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee36() {
    var path, urlFunction, postResponse, getResponse;
    return _regenerator2.default.wrap(function _callee36$(_context36) {
      while (1) {
        switch (_context36.prev = _context36.next) {
          case 0:
            path = '/match/uri/function';

            urlFunction = function urlFunction(uri) {
              return uri === path;
            };

            nock("http://example.test").delete(urlFunction).reply(200, 'Match DELETE').get(urlFunction).reply(200, 'Match GET').head(urlFunction).reply(200, 'Match HEAD').merge(urlFunction).reply(200, 'Match MERGE').options(urlFunction).reply(200, 'Match OPTIONS').patch(urlFunction).reply(200, 'Match PATCH').post(urlFunction).reply(200, 'Match POST').put(urlFunction).reply(200, 'Match PUT');

            _context36.next = 5;
            return got.post('http://example.test/match/uri/function');

          case 5:
            postResponse = _context36.sent;

            expect(postResponse).to.include({ statusCode: 200, body: "Match POST" });

            _context36.next = 9;
            return got('http://example.test/match/uri/function');

          case 9:
            getResponse = _context36.sent;

            expect(getResponse).to.include({ statusCode: 200, body: "Match GET" });

            _context36.next = 13;
            return assertRejects(got.head('http://example.test/do/not/match'), /Nock: No match for request/);

          case 13:
          case "end":
            return _context36.stop();
        }
      }
    }, _callee36, undefined);
  })));

  it('you must setup an interceptor for each request', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee37() {
    var _ref62, statusCode, body;

    return _regenerator2.default.wrap(function _callee37$(_context37) {
      while (1) {
        switch (_context37.prev = _context37.next) {
          case 0:
            nock('http://example.test').get('/hey').reply(200, 'First match');

            _context37.next = 3;
            return got('http://example.test/hey');

          case 3:
            _ref62 = _context37.sent;
            statusCode = _ref62.statusCode;
            body = _ref62.body;

            expect(statusCode).to.equal(200);
            expect(body).to.equal('First match');

            _context37.next = 10;
            return assertRejects(got('http://example.test/hey'), /Nock: No match for request/);

          case 10:
          case "end":
            return _context37.stop();
        }
      }
    }, _callee37, undefined);
  })));

  // TODO: What is the intention of this test?
  it('no content type provided', function (done) {
    var scope = nock('http://example.test').replyContentLength().post('/httppost', function () {
      return true;
    }).reply(401, '');

    http.request({
      host: 'example.test',
      path: '/httppost',
      method: 'POST',
      headers: {}
    }, function (res) {
      res.on('data', function () {});
      res.once('end', function () {
        scope.done();
        done();
      });
    }).end('WHAA');
  });

  // https://github.com/nock/nock/issues/835
  it('match domain and path using regexp', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee38() {
    var responseBody, scope, _ref64, statusCode, body;

    return _regenerator2.default.wrap(function _callee38$(_context38) {
      while (1) {
        switch (_context38.prev = _context38.next) {
          case 0:
            responseBody = 'this is the response';
            scope = nock(/example/).get(/img/).reply(200, responseBody);
            _context38.next = 4;
            return got('http://example.test/imghp?hl=en');

          case 4:
            _ref64 = _context38.sent;
            statusCode = _ref64.statusCode;
            body = _ref64.body;

            expect(statusCode).to.equal(200);
            expect(body).to.equal(responseBody);
            scope.done();

          case 10:
          case "end":
            return _context38.stop();
        }
      }
    }, _callee38, undefined);
  })));

  // https://github.com/nock/nock/issues/1003
  it('correctly parse request without specified path', function (done) {
    var scope1 = nock('https://example.test').get('/').reply(200);

    https.request({ hostname: 'example.test' }, function (res) {
      expect(res.statusCode).to.equal(200);
      res.on('data', function () {});
      res.on('end', function () {
        scope1.done();
        done();
      });
    }).end();
  });

  it('data is sent with flushHeaders', function (done) {
    var scope1 = nock('https://example.test').get('/').reply(200, 'this is data');

    var onData = sinon.spy();
    https.request({ hostname: 'example.test' }, function (res) {
      expect(res.statusCode).to.equal(200);
      res.on('data', function (data) {
        onData();
        expect(data.toString()).to.equal('this is data');
      });
      res.on('end', function () {
        expect(onData).to.have.been.calledOnce();
        scope1.done();
        done();
      });
    }).flushHeaders();
  });

  it('wildcard param URL should not throw error', function (done) {
    expect(function () {
      return nock('http://example.test').get('*');
    }).not.to.throw();
    done();
  });

  it('with filteringScope, URL path without leading slash does not throw error', function (done) {
    expect(function () {
      return nock('http://example.test', { filteringScope: function filteringScope() {} }).get('');
    }).not.to.throw();
    done();
  });

  it('no new keys were added to the global namespace', function (done) {
    var leaks = (0, _keys2.default)(global).filter(function (key) {
      return !acceptableGlobalKeys.has(key);
    });
    expect(leaks).to.deep.equal([]);
    done();
  });

  // These tests use `http` directly because `got` never calls `http` with the
  // three arg form.
  it('first arg as URL instance', function (done) {
    var scope = nock('http://example.test').get('/').reply();

    http.get(new url.URL('http://example.test'), function () {
      scope.done();
      done();
    });
  });

  it('three argument form of http.request: URL, options, and callback', function (done) {
    var responseText = 'this is data';
    var scope = nock('http://example.test').get('/hello').reply(201, responseText);

    http.get(new url.URL('http://example.test'), { path: '/hello' }, function (res) {
      expect(res.statusCode).to.equal(201);
      var onData = sinon.spy();
      res.on('data', function (chunk) {
        expect(chunk.toString()).to.equal(responseText);
        onData();
      });
      res.on('end', function () {
        // TODO Investigate why this doesn't work.
        // expect(onData).to.have.been.calledOnceWithExactly(responseText)
        expect(onData).to.have.been.calledOnce();
        scope.done();
        done();
      });
    });
  });

  /*
   * This test imitates a feature of node-http-proxy (https://github.com/nodejitsu/node-http-proxy) -
   * modifying headers for an in-flight request by modifying them.
   * https://github.com/nock/nock/pull/1484
   */
  it('works when headers are removed on the socket event', function (done) {
    // Set up a nock that will fail if it gets an "authorization" header.
    var scope = nock('http://example.test', { badheaders: ['authorization'] }).get('/endpoint').reply();

    // Create a server to act as our reverse proxy.
    var server = http.createServer(function (request, response) {
      // Make a request to the nock instance with the same request that came in.
      var proxyReq = http.request({
        host: 'example.test',
        // Get the path from the incoming request and pass it through.
        path: "/" + request.url.split('/').slice(1).join('/'),
        headers: request.headers
      });

      // When we connect, remove the authorization header (node-http-proxy uses
      // this event to do it).
      proxyReq.on('socket', function () {
        proxyReq.removeHeader('authorization');

        // End the request here, otherwise it ends up matching the request before
        // socket gets called because socket runs on `process.nextTick()`.
        proxyReq.end();
      });

      proxyReq.on('response', function (proxyRes) {
        proxyRes.pipe(response);
      });

      proxyReq.on('error', function (error) {
        expect.fail(error);
        done();
      });
    });

    server.listen(function () {
      // Now that the server's started up, make a request to it with an authorization header.
      var req = http.request({
        hostname: 'localhost',
        path: '/endpoint',
        port: server.address().port,
        method: 'GET',
        headers: { authorization: 'blah' }
      }, function (res) {
        // If we get a request, all good :)
        expect(res.statusCode).to.equal(200);
        scope.done();
        server.close(done);
      });

      req.on('error', function (error) {
        expect.fail(error);
        done();
      });

      req.end();
    }).on('error', function (error) {
      expect.fail(error);
      done();
    });
  });
});