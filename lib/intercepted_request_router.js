"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _entries = require("babel-runtime/core-js/object/entries");

var _entries2 = _interopRequireDefault(_entries);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _playback_interceptor = require("./playback_interceptor");

var _playback_interceptor2 = _interopRequireDefault(_playback_interceptor);

var _socket = require("./socket");

var _socket2 = _interopRequireDefault(_socket);

var _global_emitter = require("./global_emitter");

var _global_emitter2 = _interopRequireDefault(_global_emitter);

var _common = require("./common");

var _common2 = _interopRequireDefault(_common);

var _propagate = require("propagate");

var _propagate2 = _interopRequireDefault(_propagate);

var _https = require("https");

var _https2 = _interopRequireDefault(_https);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var debug = (0, _debug2.default)('nock.request_overrider');
var IncomingMessage = _http2.default.IncomingMessage,
    ClientRequest = _http2.default.ClientRequest,
    originalHttpRequest = _http2.default.request;
var originalHttpsRequest = _https2.default.request;

var propagate = _propagate2.default;
var common = _common2.default;
var globalEmitter = _global_emitter2.default;
var Socket = _socket2.default;
var playbackInterceptor = _playback_interceptor2.default.playbackInterceptor;


function socketOnClose(req) {
  debug('socket close');

  if (!req.res && !req.socket._hadError) {
    // If we don't have a response then we know that the socket
    // ended prematurely and we need to emit an error on the request.
    req.socket._hadError = true;
    var err = new Error('socket hang up');
    err.code = 'ECONNRESET';
    req.emit('error', err);
  }
  req.emit('close');
}

/**
 * Given a group of interceptors, appropriately route an outgoing request.
 * Identify which interceptor ought to respond, if any, then delegate to
 * `playbackInterceptor()` to consume the request itself.
 */

