"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _clearImmediate2 = require("babel-runtime/core-js/clear-immediate");

var _clearImmediate3 = _interopRequireDefault(_clearImmediate2);

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _from = require("babel-runtime/core-js/array/from");

var _from2 = _interopRequireDefault(_from);

var _set = require("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require("babel-runtime/core-js/object/entries");

var _entries2 = _interopRequireDefault(_entries);

var _https = require("https");

var _https2 = _interopRequireDefault(_https);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _timers = require("timers");

var _timers2 = _interopRequireDefault(_timers);

var _lodash = require("lodash.set");

var _lodash2 = _interopRequireDefault(_lodash);

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var debug = (0, _debug2.default)('nock.common');
var set = _lodash2.default;
var timers = _timers2.default;
var url = _url2.default;
var util = _util2.default;

/**
 * Normalizes the request options so that it always has `host` property.
 *
 * @param  {Object} options - a parsed options object of the request
 */
function normalizeRequestOptions(options) {
  options.proto = options.proto || 'http';
  options.port = options.port || (options.proto === 'http' ? 80 : 443);
  if (options.host) {
    debug('options.host:', options.host);
    if (!options.hostname) {
      if (options.host.split(':').length === 2) {
        options.hostname = options.host.split(':')[0];
      } else {
        options.hostname = options.host;
      }
    }
  }
  debug('options.hostname in the end: %j', options.hostname);
  options.host = (options.hostname || 'localhost') + ":" + options.port;
  debug('options.host in the end: %j', options.host)

  /// lowercase host names
  ;['hostname', 'host'].forEach(function (attr) {
    if (options[attr]) {
      options[attr] = options[attr].toLowerCase();
    }
  });

  return options;
}

/**
 * Returns true if the data contained in buffer can be reconstructed
 * from its utf8 representation.
 *
 * @param  {Object} buffer - a Buffer object
 * @returns {boolean}
 */
function isUtf8Representable(buffer) {
  var utfEncodedBuffer = buffer.toString('utf8');
  var reconstructedBuffer = Buffer.from(utfEncodedBuffer, 'utf8');
  return reconstructedBuffer.equals(buffer);
}

//  Array where all information about all the overridden requests are held.
var requestOverrides = {};

/**
 * Overrides the current `request` function of `http` and `https` modules with
 * our own version which intercepts issues HTTP/HTTPS requests and forwards them
 * to the given `newRequest` function.
 *
 * @param  {Function} newRequest - a function handling requests; it accepts four arguments:
 *   - proto - a string with the overridden module's protocol name (either `http` or `https`)
 *   - overriddenRequest - the overridden module's request function already bound to module's object
 *   - options - the options of the issued request
 *   - callback - the callback of the issued request
 */
function overrideRequests(newRequest) {
  debug('overriding requests');['http', 'https'].forEach(function (proto) {
    debug('- overriding request for', proto);

    var moduleName = proto; // 1 to 1 match of protocol and module is fortunate :)
    var module = {
      http: _http2.default,
      https: _https2.default
    }[moduleName];
    var overriddenRequest = module.request;
    var overriddenGet = module.get;

    if (requestOverrides[moduleName]) {
      throw new Error("Module's request already overridden for " + moduleName + " protocol.");
    }

    //  Store the properties of the overridden request so that it can be restored later on.
    requestOverrides[moduleName] = {
      module: module,
      request: overriddenRequest,
      get: overriddenGet
      // https://nodejs.org/api/http.html#http_http_request_url_options_callback
    };module.request = function (input, options, callback) {
      return newRequest(proto, overriddenRequest.bind(module), [input, options, callback]);
    };
    // https://nodejs.org/api/http.html#http_http_get_options_callback
    module.get = function (input, options, callback) {
      var req = newRequest(proto, overriddenGet.bind(module), [input, options, callback]);
      req.end();
      return req;
    };

    debug('- overridden request for', proto);
  });
}

/**
 * Restores `request` function of `http` and `https` modules to values they
 * held before they were overridden by us.
 */
function restoreOverriddenRequests() {
  debug('restoring requests');
  (0, _entries2.default)(requestOverrides).forEach(function (_ref) {
    var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
        proto = _ref2[0],
        _ref2$ = _ref2[1],
        module = _ref2$.module,
        request = _ref2$.request,
        get = _ref2$.get;

    debug('- restoring request for', proto);
    module.request = request;
    module.get = get;
    debug('- restored request for', proto);
  });
  requestOverrides = {};
}

/**
 * In WHATWG URL vernacular, this returns the origin portion of a URL.
 * However, the port is not included if it's standard and not already present on the host.
 */
function normalizeOrigin(proto, host, port) {
  var hostHasPort = host.includes(':');
  var portIsStandard = proto === 'http' && (port === 80 || port === '80') || proto === 'https' && (port === 443 || port === '443');
  var portStr = hostHasPort || portIsStandard ? '' : ":" + port;

  return proto + "://" + host + portStr;
}

/**
 * Get high level information about request as string
 * @param  {Object} options
 * @param  {string} options.method
 * @param  {number|string} options.port
 * @param  {string} options.proto Set internally. always http or https
 * @param  {string} options.hostname
 * @param  {string} options.path
 * @param  {Object} options.headers
 * @param  {string} body
 * @return {string}
 */
function stringifyRequest(options, body) {
  var _options$method = options.method,
      method = _options$method === undefined ? 'GET' : _options$method,
      _options$path = options.path,
      path = _options$path === undefined ? '' : _options$path,
      port = options.port;

  var origin = normalizeOrigin(options.proto, options.hostname, port);

  var log = {
    method: method,
    url: "" + origin + path,
    headers: options.headers
  };

  if (body) {
    log.body = body;
  }

  return (0, _stringify2.default)(log, null, 2);
}

function isContentEncoded(headers) {
  var contentEncoding = headers['content-encoding'];
  return typeof contentEncoding === 'string' && contentEncoding !== '';
}

function contentEncoding(headers, encoder) {
  var contentEncoding = headers['content-encoding'];
  return contentEncoding !== undefined && contentEncoding.toString() === encoder;
}

function isJSONContent(headers) {
  // https://tools.ietf.org/html/rfc8259
  var contentType = String(headers['content-type'] || '').toLowerCase();
  return contentType.startsWith('application/json');
}

/**
 * Return a new object with all field names of the headers lower-cased.
 *
 * Duplicates throw an error.
 */
function headersFieldNamesToLowerCase(headers) {
  if (!isPlainObject(headers)) {
    throw Error('Headers must be provided as an object');
  }

  var lowerCaseHeaders = {};
  (0, _entries2.default)(headers).forEach(function (_ref3) {
    var _ref4 = (0, _slicedToArray3.default)(_ref3, 2),
        fieldName = _ref4[0],
        fieldValue = _ref4[1];

    var key = fieldName.toLowerCase();
    if (lowerCaseHeaders[key] !== undefined) {
      throw Error("Failed to convert header keys to lower case due to field name conflict: " + key);
    }
    lowerCaseHeaders[key] = fieldValue;
  });

  return lowerCaseHeaders;
}

var headersFieldsArrayToLowerCase = function headersFieldsArrayToLowerCase(headers) {
  return [].concat((0, _toConsumableArray3.default)(new _set2.default(headers.map(function (fieldName) {
    return fieldName.toLowerCase();
  }))));
};

/**
 * Converts the various accepted formats of headers into a flat array representing "raw headers".
 *
 * Nock allows headers to be provided as a raw array, a plain object, or a Map.
 *
 * While all the header names are expected to be strings, the values are left intact as they can
 * be functions, strings, or arrays of strings.
 *
 *  https://nodejs.org/api/http.html#http_message_rawheaders
 */
function headersInputToRawArray(headers) {
  if (headers === undefined) {
    return [];
  }

  if (Array.isArray(headers)) {
    // If the input is an array, assume it's already in the raw format and simply return a copy
    // but throw an error if there aren't an even number of items in the array
    if (headers.length % 2) {
      throw new Error("Raw headers must be provided as an array with an even number of items. [fieldName, value, ...]");
    }
    return [].concat((0, _toConsumableArray3.default)(headers));
  }

  // [].concat(...) is used instead of Array.flat until v11 is the minimum Node version
  if (util.types.isMap(headers)) {
    var _ref5;

    return (_ref5 = []).concat.apply(_ref5, (0, _toConsumableArray3.default)((0, _from2.default)(headers, function (_ref6) {
      var _ref7 = (0, _slicedToArray3.default)(_ref6, 2),
          k = _ref7[0],
          v = _ref7[1];

      return [k.toString(), v];
    })));
  }

  if (isPlainObject(headers)) {
    var _ref8;

    return (_ref8 = []).concat.apply(_ref8, (0, _toConsumableArray3.default)((0, _entries2.default)(headers)));
  }

  throw new Error("Headers must be provided as an array of raw values, a Map, or a plain Object. " + headers);
}

/**
 * Converts an array of raw headers to an object, using the same rules as Nodes `http.IncomingMessage.headers`.
 *
 * Header names/keys are lower-cased.
 */
function headersArrayToObject(rawHeaders) {
  if (!Array.isArray(rawHeaders)) {
    throw Error('Expected a header array');
  }

  var accumulator = {};

  forEachHeader(rawHeaders, function (value, fieldName) {
    addHeaderLine(accumulator, fieldName, value);
  });

  return accumulator;
}

var noDuplicatesHeaders = new _set2.default(['age', 'authorization', 'content-length', 'content-type', 'etag', 'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since', 'last-modified', 'location', 'max-forwards', 'proxy-authorization', 'referer', 'retry-after', 'user-agent']);

/**
 * Set key/value data in accordance with Node's logic for folding duplicate headers.
 *
 * The `value` param should be a function, string, or array of strings.
 *
 * Node's docs and source:
 * https://nodejs.org/api/http.html#http_message_headers
 * https://github.com/nodejs/node/blob/908292cf1f551c614a733d858528ffb13fb3a524/lib/_http_incoming.js#L245
 *
 * Header names are lower-cased.
 * Duplicates in raw headers are handled in the following ways, depending on the header name:
 * - Duplicates of field names listed in `noDuplicatesHeaders` (above) are discarded.
 * - `set-cookie` is always an array. Duplicates are added to the array.
 * - For duplicate `cookie` headers, the values are joined together with '; '.
 * - For all other headers, the values are joined together with ', '.
 *
 * Node's implementation is larger because it highly optimizes for not having to call `toLowerCase()`.
 * We've opted to always call `toLowerCase` in exchange for a more concise function.
 *
 * While Node has the luxury of knowing `value` is always a string, we do an extra step of coercion at the top.
 */
function addHeaderLine(headers, name, value) {
  var values = void 0; // code below expects `values` to be an array of strings
  if (typeof value === 'function') {
    // Function values are evaluated towards the end of the response, before that we use a placeholder
    // string just to designate that the header exists. Useful when `Content-Type` is set with a function.
    values = [value.name];
  } else if (Array.isArray(value)) {
    values = value.map(String);
  } else {
    values = [String(value)];
  }

  var key = name.toLowerCase();
  if (key === 'set-cookie') {
    // Array header -- only Set-Cookie at the moment
    if (headers['set-cookie'] === undefined) {
      headers['set-cookie'] = values;
    } else {
      var _headers$setCookie;

      (_headers$setCookie = headers['set-cookie']).push.apply(_headers$setCookie, (0, _toConsumableArray3.default)(values));
    }
  } else if (noDuplicatesHeaders.has(key)) {
    if (headers[key] === undefined) {
      // Drop duplicates
      headers[key] = values[0];
    }
  } else {
    if (headers[key] !== undefined) {
      values = [headers[key]].concat((0, _toConsumableArray3.default)(values));
    }

    var separator = key === 'cookie' ? '; ' : ', ';
    headers[key] = values.join(separator);
  }
}

/**
 * Deletes the given `fieldName` property from `headers` object by performing
 * case-insensitive search through keys.
 *
 * @headers   {Object} headers - object of header field names and values
 * @fieldName {String} field name - string with the case-insensitive field name
 */
function deleteHeadersField(headers, fieldNameToDelete) {
  if (!isPlainObject(headers)) {
    throw Error('headers must be an object');
  }

  if (typeof fieldNameToDelete !== 'string') {
    throw Error('field name must be a string');
  }

  var lowerCaseFieldNameToDelete = fieldNameToDelete.toLowerCase();

  // Search through the headers and delete all values whose field name matches the given field name.
  (0, _keys2.default)(headers).filter(function (fieldName) {
    return fieldName.toLowerCase() === lowerCaseFieldNameToDelete;
  }).forEach(function (fieldName) {
    return delete headers[fieldName];
  });
}

/**
 * Utility for iterating over a raw headers array.
 *
 * The callback is called with:
 *  - The header value. string, array of strings, or a function
 *  - The header field name. string
 *  - Index of the header field in the raw header array.
 */
function forEachHeader(rawHeaders, callback) {
  for (var i = 0; i < rawHeaders.length; i += 2) {
    callback(rawHeaders[i + 1], rawHeaders[i], i);
  }
}

function percentDecode(str) {
  try {
    return decodeURIComponent(str.replace(/\+/g, ' '));
  } catch (e) {
    return str;
  }
}

/**
 * URI encode the provided string, stringently adhering to RFC 3986.
 *
 * RFC 3986 reserves !, ', (, ), and * but encodeURIComponent does not encode them so we do it manually.
 *
 * https://tools.ietf.org/html/rfc3986
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
 */
function percentEncode(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

function matchStringOrRegexp(target, pattern) {
  var targetStr = target === undefined || target === null ? '' : String(target);

  if (pattern instanceof RegExp) {
    // if the regexp happens to have a global flag, we want to ensure we test the entire target
    pattern.lastIndex = 0;
    return pattern.test(targetStr);
  }
  return targetStr === String(pattern);
}

/**
 * Formats a query parameter.
 *
 * @param key                The key of the query parameter to format.
 * @param value              The value of the query parameter to format.
 * @param stringFormattingFn The function used to format string values. Can
 *                           be used to encode or decode the query value.
 *
 * @returns *[] the formatted [key, value] pair.
 */
function formatQueryValue(key, value, stringFormattingFn) {
  // TODO: Probably refactor code to replace `switch(true)` with `if`/`else`.
  switch (true) {
    case typeof value === 'number': // fall-through
    case typeof value === 'boolean':
      value = value.toString();
      break;
    case value === null:
    case value === undefined:
      value = '';
      break;
    case typeof value === 'string':
      if (stringFormattingFn) {
        value = stringFormattingFn(value);
      }
      break;
    case value instanceof RegExp:
      break;
    case Array.isArray(value):
      {
        value = value.map(function (val, idx) {
          return formatQueryValue(idx, val, stringFormattingFn)[1];
        });
        break;
      }
    case (typeof value === "undefined" ? "undefined" : (0, _typeof3.default)(value)) === 'object':
      {
        value = (0, _entries2.default)(value).reduce(function (acc, _ref9) {
          var _ref10 = (0, _slicedToArray3.default)(_ref9, 2),
              subKey = _ref10[0],
              subVal = _ref10[1];

          var subPair = formatQueryValue(subKey, subVal, stringFormattingFn);
          acc[subPair[0]] = subPair[1];

          return acc;
        }, {});
        break;
      }
  }

  if (stringFormattingFn) key = stringFormattingFn(key);
  return [key, value];
}

function isStream(obj) {
  return obj && typeof obj !== 'string' && !Buffer.isBuffer(obj) && typeof obj.setEncoding === 'function';
}

/**
 * Converts the arguments from the various signatures of http[s].request into a standard
 * options object and an optional callback function.
 *
 * https://nodejs.org/api/http.html#http_http_request_url_options_callback
 *
 * Taken from the beginning of the native `ClientRequest`.
 * https://github.com/nodejs/node/blob/908292cf1f551c614a733d858528ffb13fb3a524/lib/_http_client.js#L68
 */
function normalizeClientRequestArgs(input, options, cb) {
  if (typeof input === 'string') {
    input = urlToOptions(new url.URL(input));
  } else if (input instanceof url.URL) {
    input = urlToOptions(input);
  } else {
    cb = options;
    options = input;
    input = null;
  }

  if (typeof options === 'function') {
    cb = options;
    options = input || {};
  } else {
    options = (0, _assign2.default)(input || {}, options);
  }

  return { options: options, callback: cb };
}

/**
 * Utility function that converts a URL object into an ordinary
 * options object as expected by the http.request and https.request APIs.
 *
 * This was copied from Node's source
 * https://github.com/nodejs/node/blob/908292cf1f551c614a733d858528ffb13fb3a524/lib/internal/url.js#L1257
 */
function urlToOptions(url) {
  var options = {
    protocol: url.protocol,
    hostname: typeof url.hostname === 'string' && url.hostname.startsWith('[') ? url.hostname.slice(1, -1) : url.hostname,
    hash: url.hash,
    search: url.search,
    pathname: url.pathname,
    path: "" + url.pathname + (url.search || ''),
    href: url.href
  };
  if (url.port !== '') {
    options.port = Number(url.port);
  }
  if (url.username || url.password) {
    options.auth = url.username + ":" + url.password;
  }
  return options;
}

/**
 * Determines if request data matches the expected schema.
 *
 * Used for comparing decoded search parameters, request body JSON objects,
 * and URL decoded request form bodies.
 *
 * Performs a general recursive strict comparision with two caveats:
 *  - The expected data can use regexp to compare values
 *  - JSON path notation and nested objects are considered equal
 */
var dataEqual = function dataEqual(expected, actual) {
  if (isPlainObject(expected)) {
    expected = expand(expected);
  }
  if (isPlainObject(actual)) {
    actual = expand(actual);
  }
  return deepEqual(expected, actual);
};

/**
 * Converts flat objects whose keys use JSON path notation to nested objects.
 *
 * The input object is not mutated.
 *
 * @example
 * { 'foo[bar][0]': 'baz' } -> { foo: { bar: [ 'baz' ] } }
 */
var expand = function expand(input) {
  return (0, _entries2.default)(input).reduce(function (acc, _ref11) {
    var _ref12 = (0, _slicedToArray3.default)(_ref11, 2),
        k = _ref12[0],
        v = _ref12[1];

    return set(acc, k, v);
  }, {});
};

/**
 * Performs a recursive strict comparison between two values.
 *
 * Expected values or leaf nodes of expected object values that are RegExp use test() for comparison.
 */
function deepEqual(expected, actual) {
  debug('deepEqual comparing', typeof expected === "undefined" ? "undefined" : (0, _typeof3.default)(expected), expected, typeof actual === "undefined" ? "undefined" : (0, _typeof3.default)(actual), actual);
  if (expected instanceof RegExp) {
    return expected.test(actual);
  }

  if (Array.isArray(expected) && Array.isArray(actual)) {
    if (expected.length !== actual.length) {
      return false;
    }

    return expected.every(function (expVal, idx) {
      return deepEqual(expVal, actual[idx]);
    });
  }

  if (isPlainObject(expected) && isPlainObject(actual)) {
    var allKeys = (0, _from2.default)(new _set2.default((0, _keys2.default)(expected).concat((0, _keys2.default)(actual))));

    return allKeys.every(function (key) {
      return deepEqual(expected[key], actual[key]);
    });
  }

  return expected === actual;
}

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 * https://github.com/lodash/lodash/blob/588bf3e20db0ae039a822a14a8fa238c5b298e65/isPlainObject.js
 *
 * @param {*} value The value to check.
 * @return {boolean}
 */
function isPlainObject(value) {
  var isObjectLike = (typeof value === "undefined" ? "undefined" : (0, _typeof3.default)(value)) === 'object' && value !== null;
  var tag = Object.prototype.toString.call(value);
  if (!isObjectLike || tag !== '[object Object]') {
    return false;
  }
  if ((0, _getPrototypeOf2.default)(value) === null) {
    return true;
  }
  var proto = value;
  while ((0, _getPrototypeOf2.default)(proto) !== null) {
    proto = (0, _getPrototypeOf2.default)(proto);
  }
  return (0, _getPrototypeOf2.default)(value) === proto;
}

/**
 * Creates an object with the same keys as `object` and values generated
 * by running each own enumerable string keyed property of `object` thru
 * `iteratee`. (iteration order is not guaranteed)
 * The iteratee is invoked with three arguments: (value, key, object).
 * https://github.com/lodash/lodash/blob/588bf3e20db0ae039a822a14a8fa238c5b298e65/mapValue.js
 *
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns the new mapped object.
 */
function mapValue(object, iteratee) {
  object = Object(object);
  var result = {};

  (0, _keys2.default)(object).forEach(function (key) {
    result[key] = iteratee(object[key], key, object);
  });
  return result;
}

var timeouts = [];
var intervals = [];
var immediates = [];

var wrapTimer = function wrapTimer(timer, ids) {
  return function () {
    var id = timer.apply(undefined, arguments);
    ids.push(id);
    return id;
  };
};

var setTimeout = wrapTimer(timers.setTimeout, timeouts);
var setInterval = wrapTimer(timers.setInterval, intervals);
var setImmediate = wrapTimer(timers.setImmediate, immediates);

function clearTimer(clear, ids) {
  while (ids.length) {
    clear(ids.shift());
  }
}

function removeAllTimers() {
  clearTimer(clearTimeout, timeouts);
  clearTimer(clearInterval, intervals);
  clearTimer(_clearImmediate3.default, immediates);
}

/**
 * Check if the Client Request has been cancelled.
 *
 * Until Node 14 is the minimum, we need to look at both flags to see if the request has been cancelled.
 * The two flags have the same purpose, but the Node maintainers are migrating from `abort(ed)` to
 * `destroy(ed)` terminology, to be more consistent with `stream.Writable`.
 * In Node 14.x+, Calling `abort()` will set both `aborted` and `destroyed` to true, however,
 * calling `destroy()` will only set `destroyed` to true.
 * Falling back on checking if the socket is destroyed to cover the case of Node <14.x where
 * `destroy()` is called, but `destroyed` is undefined.
 *
 * Node Client Request history:
 * - `request.abort()`: Added in: v0.3.8, Deprecated since: v14.1.0, v13.14.0
 * - `request.aborted`: Added in: v0.11.14, Became a boolean instead of a timestamp: v11.0.0, Not deprecated (yet)
 * - `request.destroy()`: Added in: v0.3.0
 * - `request.destroyed`: Added in: v14.1.0, v13.14.0
 *
 * @param {ClientRequest} req
 * @returns {boolean}
 */
function isRequestDestroyed(req) {
  return !!(req.destroyed === true || req.aborted || req.socket && req.socket.destroyed);
}

mod_commonjs = {
  contentEncoding: contentEncoding,
  dataEqual: dataEqual,
  deleteHeadersField: deleteHeadersField,
  forEachHeader: forEachHeader,
  formatQueryValue: formatQueryValue,
  headersArrayToObject: headersArrayToObject,
  headersFieldNamesToLowerCase: headersFieldNamesToLowerCase,
  headersFieldsArrayToLowerCase: headersFieldsArrayToLowerCase,
  headersInputToRawArray: headersInputToRawArray,
  isContentEncoded: isContentEncoded,
  isJSONContent: isJSONContent,
  isPlainObject: isPlainObject,
  isRequestDestroyed: isRequestDestroyed,
  isStream: isStream,
  isUtf8Representable: isUtf8Representable,
  mapValue: mapValue,
  matchStringOrRegexp: matchStringOrRegexp,
  normalizeClientRequestArgs: normalizeClientRequestArgs,
  normalizeOrigin: normalizeOrigin,
  normalizeRequestOptions: normalizeRequestOptions,
  overrideRequests: overrideRequests,
  percentDecode: percentDecode,
  percentEncode: percentEncode,
  removeAllTimers: removeAllTimers,
  restoreOverriddenRequests: restoreOverriddenRequests,
  setImmediate: setImmediate,
  setInterval: setInterval,
  setTimeout: setTimeout,
  stringifyRequest: stringifyRequest
};
var mod_commonjs;
exports.default = mod_commonjs;
module.exports = exports.default;