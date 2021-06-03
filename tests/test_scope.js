"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _scope = require("../lib/scope");

var _scope2 = _interopRequireDefault(_scope);

var _got_client = require("./got_client");

var _got_client2 = _interopRequireDefault(_got_client);

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _interceptor = require("../lib/interceptor");

var _interceptor2 = _interopRequireDefault(_interceptor);

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _proxyquire = require("proxyquire");

var _proxyquire2 = _interopRequireDefault(_proxyquire);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var path = _path2.default;
var expect = _chai2.default.expect;

var sinon = _sinon2.default;
var proxyquire = _proxyquire2.default.preserveCache();
var url = _url2.default;
var Interceptor = _interceptor2.default;
var nock = _2.default;
var got = _got_client2.default;

it('scope exposes interceptors', function () {
  var scopes = nock.load(path.join(__dirname, 'fixtures', 'good_request.json'));

  expect(scopes).to.be.an.instanceOf(Array);
  expect(scopes).to.have.lengthOf.at.least(1);

  scopes.forEach(function (scope) {
    scope.interceptors.forEach(function (interceptor) {
      expect(interceptor).to.be.an.instanceOf(Interceptor);
      interceptor.delayConnection(100);
    });
  });
});

describe('`Scope#constructor`', function () {
  it('accepts the output of url.parse', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var scope, _ref2, statusCode;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            scope = nock(url.parse('http://example.test')).get('/').reply();
            _context.next = 3;
            return got('http://example.test');

          case 3:
            _ref2 = _context.sent;
            statusCode = _ref2.statusCode;

            expect(statusCode).to.equal(200);
            scope.done();

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it.skip('accepts a WHATWG URL instance', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var scope, _ref4, statusCode;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            scope = nock(new url.URL('http://example.test')).get('/').reply();
            _context2.next = 3;
            return got('http://example.test');

          case 3:
            _ref4 = _context2.sent;
            statusCode = _ref4.statusCode;

            expect(statusCode).to.equal(200);
            scope.done();

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it('fails when provided a WHATWG URL instance', function () {
    // This test just proves the lack of current support. When this feature is added,
    // this test should be removed and the test above un-skipped.
    expect(function () {
      return nock(new url.URL('http://example.test'));
    }).to.throw();
  });
});

describe('`Scope#remove()`', function () {
  it('removes an active mock', function () {
    var scope = nock('http://example.test').get('/').reply(200);
    var key = 'GET http://example.test:80/';

    // Confidence check.
    expect(scope.activeMocks()).to.deep.equal([key]);

    // Act.
    scope.remove(key, scope.interceptors[0]);

    // Assert.
    expect(scope.activeMocks()).to.deep.equal([]);
  });

  it('when a mock is persisted, does nothing', function () {
    var scope = nock('http://example.test').persist().get('/').reply(200);
    var key = 'GET http://example.test:80/';

    // Confidence check.
    expect(scope.activeMocks()).to.deep.equal([key]);

    // Act.
    scope.remove(key, scope.interceptors[0]);

    // Assert.
    expect(scope.activeMocks()).to.deep.equal([key]);
  });

  it('when the key is nonexistent, does nothing', function () {
    var scope = nock('http://example.test').get('/').reply(200);
    var key = 'GET http://example.test:80/';

    // Confidence check.
    expect(scope.activeMocks()).to.deep.equal([key]);

    // Act.
    scope.remove('GET http://bogus.test:80/', scope.interceptors[0]);

    // Assert.
    expect(scope.activeMocks()).to.deep.equal([key]);
  });
});

it('loadDefs throws expected when fs is not available', function () {
  var loadDefs = _scope2.default.loadDefs;


  expect(function () {
    return loadDefs();
  }).to.throw(Error, 'No fs');
});

describe('`Scope#isDone()`', function () {
  it('returns false while a mock is pending, and true after it is consumed', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var scope;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            scope = nock('http://example.test').get('/').reply();


            expect(scope.isDone()).to.be.false();

            _context3.next = 4;
            return got('http://example.test/');

          case 4:

            expect(scope.isDone()).to.be.true();

            scope.done();

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));
});

describe('`filteringPath()`', function () {
  var _this = this;

  it('filter path with function', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var scope, _ref7, statusCode;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            scope = nock('http://example.test').filteringPath(function () {
              return '/?a=2&b=1';
            }).get('/?a=2&b=1').reply();
            _context4.next = 3;
            return got('http://example.test/', {
              searchParams: { a: '1', b: '2' }
            });

          case 3:
            _ref7 = _context4.sent;
            statusCode = _ref7.statusCode;


            expect(statusCode).to.equal(200);
            scope.done();

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  })));

  it('filter path with regexp', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
    var scope, _ref9, statusCode;

    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            scope = nock('http://example.test').filteringPath(/\d/g, '3').get('/?a=3&b=3').reply();
            _context5.next = 3;
            return got('http://example.test/', {
              searchParams: { a: '1', b: '2' }
            });

          case 3:
            _ref9 = _context5.sent;
            statusCode = _ref9.statusCode;


            expect(statusCode).to.equal(200);
            scope.done();

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, _this);
  })));

  it('filteringPath with invalid argument throws expected', function () {
    expect(function () {
      return nock('http://example.test').filteringPath('abc123');
    }).to.throw(Error, 'Invalid arguments: filtering path should be a function or a regular expression');
  });
});

describe('filteringRequestBody()', function () {
  it('filter body with function', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
    var onFilteringRequestBody, scope, _ref11, statusCode;

    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            onFilteringRequestBody = sinon.spy();
            scope = nock('http://example.test').filteringRequestBody(function (body) {
              onFilteringRequestBody();
              expect(body).to.equal('mamma mia');
              return 'mamma tua';
            }).post('/', 'mamma tua').reply();
            _context6.next = 4;
            return got.post('http://example.test/', {
              body: 'mamma mia'
            });

          case 4:
            _ref11 = _context6.sent;
            statusCode = _ref11.statusCode;


            expect(statusCode).to.equal(200);
            expect(onFilteringRequestBody).to.have.been.calledOnce();
            scope.done();

          case 9:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  })));

  it('filter body with regexp', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
    var scope, _ref13, statusCode;

    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            scope = nock('http://example.test').filteringRequestBody(/mia/, 'nostra').post('/', 'mamma nostra').reply(200, 'Hello World!');
            _context7.next = 3;
            return got.post('http://example.test/', {
              body: 'mamma mia'
            });

          case 3:
            _ref13 = _context7.sent;
            statusCode = _ref13.statusCode;


            expect(statusCode).to.equal(200);
            scope.done();

          case 7:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  })));

  it('filteringRequestBody with invalid argument throws expected', function () {
    expect(function () {
      return nock('http://example.test').filteringRequestBody('abc123');
    }).to.throw(Error, 'Invalid arguments: filtering request body should be a function or a regular expression');
  });
});