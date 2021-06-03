"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

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

var _set = require("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _isInteger = require("babel-runtime/core-js/number/is-integer");

var _isInteger2 = _interopRequireDefault(_isInteger);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _common = require("./common");

var _common2 = _interopRequireDefault(_common);

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

var _zlib = require("zlib");

var _zlib2 = _interopRequireDefault(_zlib);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

var _stream = require("stream");

var _stream2 = _interopRequireDefault(_stream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var stream = _stream2.default;
var util = _util2.default;
var zlib = _zlib2.default;
var debug = (0, _debug2.default)('nock.playback_interceptor');
var common = _common2.default;

function parseJSONRequestBody(req, requestBody) {
  if (!requestBody || !common.isJSONContent(req.headers)) {
    return requestBody;
  }

  if (common.contentEncoding(req.headers, 'gzip')) {
    requestBody = String(zlib.gunzipSync(Buffer.from(requestBody, 'hex')));
  } else if (common.contentEncoding(req.headers, 'deflate')) {
    requestBody = String(zlib.inflateSync(Buffer.from(requestBody, 'hex')));
  }

  return JSON.parse(requestBody);
}

function parseFullReplyResult(response, fullReplyResult) {
  var _response$rawHeaders;

  debug('full response from callback result: %j', fullReplyResult);

  if (!Array.isArray(fullReplyResult)) {
    throw Error('A single function provided to .reply MUST return an array');
  }

  if (fullReplyResult.length > 3) {
    throw Error('The array returned from the .reply callback contains too many values');
  }

  var _fullReplyResult = (0, _slicedToArray3.default)(fullReplyResult, 3),
      status = _fullReplyResult[0],
      _fullReplyResult$ = _fullReplyResult[1],
      body = _fullReplyResult$ === undefined ? '' : _fullReplyResult$,
      headers = _fullReplyResult[2];

  if (!(0, _isInteger2.default)(status)) {
    throw new Error("Invalid " + (typeof status === "undefined" ? "undefined" : (0, _typeof3.default)(status)) + " value for status code");
  }

  response.statusCode = status;
  (_response$rawHeaders = response.rawHeaders).push.apply(_response$rawHeaders, (0, _toConsumableArray3.default)(common.headersInputToRawArray(headers)));
  debug('response.rawHeaders after reply: %j', response.rawHeaders);

  return body;
}

/**
 * Determine which of the default headers should be added to the response.
 *
 * Don't include any defaults whose case-insensitive keys are already on the response.
 */
function selectDefaultHeaders(existingHeaders, defaultHeaders) {
  if (!defaultHeaders.length) {
    return []; // return early if we don't need to bother
  }

  var definedHeaders = new _set2.default();
  var result = [];

  common.forEachHeader(existingHeaders, function (_, fieldName) {
    definedHeaders.add(fieldName.toLowerCase());
  });
  common.forEachHeader(defaultHeaders, function (value, fieldName) {
    if (!definedHeaders.has(fieldName.toLowerCase())) {
      result.push(fieldName, value);
    }
  });

  return result;
}

// Presents a list of Buffers as a Readable

var ReadableBuffers = function (_stream$Readable) {
  (0, _inherits3.default)(ReadableBuffers, _stream$Readable);

  function ReadableBuffers(buffers) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, ReadableBuffers);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ReadableBuffers.__proto__ || (0, _getPrototypeOf2.default)(ReadableBuffers)).call(this, opts));

    _this.buffers = buffers;
    return _this;
  }

  (0, _createClass3.default)(ReadableBuffers, [{
    key: "_read",
    value: function _read(size) {
      while (this.buffers.length) {
        if (!this.push(this.buffers.shift())) {
          return;
        }
      }
      this.push(null);
    }
  }]);
  return ReadableBuffers;
}(stream.Readable);