var InterceptedRequestRouter = function () {
  function InterceptedRequestRouter(_ref) {
    var _this = this;

    var req = _ref.req,
        options = _ref.options,
        interceptors = _ref.interceptors;
    (0, _classCallCheck3.default)(this, InterceptedRequestRouter);

    this.req = req;
    this.options = (0, _extends3.default)({}, options, {
      // We use lower-case header field names throughout Nock.
      headers: common.headersFieldNamesToLowerCase(options.headers || {})
    });
    this.interceptors = interceptors;

    this.socket = new Socket(options);

    // support setting `timeout` using request `options`
    // https://nodejs.org/docs/latest-v12.x/api/http.html#http_http_request_url_options_callback
    if (options.timeout) {
      this.socket.setTimeout(options.timeout);
    }

    this.response = new IncomingMessage(this.socket);
    this.requestBodyBuffers = [];
    this.playbackStarted = false;

    // For parity with Node, it's important the socket event is emitted before we begin playback.
    // This flag is set when playback is triggered if we haven't yet gotten the
    // socket event to indicate that playback should start as soon as it comes in.
    this.readyToStartPlaybackOnSocketEvent = false;

    this.attachToReq();

    // Emit a fake socket event on the next tick to mimic what would happen on a real request.
    // Some clients listen for a 'socket' event to be emitted before calling end(),
    // which causes Nock to hang.
    process.nextTick(function () {
      return _this.connectSocket();
    });
  }

  (0, _createClass3.default)(InterceptedRequestRouter, [{
    key: "attachToReq",
    value: function attachToReq() {
      var _this2 = this;

      var req = this.req,
          options = this.options;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {

        for (var _iterator = (0, _getIterator3.default)((0, _entries2.default)(options.headers)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ref2 = _step.value;

          var _ref3 = (0, _slicedToArray3.default)(_ref2, 2);

          var name = _ref3[0];
          var val = _ref3[1];

          req.setHeader(name.toLowerCase(), val);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (options.auth && !options.headers.authorization) {
        req.setHeader(
        // We use lower-case header field names throughout Nock.
        'authorization', "Basic " + Buffer.from(options.auth).toString('base64'));
      }

      req.path = options.path;
      req.method = options.method;

      req.write = function () {
        return _this2.handleWrite.apply(_this2, arguments);
      };
      req.end = function () {
        return _this2.handleEnd.apply(_this2, arguments);
      };
      req.flushHeaders = function () {
        return _this2.handleFlushHeaders.apply(_this2, arguments);
      };

      // https://github.com/nock/nock/issues/256
      if (options.headers.expect === '100-continue') {
        common.setImmediate(function () {
          debug('continue');
          req.emit('continue');
        });
      }
    }
  }, {
    key: "connectSocket",
    value: function connectSocket() {
      var req = this.req,
          socket = this.socket;


      if (common.isRequestDestroyed(req)) {
        return;
      }

      // ClientRequest.connection is an alias for ClientRequest.socket
      // https://nodejs.org/api/http.html#http_request_socket
      // https://github.com/nodejs/node/blob/b0f75818f39ed4e6bd80eb7c4010c1daf5823ef7/lib/_http_client.js#L640-L641
      // The same Socket is shared between the request and response to mimic native behavior.
      req.socket = req.connection = socket;

      propagate(['error', 'timeout'], socket, req);
      socket.on('close', function () {
        return socketOnClose(req);
      });

      socket.connecting = false;
      req.emit('socket', socket);

      // https://nodejs.org/api/net.html#net_event_connect
      socket.emit('connect');

      // https://nodejs.org/api/tls.html#tls_event_secureconnect
      if (socket.authorized) {
        socket.emit('secureConnect');
      }

      if (this.readyToStartPlaybackOnSocketEvent) {
        this.maybeStartPlayback();
      }
    }

    // from docs: When write function is called with empty string or buffer, it does nothing and waits for more input.
    // However, actually implementation checks the state of finished and aborted before checking if the first arg is empty.

  }, {
    key: "handleWrite",
    value: function handleWrite(buffer, encoding, callback) {
      debug('request write');
      var req = this.req;


      if (req.finished) {
        var err = new Error('write after end');
        err.code = 'ERR_STREAM_WRITE_AFTER_END';
        process.nextTick(function () {
          return req.emit('error', err);
        });

        // It seems odd to return `true` here, not sure why you'd want to have
        // the stream potentially written to more, but it's what Node does.
        // https://github.com/nodejs/node/blob/a9270dcbeba4316b1e179b77ecb6c46af5aa8c20/lib/_http_outgoing.js#L662-L665
        return true;
      }

      if (req.socket && req.socket.destroyed) {
        return false;
      }

      if (!buffer || buffer.length === 0) {
        return true;
      }

      if (!Buffer.isBuffer(buffer)) {
        buffer = Buffer.from(buffer, encoding);
      }
      this.requestBodyBuffers.push(buffer);

      // can't use instanceof Function because some test runners
      // run tests in vm.runInNewContext where Function is not same
      // as that in the current context
      // https://github.com/nock/nock/pull/1754#issuecomment-571531407
      if (typeof callback === 'function') {
        callback();
      }

      common.setImmediate(function () {
        req.emit('drain');
      });

      return false;
    }
  }, {
    key: "handleEnd",
    value: function handleEnd(chunk, encoding, callback) {
      debug('request end');
      var req = this.req;

      // handle the different overloaded arg signatures

      if (typeof chunk === 'function') {
        callback = chunk;
        chunk = null;
      } else if (typeof encoding === 'function') {
        callback = encoding;
        encoding = null;
      }

      if (typeof callback === 'function') {
        req.once('finish', callback);
      }

      if (chunk) {
        req.write(chunk, encoding);
      }
      req.finished = true;
      this.maybeStartPlayback();

      return req;
    }
  }, {
    key: "handleFlushHeaders",
    value: function handleFlushHeaders() {
      debug('request flushHeaders');
      this.maybeStartPlayback();
    }

    /**
     * Set request headers of the given request. This is needed both during the
     * routing phase, in case header filters were specified, and during the
     * interceptor-playback phase, to correctly pass mocked request headers.
     * TODO There are some problems with this; see https://github.com/nock/nock/issues/1718
     */

  }, {
    key: "setHostHeaderUsingInterceptor",
    value: function setHostHeaderUsingInterceptor(interceptor) {
      var req = this.req,
          options = this.options;

      // If a filtered scope is being used we have to use scope's host in the
      // header, otherwise 'host' header won't match.
      // NOTE: We use lower-case header field names throughout Nock.

      var HOST_HEADER = 'host';
      if (interceptor.__nock_filteredScope && interceptor.__nock_scopeHost) {
        options.headers[HOST_HEADER] = interceptor.__nock_scopeHost;
        req.setHeader(HOST_HEADER, interceptor.__nock_scopeHost);
      } else {
        // For all other cases, we always add host header equal to the requested
        // host unless it was already defined.
        if (options.host && !req.getHeader(HOST_HEADER)) {
          var hostHeader = options.host;

          if (options.port === 80 || options.port === 443) {
            hostHeader = hostHeader.split(':')[0];
          }

          req.setHeader(HOST_HEADER, hostHeader);
        }
      }
    }
  }, {
    key: "maybeStartPlayback",
    value: function maybeStartPlayback() {
      var req = this.req,
          socket = this.socket,
          playbackStarted = this.playbackStarted;

      // In order to get the events in the right order we need to delay playback
      // if we get here before the `socket` event is emitted.

      if (socket.connecting) {
        this.readyToStartPlaybackOnSocketEvent = true;
        return;
      }

      if (!common.isRequestDestroyed(req) && !playbackStarted) {
        this.startPlayback();
      }
    }
  }, {
    key: "startPlayback",
    value: function startPlayback() {
      var _this3 = this;

      debug('ending');
      this.playbackStarted = true;

      var req = this.req,
          response = this.response,
          socket = this.socket,
          options = this.options,
          interceptors = this.interceptors;


      (0, _assign2.default)(options, {
        // Re-update `options` with the current value of `req.path` because badly
        // behaving agents like superagent like to change `req.path` mid-flight.
        path: req.path,
        // Similarly, node-http-proxy will modify headers in flight, so we have
        // to put the headers back into options.
        // https://github.com/nock/nock/pull/1484
        headers: req.getHeaders(),
        // Fixes https://github.com/nock/nock/issues/976
        protocol: options.proto + ":"
      });

      interceptors.forEach(function (interceptor) {
        _this3.setHostHeaderUsingInterceptor(interceptor);
      });

      var requestBodyBuffer = Buffer.concat(this.requestBodyBuffers);
      // When request body is a binary buffer we internally use in its hexadecimal
      // representation.
      var requestBodyIsUtf8Representable = common.isUtf8Representable(requestBodyBuffer);
      var requestBodyString = requestBodyBuffer.toString(requestBodyIsUtf8Representable ? 'utf8' : 'hex');

      var matchedInterceptor = interceptors.find(function (i) {
        return i.match(req, options, requestBodyString);
      });

      if (matchedInterceptor) {
        matchedInterceptor.scope.logger('interceptor identified, starting mocking');

        matchedInterceptor.markConsumed();

        // wait to emit the finish event until we know for sure an Interceptor is going to playback.
        // otherwise an unmocked request might emit finish twice.
        req.emit('finish');

        playbackInterceptor({
          req: req,
          socket: socket,
          options: options,
          requestBodyString: requestBodyString,
          requestBodyIsUtf8Representable: requestBodyIsUtf8Representable,
          response: response,
          interceptor: matchedInterceptor
        });
      } else {
        globalEmitter.emit('no match', req, options, requestBodyString);

        // Try to find a hostname match that allows unmocked.
        var allowUnmocked = interceptors.some(function (i) {
          return i.matchHostName(options) && i.options.allowUnmocked;
        });

        if (allowUnmocked && req instanceof ClientRequest) {
          var newReq = options.proto === 'https' ? originalHttpsRequest(options) : originalHttpRequest(options);

          propagate(newReq, req);
          // We send the raw buffer as we received it, not as we interpreted it.
          newReq.end(requestBodyBuffer);
        } else {
          var reqStr = common.stringifyRequest(options, requestBodyString);
          var err = new Error("Nock: No match for request " + reqStr);
          err.code = 'ERR_NOCK_NO_MATCH';
          err.statusCode = err.status = 404;
          req.destroy(err);
        }
      }
    }
  }]);
  return InterceptedRequestRouter;
}();

mod_intercepted_request_routerjs = { InterceptedRequestRouter: InterceptedRequestRouter };
var mod_intercepted_request_routerjs;
exports.default = mod_intercepted_request_routerjs;
module.exports = exports.default;