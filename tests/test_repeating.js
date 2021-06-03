"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _assertRejects = require("assert-rejects");

var _assertRejects2 = _interopRequireDefault(_assertRejects);

var _got_client = require("./got_client");

var _got_client2 = _interopRequireDefault(_got_client);

var _2 = require("..");

var _3 = _interopRequireDefault(_2);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var expect = _chai2.default.expect;

var nock = _3.default;
var got = _got_client2.default;
var assertRejects = _assertRejects2.default;

describe('repeating', function () {
  it('`once()`', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var scope, _ref2, statusCode;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            scope = nock('http://example.test').get('/').once().reply(200, 'Hello World!');
            _context.next = 3;
            return got('http://example.test/');

          case 3:
            _ref2 = _context.sent;
            statusCode = _ref2.statusCode;

            expect(statusCode).to.equal(200);

            _context.next = 8;
            return assertRejects(got('http://example.test/'), /Nock: No match for request/);

          case 8:

            scope.done();

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('`twice()`', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var scope, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _, _ref4, statusCode;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            scope = nock('http://example.test').get('/').twice().reply(200, 'Hello World!');

            // eslint-disable-next-line no-unused-vars

            _iteratorNormalCompletion = true;
            _didIteratorError = false;
            _iteratorError = undefined;
            _context2.prev = 4;
            _iterator = (0, _getIterator3.default)(Array(2));

          case 6:
            if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
              _context2.next = 16;
              break;
            }

            _ = _step.value;
            _context2.next = 10;
            return got('http://example.test/');

          case 10:
            _ref4 = _context2.sent;
            statusCode = _ref4.statusCode;

            expect(statusCode).to.equal(200);

          case 13:
            _iteratorNormalCompletion = true;
            _context2.next = 6;
            break;

          case 16:
            _context2.next = 22;
            break;

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2["catch"](4);
            _didIteratorError = true;
            _iteratorError = _context2.t0;

          case 22:
            _context2.prev = 22;
            _context2.prev = 23;

            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }

          case 25:
            _context2.prev = 25;

            if (!_didIteratorError) {
              _context2.next = 28;
              break;
            }

            throw _iteratorError;

          case 28:
            return _context2.finish(25);

          case 29:
            return _context2.finish(22);

          case 30:
            _context2.next = 32;
            return assertRejects(got('http://example.test/'), /Nock: No match for request/);

          case 32:

            scope.done();

          case 33:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[4, 18, 22, 30], [23,, 25, 29]]);
  })));

  it('`thrice()`', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var scope, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _, _ref6, statusCode;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            scope = nock('http://example.test').get('/').thrice().reply(200, 'Hello World!');

            // eslint-disable-next-line no-unused-vars

            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _iteratorError2 = undefined;
            _context3.prev = 4;
            _iterator2 = (0, _getIterator3.default)(Array(3));

          case 6:
            if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
              _context3.next = 16;
              break;
            }

            _ = _step2.value;
            _context3.next = 10;
            return got('http://example.test/');

          case 10:
            _ref6 = _context3.sent;
            statusCode = _ref6.statusCode;

            expect(statusCode).to.equal(200);

          case 13:
            _iteratorNormalCompletion2 = true;
            _context3.next = 6;
            break;

          case 16:
            _context3.next = 22;
            break;

          case 18:
            _context3.prev = 18;
            _context3.t0 = _context3["catch"](4);
            _didIteratorError2 = true;
            _iteratorError2 = _context3.t0;

          case 22:
            _context3.prev = 22;
            _context3.prev = 23;

            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }

          case 25:
            _context3.prev = 25;

            if (!_didIteratorError2) {
              _context3.next = 28;
              break;
            }

            throw _iteratorError2;

          case 28:
            return _context3.finish(25);

          case 29:
            return _context3.finish(22);

          case 30:
            _context3.next = 32;
            return assertRejects(got('http://example.test/'), /Nock: No match for request/);

          case 32:

            scope.done();

          case 33:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[4, 18, 22, 30], [23,, 25, 29]]);
  })));

  describe('`times()`', function () {
    it('repeating 4 times', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
      var scope, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _, _ref8, statusCode;

      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              scope = nock('http://example.test').get('/').times(4).reply(200, 'Hello World!');

              // eslint-disable-next-line no-unused-vars

              _iteratorNormalCompletion3 = true;
              _didIteratorError3 = false;
              _iteratorError3 = undefined;
              _context4.prev = 4;
              _iterator3 = (0, _getIterator3.default)(Array(4));

            case 6:
              if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                _context4.next = 16;
                break;
              }

              _ = _step3.value;
              _context4.next = 10;
              return got('http://example.test/');

            case 10:
              _ref8 = _context4.sent;
              statusCode = _ref8.statusCode;

              expect(statusCode).to.equal(200);

            case 13:
              _iteratorNormalCompletion3 = true;
              _context4.next = 6;
              break;

            case 16:
              _context4.next = 22;
              break;

            case 18:
              _context4.prev = 18;
              _context4.t0 = _context4["catch"](4);
              _didIteratorError3 = true;
              _iteratorError3 = _context4.t0;

            case 22:
              _context4.prev = 22;
              _context4.prev = 23;

              if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
              }

            case 25:
              _context4.prev = 25;

              if (!_didIteratorError3) {
                _context4.next = 28;
                break;
              }

              throw _iteratorError3;

            case 28:
              return _context4.finish(25);

            case 29:
              return _context4.finish(22);

            case 30:
              _context4.next = 32;
              return assertRejects(got('http://example.test/'), /Nock: No match for request/);

            case 32:

              scope.done();

            case 33:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, undefined, [[4, 18, 22, 30], [23,, 25, 29]]);
    })));

    it('invalid argument is ignored', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
      var scope, _ref10, statusCode;

      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              scope = nock('http://example.test').get('/').times(0).reply(200, 'Hello World!');
              _context5.next = 3;
              return got('http://example.test/');

            case 3:
              _ref10 = _context5.sent;
              statusCode = _ref10.statusCode;

              expect(statusCode).to.equal(200);

              _context5.next = 8;
              return assertRejects(got('http://example.test/'), /Nock: No match for request/);

            case 8:

              scope.done();

            case 9:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, undefined);
    })));
  });

  it('`isDone()` considers repeated responses', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
    var scope, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _;

    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            scope = nock('http://example.test').get('/').times(2).reply(204);

            // eslint-disable-next-line no-unused-vars

            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _iteratorError4 = undefined;
            _context6.prev = 4;
            _iterator4 = (0, _getIterator3.default)(Array(2));

          case 6:
            if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
              _context6.next = 14;
              break;
            }

            _ = _step4.value;

            expect(scope.isDone()).to.be.false();
            _context6.next = 11;
            return got('http://example.test/');

          case 11:
            _iteratorNormalCompletion4 = true;
            _context6.next = 6;
            break;

          case 14:
            _context6.next = 20;
            break;

          case 16:
            _context6.prev = 16;
            _context6.t0 = _context6["catch"](4);
            _didIteratorError4 = true;
            _iteratorError4 = _context6.t0;

          case 20:
            _context6.prev = 20;
            _context6.prev = 21;

            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }

          case 23:
            _context6.prev = 23;

            if (!_didIteratorError4) {
              _context6.next = 26;
              break;
            }

            throw _iteratorError4;

          case 26:
            return _context6.finish(23);

          case 27:
            return _context6.finish(20);

          case 28:
            expect(scope.isDone()).to.be.true();

          case 29:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, undefined, [[4, 16, 20, 28], [21,, 23, 27]]);
  })));
});