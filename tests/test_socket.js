"use strict";

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _ = require("..");

var _2 = _interopRequireDefault(_);

var _stream = require("stream");

var _stream2 = _interopRequireDefault(_stream);

var _https = require("https");

var _https2 = _interopRequireDefault(_https);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var expect = _chai2.default.expect;

var http = _http2.default;
var https = _https2.default;
var Readable = _stream2.default.Readable;

var nock = _2.default;

it('should expose TLSSocket attributes for HTTPS requests', function (done) {
  nock('https://example.test').get('/').reply();

  https.get('https://example.test').on('socket', function (socket) {
    expect(socket.authorized).to.equal(true);
    expect(socket.encrypted).to.equal(true);
    done();
  });
});

it('should not have TLSSocket attributes for HTTP requests', function (done) {
  nock('http://example.test').get('/').reply();

  http.get('http://example.test').on('socket', function (socket) {
    expect(socket.authorized).to.equal(undefined);
    expect(socket.encrypted).to.equal(undefined);
    done();
  });
});

describe('`Socket#setTimeout()`', function () {
  it('adds callback as a one-time listener for parity with a real socket', function (done) {
    nock('http://example.test').get('/').delayConnection(100).reply();

    var onTimeout = function onTimeout() {
      done();
    };

    http.get('http://example.test').on('socket', function (socket) {
      socket.setTimeout(50, onTimeout);
    });
  });

  it('can be called without a callback', function (done) {
    nock('http://example.test').get('/').delayConnection(100).reply();

    http.get('http://example.test').on('socket', function (socket) {
      socket.setTimeout(50);

      socket.on('timeout', function () {
        done();
      });
    });
  });
});

describe('`Socket#destroy()`', function () {
  it('can destroy the socket if stream is not finished', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var scope, req, stream;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            scope = nock('http://example.test');


            scope.intercept('/somepath', 'GET').reply(function () {
              var buffer = Buffer.allocUnsafe(10000000);
              var data = new MemoryReadableStream(buffer, { highWaterMark: 128 });
              return [200, data];
            });

            req = http.get('http://example.test/somepath');
            _context.next = 5;
            return new _promise2.default(function (resolve) {
              return req.on('response', resolve);
            });

          case 5:
            stream = _context.sent;


            // close after first chunk of data
            stream.on('data', function () {
              return stream.destroy();
            });

            _context.next = 9;
            return new _promise2.default(function (resolve, reject) {
              stream.on('error', reject);
              stream.on('close', resolve);
              stream.on('end', resolve);
            });

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  })));
});

var MemoryReadableStream = function (_Readable) {
  (0, _inherits3.default)(MemoryReadableStream, _Readable);

  function MemoryReadableStream(content) {
    (0, _classCallCheck3.default)(this, MemoryReadableStream);

    var _this = (0, _possibleConstructorReturn3.default)(this, (MemoryReadableStream.__proto__ || (0, _getPrototypeOf2.default)(MemoryReadableStream)).call(this));

    _this._content = content;
    _this._currentOffset = 0;
    return _this;
  }

  (0, _createClass3.default)(MemoryReadableStream, [{
    key: "_read",
    value: function _read(size) {
      if (this._currentOffset >= this._content.length) {
        this.push(null);
        return;
      }

      var nextOffset = this._currentOffset + size;
      var content = this._content.slice(this._currentOffset, nextOffset);
      this._currentOffset = nextOffset;

      this.push(content);
    }
  }]);
  return MemoryReadableStream;
}(Readable);