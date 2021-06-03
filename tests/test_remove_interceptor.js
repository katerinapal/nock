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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var expect = _chai2.default.expect;

var nock = _2.default;
var got = _got_client2.default;

describe('`removeInterceptor()`', function () {
  context('when invoked with an Interceptor instance', function () {
    it('remove interceptor removes given interceptor', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      var givenInterceptor, newScope, _ref2, statusCode, body;

      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              givenInterceptor = nock('http://example.test').get('/somepath');

              givenInterceptor.reply(200, 'hey');

              expect(nock.removeInterceptor(givenInterceptor)).to.be.true();

              newScope = nock('http://example.test').get('/somepath').reply(202, 'other-content');
              _context.next = 6;
              return got('http://example.test/somepath');

            case 6:
              _ref2 = _context.sent;
              statusCode = _ref2.statusCode;
              body = _ref2.body;


              expect(statusCode).to.equal(202);
              expect(body).to.equal('other-content');

              newScope.done();

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined);
    })));

    it('reflects the removal in `pendingMocks()`', function () {
      var givenInterceptor = nock('http://example.test').get('/somepath');
      var scope = givenInterceptor.reply(200, 'hey');

      expect(scope.pendingMocks()).to.deep.equal(['GET http://example.test:80/somepath']);

      expect(nock.removeInterceptor(givenInterceptor)).to.be.true();

      expect(scope.pendingMocks()).to.deep.equal([]);
    });

    it('removes given interceptor for https', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      var givenInterceptor, scope, newScope, _ref4, statusCode, body;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              givenInterceptor = nock('https://example.test').get('/somepath');
              scope = givenInterceptor.reply(200, 'hey');


              expect(scope.pendingMocks()).to.deep.equal(['GET https://example.test:443/somepath']);

              expect(nock.removeInterceptor(givenInterceptor)).to.be.true();

              newScope = nock('https://example.test').get('/somepath').reply(202, 'other-content');
              _context2.next = 7;
              return got('https://example.test/somepath');

            case 7:
              _ref4 = _context2.sent;
              statusCode = _ref4.statusCode;
              body = _ref4.body;


              expect(statusCode).to.equal(202);
              expect(body).to.equal('other-content');

              newScope.done();

            case 13:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    })));

    it('works on an interceptor with a regex for a path', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
      var givenInterceptor, scope, newScope, _ref6, statusCode, body;

      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              givenInterceptor = nock('http://example.test').get(/somePath$/);
              scope = givenInterceptor.reply(200, 'hey');


              expect(scope.pendingMocks()).to.deep.equal(['GET http://example.test:80//somePath$/']);

              expect(nock.removeInterceptor(givenInterceptor)).to.be.true();

              newScope = nock('http://example.test').get(/somePath$/).reply(202, 'other-content');
              _context3.next = 7;
              return got('http://example.test/get-somePath');

            case 7:
              _ref6 = _context3.sent;
              statusCode = _ref6.statusCode;
              body = _ref6.body;


              expect(statusCode).to.equal(202);
              expect(body).to.equal('other-content');

              newScope.done();

            case 13:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    })));
  });

  context('when invoked with an object', function () {
    it('removes a matching interceptor and returns true', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
      var newScope, _ref8, statusCode, body;

      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              nock('http://example.test').get('/somepath').reply(200, 'hey');

              expect(nock.removeInterceptor({
                hostname: 'example.test',
                path: '/somepath'
              })).to.be.true();

              newScope = nock('http://example.test').get('/somepath').reply(202, 'other-content');
              _context4.next = 5;
              return got('http://example.test/somepath');

            case 5:
              _ref8 = _context4.sent;
              statusCode = _ref8.statusCode;
              body = _ref8.body;


              expect(statusCode).to.equal(202);
              expect(body).to.equal('other-content');

              newScope.done();

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    })));

    it('when no interceptor is found, returns false', function () {
      expect(nock.removeInterceptor({
        hostname: 'example.org',
        path: '/somepath'
      })).to.be.false();
    });

    it('can match a request with a proto', function () {
      var scope = nock('https://example.test').get('/somepath').reply(200, 'hey');
      expect(scope.pendingMocks()).to.deep.equal(['GET https://example.test:443/somepath']);

      expect(nock.removeInterceptor({
        proto: 'https',
        hostname: 'example.test',
        path: '/somepath'
      })).to.be.true();

      expect(scope.pendingMocks()).to.deep.equal([]);
    });

    it('can match a request with a method', function () {
      var scope = nock('http://example.test').post('/somepath').reply(200, 'hey');
      expect(scope.pendingMocks()).to.deep.equal(['POST http://example.test:80/somepath']);

      expect(nock.removeInterceptor({
        method: 'post',
        hostname: 'example.test',
        path: '/somepath'
      })).to.be.true();

      expect(scope.pendingMocks()).to.deep.equal([]);
    });

    it('can match the default path `/` when no path is specified', function () {
      var scope = nock('http://example.test').get('/').reply(200, 'hey');
      expect(scope.pendingMocks()).to.deep.equal(['GET http://example.test:80/']);

      expect(nock.removeInterceptor({
        hostname: 'example.test'
      })).to.be.true();

      expect(scope.pendingMocks()).to.deep.equal([]);
    });

    it('only removes interceptors whose path matches', function () {
      var scope1 = nock('http://example.test').get('/somepath').reply(200, 'hey');
      var scope2 = nock('http://example.test').get('/anotherpath').reply(200, 'hey');

      expect(scope1.pendingMocks()).to.deep.equal(['GET http://example.test:80/somepath']);
      expect(scope2.pendingMocks()).to.deep.equal(['GET http://example.test:80/anotherpath']);

      expect(nock.removeInterceptor({
        hostname: 'example.test',
        path: '/anotherpath'
      })).to.be.true();

      expect(scope1.pendingMocks()).to.deep.equal(['GET http://example.test:80/somepath']);
      expect(scope2.pendingMocks()).to.deep.equal([]);
    });
  });
});