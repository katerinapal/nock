"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var EventEmitter = _events2.default.EventEmitter;

var debug = (0, _debug2.default)('nock.socket');

mod_socketjs = function (_EventEmitter) {
  (0, _inherits3.default)(Socket, _EventEmitter);

  function Socket(options) {
    (0, _classCallCheck3.default)(this, Socket);

    // Pretend this is a TLSSocket
    var _this = (0, _possibleConstructorReturn3.default)(this, (Socket.__proto__ || (0, _getPrototypeOf2.default)(Socket)).call(this));

    if (options.proto === 'https') {
      // https://github.com/nock/nock/issues/158
      _this.authorized = true;
      // https://github.com/nock/nock/issues/2147
      _this.encrypted = true;
    }

    _this.bufferSize = 0;
    _this.writableLength = 0;
    _this.writable = true;
    _this.readable = true;
    _this.pending = false;
    _this.destroyed = false;
    _this.connecting = true;

    // Undocumented flag used by ClientRequest to ensure errors aren't double-fired
    _this._hadError = false;

    // Maximum allowed delay. 0 means unlimited.
    _this.timeout = 0;

    var ipv6 = options.family === 6;
    _this.remoteFamily = ipv6 ? 'IPv6' : 'IPv4';
    _this.localAddress = _this.remoteAddress = ipv6 ? '::1' : '127.0.0.1';
    _this.localPort = _this.remotePort = parseInt(options.port);
    return _this;
  }

  (0, _createClass3.default)(Socket, [{
    key: "setNoDelay",
    value: function setNoDelay() {}
  }, {
    key: "setKeepAlive",
    value: function setKeepAlive() {}
  }, {
    key: "resume",
    value: function resume() {}
  }, {
    key: "ref",
    value: function ref() {}
  }, {
    key: "unref",
    value: function unref() {}
  }, {
    key: "address",
    value: function address() {
      return {
        port: this.remotePort,
        family: this.remoteFamily,
        address: this.remoteAddress
      };
    }
  }, {
    key: "setTimeout",
    value: function setTimeout(timeoutMs, fn) {
      this.timeout = timeoutMs;
      if (fn) {
        this.once('timeout', fn);
      }
      return this;
    }

    /**
     * Artificial delay that will trip socket timeouts when appropriate.
     *
     * Doesn't actually wait for time to pass.
     * Timeout events don't necessarily end the request.
     * While many clients choose to abort the request upon a timeout, Node itself does not.
     */

  }, {
    key: "applyDelay",
    value: function applyDelay(delayMs) {
      if (this.timeout && delayMs > this.timeout) {
        debug('socket timeout');
        this.emit('timeout');
      }
    }
  }, {
    key: "getPeerCertificate",
    value: function getPeerCertificate() {
      return Buffer.from((Math.random() * 10000 + Date.now()).toString()).toString('base64');
    }

    /**
     * Denotes that no more I/O activity should happen on this socket.
     *
     * The implementation in Node if far more complex as it juggles underlying async streams.
     * For the purposes of Nock, we just need it to set some flags and on the first call
     * emit a 'close' and optional 'error' event. Both events propagate through the request object.
     */

  }, {
    key: "destroy",
    value: function destroy(err) {
      var _this2 = this;

      if (this.destroyed) {
        return this;
      }

      debug('socket destroy');
      this.destroyed = true;
      this.readable = this.writable = false;
      this.readableEnded = this.writableFinished = true;

      process.nextTick(function () {
        if (err) {
          _this2._hadError = true;
          _this2.emit('error', err);
        }
        _this2.emit('close');
      });

      return this;
    }
  }]);
  return Socket;
}(EventEmitter);
var mod_socketjs;
exports.default = mod_socketjs;
module.exports = exports.default;