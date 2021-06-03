"use strict";

var _setImmediate2 = require("babel-runtime/core-js/set-immediate");

var _setImmediate3 = _interopRequireDefault(_setImmediate2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _match_body = require("../lib/match_body");

var _match_body2 = _interopRequireDefault(_match_body);

var _common = require("../lib/common");

var _common2 = _interopRequireDefault(_common);

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _semver = require("semver");

var _semver2 = _interopRequireDefault(_semver);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

// Nock's strategy is to test as much as possible either through the public API
// or, when that is not possible, through the mock surface.
//
// Whenever tests can be written against the public API or the mock surface, do
// that rather than add tests here.
//
// This helps ensure that the code in the common module stays tight, and that
// it's all necessary for handling the supported use cases. The project enforces
// 100% test coverage, so when utility code falls out of test, we know it's time
// to remove it.

var http = _http2.default;
var expect = _chai2.default.expect;

var sinon = _sinon2.default;
var semver = _semver2.default;
var nock = _2.default;

var common = _common2.default;
var matchBody = _match_body2.default;

// match_body has its own test file that tests the functionality from the API POV.
// Since it's not in common.js does it make more sense for these six unit tests to move into that file?
describe('Body Match', function () {
  describe('unit', function () {
    it('ignores new line characters from strings', function () {
      var result = matchBody({}, 'something //here is something more \n', 'something //here is something more \n\r');
      expect(result).to.equal(true);
    });

    it("when spec is a function, it's called with newline characters intact", function () {
      var exampleBody = 'something //here is something more \n';
      var matchCbSpy = sinon.spy();

      matchBody({}, matchCbSpy, exampleBody);
      expect(matchCbSpy).to.have.been.calledOnceWithExactly(exampleBody);
    });

    it('should not throw, when headers come node-fetch style as array', function () {
      var result = matchBody({ headers: { 'Content-Type': ['multipart/form-data;'] } }, {}, 'test');
      expect(result).to.equal(false);
    });

    it("should not ignore new line characters from strings when Content-Type contains 'multipart'", function () {
      var result = matchBody({ headers: { 'Content-Type': 'multipart/form-data;' } }, 'something //here is something more \nHello', 'something //here is something more \nHello');
      expect(result).to.equal(true);
    });

    it("should not ignore new line characters from strings when Content-Type contains 'multipart' (arrays come node-fetch style as array)", function () {
      var result = matchBody({ headers: { 'Content-Type': ['multipart/form-data;'] } }, 'something //here is something more \nHello', 'something //here is something more \nHello');
      expect(result).to.equal(true);
    });

    it('should use strict equality for deep comparisons', function () {
      var result = matchBody({}, { number: 1 }, '{"number": "1"}');
      expect(result).to.equal(false);
    });
  });
});

describe('`normalizeRequestOptions()`', function () {
  it('should normalize hosts with port', function () {
    var result = common.normalizeRequestOptions({
      host: 'example.test:12345',
      port: 12345
    });

    var expected = {
      host: 'example.test:12345',
      hostname: 'example.test',
      port: 12345,
      proto: 'http'
    };

    expect(result).to.deep.equal(expected);
  });

  it('should normalize hosts without port', function () {
    var result = common.normalizeRequestOptions({
      hostname: 'example.test'
    });

    var expected = {
      host: 'example.test:80',
      hostname: 'example.test',
      port: 80,
      proto: 'http'
    };

    expect(result).to.deep.equal(expected);
  });

  it('should not error and add defaults for empty options', function () {
    var result = common.normalizeRequestOptions({});

    var expected = {
      host: 'localhost:80',
      // Should this be included?
      // hostname: 'localhost'
      port: 80,
      proto: 'http'
    };

    expect(result).to.deep.equal(expected);
  });
});

describe('`isUtf8Representable()`', function () {
  it("should return false for buffers that aren't utf8 representable", function () {
    expect(common.isUtf8Representable(Buffer.from('8001', 'hex'))).to.equal(false);
  });

  it('should returns true for buffers containing strings', function () {
    expect(common.isUtf8Representable(Buffer.from('8001', 'utf8'))).to.equal(true);
  });
});

it('`isJSONContent()`', function () {
  expect(common.isJSONContent({ 'content-type': 'application/json' })).to.equal(true);

  expect(common.isJSONContent({ 'content-type': 'application/json; charset=utf-8' })).to.equal(true);

  expect(common.isJSONContent({ 'content-type': 'text/plain' })).to.equal(false);
});

describe('`headersFieldNamesToLowerCase()`', function () {
  it('should return a lower-cased copy of the input', function () {
    var input = {
      HoSt: 'example.test',
      'Content-typE': 'plain/text'
    };
    var inputClone = (0, _extends3.default)({}, input);
    var result = common.headersFieldNamesToLowerCase(input);
    var expected = {
      host: 'example.test',
      'content-type': 'plain/text'
    };

    expect(result).to.deep.equal(expected);
    expect(input).to.deep.equal(inputClone); // assert the input is not mutated
  });

  it('throws on conflicting keys', function () {
    expect(function () {
      return common.headersFieldNamesToLowerCase({
        HoSt: 'example.test',
        HOST: 'example.test'
      });
    }).to.throw('Failed to convert header keys to lower case due to field name conflict: host');
  });
});

describe('`headersFieldsArrayToLowerCase()`', function () {
  it('should work on arrays', function () {
    // Sort for comparison because order doesn't matter.
    var result = common.headersFieldsArrayToLowerCase(['HoSt', 'Content-typE']).sort();

    expect(result).to.deep.equal(['content-type', 'host']);
  });

  it('should de-duplicate arrays', function () {
    // Sort for comparison because order doesn't matter.
    var result = common.headersFieldsArrayToLowerCase(['hosT', 'HoSt', 'Content-typE', 'conTenT-tYpe']).sort();

    expect(result).to.deep.equal(['content-type', 'host']);
  });
});

describe('`deleteHeadersField()`', function () {
  it('should delete fields with case-insensitive field names', function () {
    // Prepare.
    var headers = {
      HoSt: 'example.test',
      'Content-typE': 'plain/text'

      // Confidence check.
    };expect(headers).to.have.property('HoSt');
    expect(headers).to.have.property('Content-typE');

    // Act.
    common.deleteHeadersField(headers, 'HOST');
    common.deleteHeadersField(headers, 'CONTENT-TYPE');

    // Assert.
    expect(headers).to.not.have.property('HoSt');
    expect(headers).to.not.have.property('Content-typE');
  });

  it('should remove multiple fields with same case-insensitive names', function () {
    var headers = {
      foo: 'one',
      FOO: 'two',
      'X-Foo': 'three'
    };

    common.deleteHeadersField(headers, 'foo');

    expect(headers).to.deep.equal({ 'X-Foo': 'three' });
  });

  it('should throw for invalid headers', function () {
    expect(function () {
      return common.deleteHeadersField('foo', 'Content-Type');
    }).to.throw('headers must be an object');
  });

  it('should throw for invalid field name', function () {
    expect(function () {
      return common.deleteHeadersField({}, /cookie/);
    }).to.throw('field name must be a string');
  });
});

describe('`matchStringOrRegexp()`', function () {
  it('should match if pattern is string and target matches', function () {
    var result = common.matchStringOrRegexp('to match', 'to match');
    expect(result).to.equal(true);
  });

  it("should not match if pattern is string and target doesn't match", function () {
    var result = common.matchStringOrRegexp('to match', 'not to match');
    expect(result).to.equal(false);
  });

  it('should match pattern is number and target matches', function () {
    var result = common.matchStringOrRegexp(123, 123);
    expect(result).to.equal(true);
  });

  it('should handle undefined target when pattern is string', function () {
    var result = common.matchStringOrRegexp(undefined, 'to not match');
    expect(result).to.equal(false);
  });

  it('should handle undefined target when pattern is regex', function () {
    var result = common.matchStringOrRegexp(undefined, /not/);
    expect(result).to.equal(false);
  });

  it('should match if pattern is regex and target matches', function () {
    var result = common.matchStringOrRegexp('to match', /match/);
    expect(result).to.equal(true);
  });

  it("should not match if pattern is regex and target doesn't match", function () {
    var result = common.matchStringOrRegexp('to match', /not/);
    expect(result).to.equal(false);
  });
});

describe('`overrideRequests()`', function () {
  afterEach(function () {
    common.restoreOverriddenRequests();
  });

  it('should throw if called a second time', function () {
    nock.restore();
    common.overrideRequests();
    // Second call throws.
    expect(function () {
      return common.overrideRequests();
    }).to.throw("Module's request already overridden for http protocol.");
  });
});

it('`restoreOverriddenRequests()` can be called more than once', function () {
  common.restoreOverriddenRequests();
  common.restoreOverriddenRequests();
});

describe('`stringifyRequest()`', function () {
  it('should include non-default ports', function () {
    var options = {
      method: 'GET',
      port: 3000,
      proto: 'http',
      hostname: 'example.test',
      path: '/',
      headers: {}
    };

    var result = common.stringifyRequest(options, 'foo');

    // We have to parse the object instead of comparing the raw string because the order of keys are not guaranteed.
    expect(JSON.parse(result)).to.deep.equal({
      method: 'GET',
      url: 'http://example.test:3000/',
      headers: {},
      body: 'foo'
    });
  });

  it('should not include default http port', function () {
    var options = {
      method: 'GET',
      port: 80,
      proto: 'http',
      hostname: 'example.test',
      path: '/',
      headers: {}
    };

    var result = common.stringifyRequest(options, 'foo');

    expect(JSON.parse(result)).to.deep.equal({
      method: 'GET',
      url: 'http://example.test/',
      headers: {},
      body: 'foo'
    });
  });

  it('should not include default https port', function () {
    var options = {
      method: 'POST',
      port: 443,
      proto: 'https',
      hostname: 'example.test',
      path: '/the/path',
      headers: {}
    };

    var result = common.stringifyRequest(options, 'foo');

    expect(JSON.parse(result)).to.deep.equal({
      method: 'POST',
      url: 'https://example.test/the/path',
      headers: {},
      body: 'foo'
    });
  });

  it('should default optional options', function () {
    var options = {
      port: 80,
      proto: 'http',
      hostname: 'example.test',
      headers: {}
    };

    var result = common.stringifyRequest(options, 'foo');

    expect(JSON.parse(result)).to.deep.equal({
      method: 'GET',
      url: 'http://example.test',
      headers: {},
      body: 'foo'
    });
  });

  it('should pass headers through', function () {
    var options = {
      method: 'GET',
      port: 80,
      proto: 'http',
      hostname: 'example.test',
      path: '/',
      headers: { cookie: 'fiz=baz', 'set-cookie': ['hello', 'world'] }
    };

    var result = common.stringifyRequest(options, 'foo');

    expect(JSON.parse(result)).to.deep.equal({
      method: 'GET',
      url: 'http://example.test/',
      headers: { cookie: 'fiz=baz', 'set-cookie': ['hello', 'world'] },
      body: 'foo'
    });
  });

  it('should always treat the body as a string', function () {
    var options = {
      method: 'GET',
      port: 80,
      proto: 'http',
      hostname: 'example.test',
      path: '/',
      headers: {}
    };

    var result = common.stringifyRequest(options, '{"hello":"world"}');

    expect(JSON.parse(result)).to.deep.equal({
      method: 'GET',
      url: 'http://example.test/',
      headers: {},
      body: '{"hello":"world"}'
    });
  });
});

it('`headersArrayToObject()`', function () {
  var headers = ['Content-Type', 'application/json; charset=utf-8', 'Last-Modified', 'foobar', 'Expires', 'fizbuzz'];

  expect(common.headersArrayToObject(headers)).to.deep.equal({
    'content-type': 'application/json; charset=utf-8',
    'last-modified': 'foobar',
    expires: 'fizbuzz'
  });

  var headersMultipleSetCookies = headers.concat(['Set-Cookie', 'foo=bar; Domain=.github.com; Path=/', 'Set-Cookie', 'fiz=baz; Domain=.github.com; Path=/', 'set-cookie', 'foo=baz; Domain=.github.com; Path=/']);

  expect(common.headersArrayToObject(headersMultipleSetCookies)).to.deep.equal({
    'content-type': 'application/json; charset=utf-8',
    'last-modified': 'foobar',
    expires: 'fizbuzz',
    'set-cookie': ['foo=bar; Domain=.github.com; Path=/', 'fiz=baz; Domain=.github.com; Path=/', 'foo=baz; Domain=.github.com; Path=/']
  });

  expect(function () {
    return common.headersArrayToObject(123);
  }).to.throw('Expected a header array');
});

it('`percentEncode()` encodes extra reserved characters', function () {
  expect(common.percentEncode('foo+(*)!')).to.equal('foo%2B%28%2A%29%21');
});

describe('`normalizeClientRequestArgs()`', function () {
  it('should throw for invalid URL', function () {
    // See https://github.com/nodejs/node/pull/38614 release in node v16.2.0
    var isNewErrorText = semver.gte(process.versions.node, '16.2.0');
    var errorText = isNewErrorText ? 'Invalid URL' : 'example.test';

    // no schema
    expect(function () {
      return http.get('example.test');
    }).to.throw(TypeError, errorText);
  });

  it('can include auth info', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var scope;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            scope = nock('http://example.test').get('/').basicAuth({ user: 'user', pass: 'pw' }).reply();


            http.get('http://user:pw@example.test');
            scope.isDone();

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));

  it('should handle a single callback', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var cb, _common$normalizeClie, options, callback;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // TODO: Only passing a callback isn't currently supported by Nock,
            // but should be in the future as Node allows it.
            cb = function cb() {};

            _common$normalizeClie = common.normalizeClientRequestArgs(cb), options = _common$normalizeClie.options, callback = _common$normalizeClie.callback;


            expect(options).to.deep.equal({});
            expect(callback).to.equal(cb);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  })));
});

