"use strict";

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _got_client = require("./got_client");

var _got_client2 = _interopRequireDefault(_got_client);

var _ = require("../");

var _2 = _interopRequireDefault(_);

var _formData = require("form-data");

var _formData2 = _interopRequireDefault(_formData);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _assertRejects = require("assert-rejects");

var _assertRejects2 = _interopRequireDefault(_assertRejects);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var assertRejects = _assertRejects2.default;
var expect = _chai2.default.expect;

var FormData = _formData2.default;
var nock = _2.default;
var got = _got_client2.default;

describe('`matchBody()`', function () {
  it('match json body regardless of key ordering', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var scope, _ref2, body;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            scope = nock('http://example.test').post('/', { foo: 'bar', bar: 'foo' }).reply(200, 'Heyyyy!');
            _context.next = 3;
            return got.post('http://example.test/', {
              json: { bar: 'foo', foo: 'bar' }
            });

          case 3:
            _ref2 = _context.sent;
            body = _ref2.body;


            expect(body).to.equal('Heyyyy!');
            scope.done();

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('match form body regardless of field ordering', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var scope, _ref4, body;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            scope = nock('http://example.test').post('/', { foo: 'bar', bar: 'foo' }).reply(200, 'Heyyyy!');
            _context2.next = 3;
            return got.post('http://example.test/', {
              form: { bar: 'foo', foo: 'bar' }
            });

          case 3:
            _ref4 = _context2.sent;
            body = _ref4.body;


            expect(body).to.equal('Heyyyy!');
            scope.done();

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));

  it('match json body specified as json string', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
    var scope, _ref6, body;

    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            scope = nock('http://example.test').post('/', (0, _stringify2.default)({ bar: 'foo', foo: 'bar' })).reply(200, 'Heyyyy!');
            _context3.next = 3;
            return got.post('http://example.test/', {
              json: { bar: 'foo', foo: 'bar' }
            });

          case 3:
            _ref6 = _context3.sent;
            body = _ref6.body;


            expect(body).to.equal('Heyyyy!');
            scope.done();

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  })));

  it('match body is regex trying to match string (matches)', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
    var scope, _ref8, statusCode;

    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            scope = nock('http://example.test').post('/', /abc/).reply(201);
            _context4.next = 3;
            return got.post('http://example.test/', {
              json: { nested: { value: 'abc' } }
            });

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

  it('match body is regex trying to match string (does not match)', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
    var scope1, scope2, _ref10, statusCode;

    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            scope1 = nock('http://example.test').post('/', /def/).reply(201);
            scope2 = nock('http://example.test').post('/', /./).reply(202);
            _context5.next = 4;
            return got.post('http://example.test/', {
              json: { nested: { value: 'abc' } }
            });

          case 4:
            _ref10 = _context5.sent;
            statusCode = _ref10.statusCode;


            expect(statusCode).to.equal(202);
            expect(scope1.isDone()).to.be.false();
            scope2.done();

          case 9:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  })));

  it('match body with regex', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
    var scope, _ref12, statusCode;

    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            scope = nock('http://example.test').post('/', { auth: { passwd: /a.+/ } }).reply(200);
            _context6.next = 3;
            return got.post('http://example.test', {
              json: { auth: { passwd: 'abc' } }
            });

          case 3:
            _ref12 = _context6.sent;
            statusCode = _ref12.statusCode;


            expect(statusCode).to.equal(200);
            scope.done();

          case 7:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  })));

  it('match body (with space character) with regex', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
    var scope, _ref14, statusCode;

    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            scope = nock('http://example.test').post('/', /a bc/).reply(200);
            _context7.next = 3;
            return got.post('http://example.test', {
              json: { auth: { passwd: 'a bc' } }
            });

          case 3:
            _ref14 = _context7.sent;
            statusCode = _ref14.statusCode;


            expect(statusCode).to.equal(200);
            scope.done();

          case 7:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  })));

  it('match body with regex inside array', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
    var scope, _ref16, statusCode;

    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            scope = nock('http://example.test').post('/', { items: [{ name: /t.+/ }] }).reply(200);
            _context8.next = 3;
            return got.post('http://example.test', {
              json: { items: [{ name: 'test' }] }
            });

          case 3:
            _ref16 = _context8.sent;
            statusCode = _ref16.statusCode;


            expect(statusCode).to.equal(200);
            scope.done();

          case 7:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  })));

  it('match body with empty object inside', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
    var scope, _ref18, statusCode;

    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            scope = nock('http://example.test').post('/', { obj: {} }).reply(200);
            _context9.next = 3;
            return got.post('http://example.test', {
              json: { obj: {} }
            });

          case 3:
            _ref18 = _context9.sent;
            statusCode = _ref18.statusCode;


            expect(statusCode).to.equal(200);
            scope.done();

          case 7:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  })));

  it('match body with nested object inside', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
    var scope, _ref20, statusCode;

    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            scope = nock('http://example.test').post('/', /x/).reply(200);
            _context10.next = 3;
            return got.post('http://example.test', {
              json: { obj: { x: 1 } }
            });

          case 3:
            _ref20 = _context10.sent;
            statusCode = _ref20.statusCode;


            expect(statusCode).to.equal(200);
            scope.done();

          case 7:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, undefined);
  })));

  it("doesn't match body with mismatching keys", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
    var request;
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            nock('http://example.test').post('/', { a: 'a' }).reply(200);

            request = got.post('http://example.test', {
              json: { a: 'a', b: 'b' }
            });
            _context11.next = 4;
            return assertRejects(request, /Nock: No match for request/);

          case 4:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, undefined);
  })));

  // https://github.com/nock/nock/issues/1713
  it("doesn't match body with same number of keys but different keys", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
    var request;
    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            nock('http://example.test').post('/', { a: {} }).reply();

            request = got.post('http://example.test', { json: { b: 123 } });
            _context12.next = 4;
            return assertRejects(request, /Nock: No match for request/);

          case 4:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, undefined);
  })));

  it('match body with form multipart', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
    var form, boundary, scope, _ref24, statusCode;

    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            form = new FormData();
            boundary = form.getBoundary();

            form.append('field', 'value');

            scope = nock('http://example.test').post('/', "--" + boundary + "\r\nContent-Disposition: form-data; name=\"field\"\r\n\r\nvalue\r\n--" + boundary + "--\r\n").reply(200);
            _context13.next = 6;
            return got.post('http://example.test', { body: form });

          case 6:
            _ref24 = _context13.sent;
            statusCode = _ref24.statusCode;


            expect(statusCode).to.equal(200);
            scope.done();

          case 10:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, undefined);
  })));

  it('array like urlencoded form posts are correctly parsed', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14() {
    var scope, _ref26, statusCode;

    return _regenerator2.default.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            scope = nock('http://example.test').post('/', {
              arrayLike: [{
                fieldA: '0',
                fieldB: 'data',
                fieldC: 'value'
              }]
            }).reply();
            _context14.next = 3;
            return got.post('http://example.test', {
              form: {
                'arrayLike[0].fieldA': '0',
                'arrayLike[0].fieldB': 'data',
                'arrayLike[0].fieldC': 'value'
              }
            });

          case 3:
            _ref26 = _context14.sent;
            statusCode = _ref26.statusCode;


            expect(statusCode).to.equal(200);
            scope.done();

          case 7:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee14, undefined);
  })));

  // This test pokes at an inherent shortcoming of URL encoded form data. "technically" form data values
  // can ONLY be strings. However, years of HTML abuse have lead to non-standard ways of handling more complex data.
  // https://url.spec.whatwg.org/#urlencoded-serializing
  // > The application/x-www-form-urlencoded format is in many ways an aberrant monstrosity...
  // Mikeal's Request uses `querystring` by default, optionally `qs` or `form-data`. Got uses `URLSearchParams`.
  // All of which handle "arrays" as values differently.
  // Nock uses `querystring`, as the consensus seems to be that it's the most widely used and intuitive, but it means
  // this test only passes with Got if the array is stringified.
  it('urlencoded form posts are matched with non-string values', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15() {
    var scope, _ref28, statusCode;

    return _regenerator2.default.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            scope = nock('http://example.test').post('/', {
              boolean: true,
              number: 1,
              values: 'false,-1,test'
            }).reply();
            _context15.next = 3;
            return got.post('http://example.test', {
              // "body": "boolean=true&number=1&values=false%2C-1%2Ctest"
              form: {
                boolean: true,
                number: 1,
                values: [false, -1, 'test']
              }
            });

          case 3:
            _ref28 = _context15.sent;
            statusCode = _ref28.statusCode;


            expect(statusCode).to.equal(200);
            scope.done();

          case 7:
          case "end":
            return _context15.stop();
        }
      }
    }, _callee15, undefined);
  })));

  it('urlencoded form posts are matched with regexp', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16() {
    var scope, _ref30, statusCode;

    return _regenerator2.default.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            scope = nock('http://example.test').post('/', {
              regexp: /^xyz$/
            }).reply();
            _context16.next = 3;
            return got.post('http://example.test', {
              form: {
                regexp: 'xyz'
              }
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

  it('match utf-8 buffer body with utf-8 buffer', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17() {
    var scope, _ref32, statusCode;

    return _regenerator2.default.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            scope = nock('http://example.test').post('/', Buffer.from('hello')).reply(200);
            _context17.next = 3;
            return got.post('http://example.test', {
              body: Buffer.from('hello')
            });

          case 3:
            _ref32 = _context17.sent;
            statusCode = _ref32.statusCode;


            expect(statusCode).to.equal(200);
            scope.done();

          case 7:
          case "end":
            return _context17.stop();
        }
      }
    }, _callee17, undefined);
  })));

  it("doesn't match utf-8 buffer body with mismatching utf-8 buffer", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18() {
    var request;
    return _regenerator2.default.wrap(function _callee18$(_context18) {
      while (1) {
        switch (_context18.prev = _context18.next) {
          case 0:
            nock('http://example.test').post('/', Buffer.from('goodbye')).reply(200);

            request = got.post('http://example.test', {
              body: Buffer.from('hello')
            });
            _context18.next = 4;
            return assertRejects(request, /Nock: No match for request/);

          case 4:
          case "end":
            return _context18.stop();
        }
      }
    }, _callee18, undefined);
  })));

  it('match binary buffer body with binary buffer', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19() {
    var scope, _ref35, statusCode;

    return _regenerator2.default.wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            scope = nock('http://example.test').post('/', Buffer.from([0xff, 0xff, 0xff])).reply(200);
            _context19.next = 3;
            return got.post('http://example.test', {
              body: Buffer.from([0xff, 0xff, 0xff])
            });

          case 3:
            _ref35 = _context19.sent;
            statusCode = _ref35.statusCode;


            expect(statusCode).to.equal(200);
            scope.done();

          case 7:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19, undefined);
  })));

  it("doesn't match binary buffer body with mismatching binary buffer", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20() {
    var request;
    return _regenerator2.default.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            nock('http://example.test').post('/', Buffer.from([0xff, 0xff, 0xfa])).reply(200);

            request = got.post('http://example.test', {
              body: Buffer.from([0xff, 0xff, 0xff])
            });
            _context20.next = 4;
            return assertRejects(request, /Nock: No match for request/);

          case 4:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20, undefined);
  })));

  it("doesn't match binary buffer body with mismatching utf-8 buffer", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21() {
    var request;
    return _regenerator2.default.wrap(function _callee21$(_context21) {
      while (1) {
        switch (_context21.prev = _context21.next) {
          case 0:
            nock('http://example.test').post('/', Buffer.from([0xff, 0xff, 0xff])).reply(200);

            request = got.post('http://example.test', {
              body: Buffer.from('hello')
            });
            _context21.next = 4;
            return assertRejects(request, /Nock: No match for request/);

          case 4:
          case "end":
            return _context21.stop();
        }
      }
    }, _callee21, undefined);
  })));

  it("doesn't match utf-8 buffer body with mismatching binary buffer", (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee22() {
    var request;
    return _regenerator2.default.wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            nock('http://example.test').post('/', Buffer.from('hello')).reply(200);

            request = got.post('http://example.test', {
              body: Buffer.from([0xff, 0xff, 0xff])
            });
            _context22.next = 4;
            return assertRejects(request, /Nock: No match for request/);

          case 4:
          case "end":
            return _context22.stop();
        }
      }
    }, _callee22, undefined);
  })));
});