function convertBodyToStream(body) {
  if (common.isStream(body)) {
    return body;
  }

  if (body === undefined) {
    return new ReadableBuffers([]);
  }

  if (Buffer.isBuffer(body)) {
    return new ReadableBuffers([body]);
  }

  if (typeof body !== 'string') {
    body = (0, _stringify2.default)(body);
  }

  return new ReadableBuffers([Buffer.from(body)]);
}

/**
 * Play back an interceptor using the given request and mock response.
 */
function playbackInterceptor(_ref) {
  var req = _ref.req,
      socket = _ref.socket,
      options = _ref.options,
      requestBodyString = _ref.requestBodyString,
      requestBodyIsUtf8Representable = _ref.requestBodyIsUtf8Representable,
      response = _ref.response,
      interceptor = _ref.interceptor;
  var logger = interceptor.scope.logger;


  function start() {
    req.headers = req.getHeaders();

    interceptor.scope.emit('request', req, interceptor, requestBodyString);

    if (typeof interceptor.errorMessage !== 'undefined') {
      var error = void 0;
      if ((0, _typeof3.default)(interceptor.errorMessage) === 'object') {
        error = interceptor.errorMessage;
      } else {
        error = new Error(interceptor.errorMessage);
      }

      var delay = interceptor.delayBodyInMs + interceptor.delayConnectionInMs;
      common.setTimeout(function () {
        return req.destroy(error);
      }, delay);
      return;
    }

    // This will be null if we have a fullReplyFunction,
    // in that case status code will be set in `parseFullReplyResult`
    response.statusCode = interceptor.statusCode;

    // Clone headers/rawHeaders to not override them when evaluating later
    response.rawHeaders = [].concat((0, _toConsumableArray3.default)(interceptor.rawHeaders));
    logger('response.rawHeaders:', response.rawHeaders);

    // TODO: MAJOR: Don't tack the request onto the interceptor.
    // The only reason we do this is so that it's available inside reply functions.
    // It would be better to pass the request as an argument to the functions instead.
    // Not adding the req as a third arg now because it should first be decided if (path, body, req)
    // is the signature we want to go with going forward.
    interceptor.req = req;

    if (interceptor.replyFunction) {
      var parsedRequestBody = parseJSONRequestBody(req, requestBodyString);

      var fn = interceptor.replyFunction;
      if (fn.length === 3) {
        // Handle the case of an async reply function, the third parameter being the callback.
        fn = util.promisify(fn);
      }

      // At this point `fn` is either a synchronous function or a promise-returning function;
      // wrapping in `Promise.resolve` makes it into a promise either way.
      _promise2.default.resolve(fn.call(interceptor, options.path, parsedRequestBody)).then(continueWithResponseBody).catch(function (err) {
        return req.destroy(err);
      });
      return;
    }

    if (interceptor.fullReplyFunction) {
      var _parsedRequestBody = parseJSONRequestBody(req, requestBodyString);

      var _fn = interceptor.fullReplyFunction;
      if (_fn.length === 3) {
        _fn = util.promisify(_fn);
      }

      _promise2.default.resolve(_fn.call(interceptor, options.path, _parsedRequestBody)).then(continueWithFullResponse).catch(function (err) {
        return req.destroy(err);
      });
      return;
    }

    if (common.isContentEncoded(interceptor.headers) && !common.isStream(interceptor.body)) {
      //  If the content is encoded we know that the response body *must* be an array
      //  of response buffers which should be mocked one by one.
      //  (otherwise decompressions after the first one fails as unzip expects to receive
      //  buffer by buffer and not one single merged buffer)
      var bufferData = Array.isArray(interceptor.body) ? interceptor.body : [interceptor.body];
      var responseBuffers = bufferData.map(function (data) {
        return Buffer.from(data, 'hex');
      });
      var _responseBody = new ReadableBuffers(responseBuffers);
      continueWithResponseBody(_responseBody);
      return;
    }

    // If we get to this point, the body is either a string or an object that
    // will eventually be JSON stringified.
    var responseBody = interceptor.body;

    // If the request was not UTF8-representable then we assume that the
    // response won't be either. In that case we send the response as a Buffer
    // object as that's what the client will expect.
    if (!requestBodyIsUtf8Representable && typeof responseBody === 'string') {
      // Try to create the buffer from the interceptor's body response as hex.
      responseBody = Buffer.from(responseBody, 'hex');

      // Creating buffers does not necessarily throw errors; check for difference in size.
      if (!responseBody || interceptor.body.length > 0 && responseBody.length === 0) {
        // We fallback on constructing buffer from utf8 representation of the body.
        responseBody = Buffer.from(interceptor.body, 'utf8');
      }
    }

    return continueWithResponseBody(responseBody);
  }

  function continueWithFullResponse(fullReplyResult) {
    var responseBody = void 0;
    try {
      responseBody = parseFullReplyResult(response, fullReplyResult);
    } catch (err) {
      req.destroy(err);
      return;
    }

    continueWithResponseBody(responseBody);
  }

  function prepareResponseHeaders(body) {
    var _response$rawHeaders2;

    var defaultHeaders = [].concat((0, _toConsumableArray3.default)(interceptor.scope._defaultReplyHeaders));

    // Include a JSON content type when JSON.stringify is called on the body.
    // This is a convenience added by Nock that has no analog in Node. It's added to the
    // defaults, so it will be ignored if the caller explicitly provided the header already.
    var isJSON = body !== undefined && typeof body !== 'string' && !Buffer.isBuffer(body) && !common.isStream(body);

    if (isJSON) {
      defaultHeaders.push('Content-Type', 'application/json');
    }

    (_response$rawHeaders2 = response.rawHeaders).push.apply(_response$rawHeaders2, (0, _toConsumableArray3.default)(selectDefaultHeaders(response.rawHeaders, defaultHeaders)));

    // Evaluate functional headers.
    common.forEachHeader(response.rawHeaders, function (value, fieldName, i) {
      if (typeof value === 'function') {
        response.rawHeaders[i + 1] = value(req, response, body);
      }
    });

    response.headers = common.headersArrayToObject(response.rawHeaders);
  }

  function continueWithResponseBody(rawBody) {
    prepareResponseHeaders(rawBody);
    var bodyAsStream = convertBodyToStream(rawBody);
    bodyAsStream.pause();

    // IncomingMessage extends Readable so we can't simply pipe.
    bodyAsStream.on('data', function (chunk) {
      response.push(chunk);
    });
    bodyAsStream.on('end', function () {
      // https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_message_complete
      response.complete = true;
      response.push(null);

      interceptor.scope.emit('replied', req, interceptor);
    });
    bodyAsStream.on('error', function (err) {
      response.emit('error', err);
    });

    var delayBodyInMs = interceptor.delayBodyInMs,
        delayConnectionInMs = interceptor.delayConnectionInMs;


    function respond() {
      if (common.isRequestDestroyed(req)) {
        return;
      }

      // Even though we've had the response object for awhile at this point,
      // we only attach it to the request immediately before the `response`
      // event because, as in Node, it alters the error handling around aborts.
      req.res = response;
      response.req = req;

      logger('emitting response');
      req.emit('response', response);

      common.setTimeout(function () {
        return bodyAsStream.resume();
      }, delayBodyInMs);
    }

    socket.applyDelay(delayConnectionInMs);
    common.setTimeout(respond, delayConnectionInMs);
  }

  // Calling `start` immediately could take the request all the way to the connection delay
  // during a single microtask execution. This setImmediate stalls the playback to ensure the
  // correct events are emitted first ('socket', 'finish') and any aborts in the in the queue or
  // called during a 'finish' listener can be called.
  common.setImmediate(function () {
    if (!common.isRequestDestroyed(req)) {
      start();
    }
  });
}

mod_playback_interceptorjs = { playbackInterceptor: playbackInterceptor };
var mod_playback_interceptorjs;
exports.default = mod_playback_interceptorjs;
module.exports = exports.default;