describe('`dataEqual()`', function () {
  it('treats explicit and implicit undefined object values as equal', function () {
    var result = common.dataEqual({ a: 'a', b: undefined }, { a: 'a' });
    expect(result).to.equal(true);
  });
  it('does not conflate object and array keys', function () {
    var result = common.dataEqual(['a', 'b'], { 0: 'a', 1: 'b' });
    expect(result).to.equal(false);
  });
  it('treats JSON path notated and nested objects as equal', function () {
    var result = common.dataEqual({ 'foo[bar][0]': 'baz' }, { foo: { bar: ['baz'] } });
    expect(result).to.equal(true);
  });
  it('does not equate arrays of different length', function () {
    var result = common.dataEqual(['a'], ['a', 'b']);
    expect(result).to.equal(false);
  });
});

it('testing timers are deleted correctly', function (done) {
  var timeoutSpy = sinon.spy();
  var intervalSpy = sinon.spy();
  var immediateSpy = sinon.spy();

  common.setTimeout(timeoutSpy, 0);
  common.setInterval(intervalSpy, 0);
  common.setImmediate(immediateSpy);
  common.removeAllTimers();

  (0, _setImmediate3.default)(function () {
    expect(timeoutSpy).to.not.have.been.called();
    expect(intervalSpy).to.not.have.been.called();
    expect(immediateSpy).to.not.have.been.called();
    done();
  });
});