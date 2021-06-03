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

var _assertRejects = require("assert-rejects");

var _assertRejects2 = _interopRequireDefault(_assertRejects);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

// `persist()` and `optionally()` are closely related. Their tests are both
// contained in this file.

var http = _http2.default;
var path = _path2.default;
var assertRejects = _assertRejects2.default;
var expect = _chai2.default.expect;

var nock = _2.default;
var got = _got_client2.default;

var textFilePath = path.resolve(__dirname, './assets/reply_file_1.txt');

describe('`optionally()`', function () {
  it('optional mocks do not appear in `pendingMocks()`', function () {
    nock('http://example.test').get('/nonexistent').optionally().reply(200);

    expect(nock.pendingMocks()).to.be.empty();
  });

  it('when called with `true`, makes the mock optional', function () {
    nock('http://example.test').get('/nonexistent').optionally(true).reply(200);

    expect(nock.pendingMocks()).to.be.empty();
  });

  it('when called with `false`, the mock is still required', function () {
    nock('http://example.test').get('/nonexistent').optionally(false).reply(200);

    expect(nock.pendingMocks()).to.have.lengthOf(1);
  });

  it('when called with non-boolean, throws the expected error', function () {
    var interceptor = nock('http://example.test').get('/');

    expect(function () {
      return interceptor.optionally('foo');
    }).to.throw(Error, 'Invalid arguments: argument should be a boolean');
  });

  it('optional mocks can be matched', function (done) {
    nock('http://example.test').get('/abc').optionally().reply(200);

    http.get({ host: 'example.test', path: '/abc' }, function (res) {
      expect(res.statusCode).to.equal(200);
      expect(nock.pendingMocks()).to.be.empty();
      done();
    });
  });

  it('before matching, `isDone()` is true', function () {
    var scope = nock('http://example.test').get('/abc').optionally().reply(200);

    expect(scope.isDone()).to.be.true();
  });

  describe('in conjunction with `persist()`', function () {
    it('when optional mocks are also persisted, they do not appear as pending', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var scope, response1, response2;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              scope = nock('http://example.test').get('/').optionally().reply(200).persist();


              expect(nock.pendingMocks()).to.be.empty();

              _context.next = 4;
              return got('http://example.test/');

            case 4:
              response1 = _context.sent;

              expect(response1.statusCode).to.equal(200);

              expect(nock.pendingMocks()).to.be.empty();

              _context.next = 9;
              return got('http://example.test/');

            case 9:
              response2 = _context.sent;

              expect(response2.statusCode).to.equal(200);
              expect(nock.pendingMocks()).to.be.empty();

              scope.done();

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined);
    })));
  });

  it('optional repeated mocks execute repeatedly', function (done) {
    nock('http://example.test').get('/456').optionally().times(2).reply(200);

    http.get({ host: 'example.test', path: '/456' }, function (res) {
      expect(res.statusCode).to.equal(200);
      http.get({ host: 'example.test', path: '/456' }, function (res) {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });
  });

  it("optional mocks appear in `activeMocks()` only until they're matched", function (done) {
    nock('http://example.test').get('/optional').optionally().reply(200);

    expect(nock.activeMocks()).to.deep.equal(['GET http://example.test:80/optional']);
    http.get({ host: 'example.test', path: '/optional' }, function (res) {
      expect(nock.activeMocks()).to.be.empty();
      done();
    });
  });
});

describe('`persist()`', function () {
  it('`activeMocks()` always returns persisted mocks, even after matching', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var scope;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            scope = nock('http://example.test').get('/persisted').reply(200).persist();


            expect(nock.activeMocks()).to.deep.equal(['GET http://example.test:80/persisted']);

            _context2.next = 4;
            return got('http://example.test/persisted');

          case 4:

            expect(nock.activeMocks()).to.deep.equal(['GET http://example.test:80/persisted']);

            scope.done();

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it('persisted mocks match repeatedly', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var scope;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            scope = nock('http://example.test').persist().get('/').reply(200, 'Persisting all the way');


            expect(scope.isDone()).to.be.false();

            _context3.next = 4;
            return got('http://example.test/');

          case 4:

            expect(scope.isDone()).to.be.true();

            _context3.next = 7;
            return got('http://example.test/');

          case 7:

            expect(scope.isDone()).to.be.true();

          case 8:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  it('persisted mocks appear in `pendingMocks()`', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var scope;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            scope = nock('http://example.test').get('/abc').reply(200, 'Persisted reply').persist();


            expect(scope.pendingMocks()).to.deep.equal(['GET http://example.test:80/abc']);

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  })));

  it('persisted mocks are removed from `pendingMocks()` once they are matched once', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
    var scope;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            scope = nock('http://example.test').get('/def').reply(200, 'Persisted reply').persist();
            _context5.next = 3;
            return got('http://example.test/def');

          case 3:

            expect(scope.pendingMocks()).to.deep.equal([]);

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  })));

  it('persisted mocks can use `replyWithFile()`', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
    var i, _ref7, statusCode, body;

    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            nock('http://example.test').persist().get('/').replyWithFile(200, textFilePath).get('/test').reply(200, 'Yay!');

            i = 0;

          case 2:
            if (!(i < 2)) {
              _context6.next = 13;
              break;
            }

            _context6.next = 5;
            return got('http://example.test/');

          case 5:
            _ref7 = _context6.sent;
            statusCode = _ref7.statusCode;
            body = _ref7.body;

            expect(statusCode).to.equal(200);
            expect(body).to.equal('Hello from the file!');

          case 10:
            ++i;
            _context6.next = 2;
            break;

          case 13:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  })));

  it('can call `persist(false)` to stop persisting', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
    var scope;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            scope = nock('http://example.test').persist(true).get('/').reply(200, 'Persisting all the way');


            expect(scope.isDone()).to.be.false();

            _context7.next = 4;
            return got('http://example.test/');

          case 4:

            expect(scope.isDone()).to.be.true();
            expect(nock.activeMocks()).to.deep.equal(['GET http://example.test:80/']);

            scope.persist(false);

            _context7.next = 9;
            return got('http://example.test/');

          case 9:

            expect(nock.activeMocks()).to.be.empty();
            expect(scope.isDone()).to.be.true();

            _context7.next = 13;
            return assertRejects(got('http://example.test/'), /Nock: No match for request/);

          case 13:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  })));

  it('when called with an invalid argument, throws the expected error', function () {
    expect(function () {
      return nock('http://example.test').persist('string');
    }).to.throw(Error, 'Invalid arguments: argument should be a boolean');
  });
});