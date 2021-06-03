"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require("babel-runtime/core-js/object/entries");

var _entries2 = _interopRequireDefault(_entries);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

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

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _interceptor = require("./interceptor");

var _interceptor2 = _interopRequireDefault(_interceptor);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

var _common = require("./common");

var _common2 = _interopRequireDefault(_common);

var _intercept = require("./intercept");

var _intercept2 = _interopRequireDefault(_intercept);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

/**
 * @module nock/scope
 */
var addInterceptor = _intercept2.default.addInterceptor,
    isOn = _intercept2.default.isOn;

var common = _common2.default;
var assert = _assert2.default;
var url = _url2.default;
var debug = (0, _debug2.default)('nock.scope');
var EventEmitter = _events2.default.EventEmitter;

var Interceptor = _interceptor2.default;

var fs = void 0;

try {
  fs = _fs2.default;
} catch (err) {}
// do nothing, we're in the browser


/**
 * @param  {string|RegExp|url.url} basePath
 * @param  {Object}   options
 * @param  {boolean}  options.allowUnmocked
 * @param  {string[]} options.badheaders
 * @param  {function} options.conditionally
 * @param  {boolean}  options.encodedQueryParams
 * @param  {function} options.filteringScope
 * @param  {Object}   options.reqheaders
 * @constructor
 */

var Scope = function (_EventEmitter) {
  (0, _inherits3.default)(Scope, _EventEmitter);

  function Scope(basePath, options) {
    (0, _classCallCheck3.default)(this, Scope);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Scope.__proto__ || (0, _getPrototypeOf2.default)(Scope)).call(this));

    _this.keyedInterceptors = {};
    _this.interceptors = [];
    _this.transformPathFunction = null;
    _this.transformRequestBodyFunction = null;
    _this.matchHeaders = [];
    _this.scopeOptions = options || {};
    _this.urlParts = {};
    _this._persist = false;
    _this.contentLen = false;
    _this.date = null;
    _this.basePath = basePath;
    _this.basePathname = '';
    _this.port = null;
    _this._defaultReplyHeaders = [];

    var logNamespace = String(basePath);

    if (!(basePath instanceof RegExp)) {
      _this.urlParts = url.parse(basePath);
      _this.port = _this.urlParts.port || (_this.urlParts.protocol === 'http:' ? 80 : 443);
      _this.basePathname = _this.urlParts.pathname.replace(/\/$/, '');
      _this.basePath = _this.urlParts.protocol + "//" + _this.urlParts.hostname + ":" + _this.port;
      logNamespace = _this.urlParts.host;
    }

    _this.logger = debug.extend(logNamespace);
    return _this;
  }

  (0, _createClass3.default)(Scope, [{
    key: "add",
    value: function add(key, interceptor) {
      if (!(key in this.keyedInterceptors)) {
        this.keyedInterceptors[key] = [];
      }
      this.keyedInterceptors[key].push(interceptor);
      addInterceptor(this.basePath, interceptor, this, this.scopeOptions, this.urlParts.hostname);
    }
  }, {
    key: "remove",
    value: function remove(key, interceptor) {
      if (this._persist) {
        return;
      }
      var arr = this.keyedInterceptors[key];
      if (arr) {
        arr.splice(arr.indexOf(interceptor), 1);
        if (arr.length === 0) {
          delete this.keyedInterceptors[key];
        }
      }
    }
  }, {
    key: "intercept",
    value: function intercept(uri, method, requestBody, interceptorOptions) {
      var ic = new Interceptor(this, uri, method, requestBody, interceptorOptions);

      this.interceptors.push(ic);
      return ic;
    }
  }, {
    key: "get",
    value: function get(uri, requestBody, options) {
      return this.intercept(uri, 'GET', requestBody, options);
    }
  }, {
    key: "post",
    value: function post(uri, requestBody, options) {
      return this.intercept(uri, 'POST', requestBody, options);
    }
  }, {
    key: "put",
    value: function put(uri, requestBody, options) {
      return this.intercept(uri, 'PUT', requestBody, options);
    }
  }, {
    key: "head",
    value: function head(uri, requestBody, options) {
      return this.intercept(uri, 'HEAD', requestBody, options);
    }
  }, {
    key: "patch",
    value: function patch(uri, requestBody, options) {
      return this.intercept(uri, 'PATCH', requestBody, options);
    }
  }, {
    key: "merge",
    value: function merge(uri, requestBody, options) {
      return this.intercept(uri, 'MERGE', requestBody, options);
    }
  }, {
    key: "delete",
    value: function _delete(uri, requestBody, options) {
      return this.intercept(uri, 'DELETE', requestBody, options);
    }
  }, {
    key: "options",
    value: function options(uri, requestBody, _options) {
      return this.intercept(uri, 'OPTIONS', requestBody, _options);
    }

    // Returns the list of keys for non-optional Interceptors that haven't been completed yet.
    // TODO: This assumes that completed mocks are removed from the keyedInterceptors list
    // (when persistence is off). We should change that (and this) in future.

  }, {
    key: "pendingMocks",
    value: function pendingMocks() {
      var _this2 = this;

      return this.activeMocks().filter(function (key) {
        return _this2.keyedInterceptors[key].some(function (_ref) {
          var interceptionCounter = _ref.interceptionCounter,
              optional = _ref.optional;

          var persistedAndUsed = _this2._persist && interceptionCounter > 0;
          return !persistedAndUsed && !optional;
        });
      });
    }

    // Returns all keyedInterceptors that are active.
    // This includes incomplete interceptors, persisted but complete interceptors, and
    // optional interceptors, but not non-persisted and completed interceptors.

  }, {
    key: "activeMocks",
    value: function activeMocks() {
      return (0, _keys2.default)(this.keyedInterceptors);
    }
  }, {
    key: "isDone",
    value: function isDone() {
      if (!isOn()) {
        return true;
      }

      return this.pendingMocks().length === 0;
    }
  }, {
    key: "done",
    value: function done() {
      assert.ok(this.isDone(), "Mocks not yet satisfied:\n" + this.pendingMocks().join('\n'));
    }
  }, {
    key: "buildFilter",
    value: function buildFilter() {
      var filteringArguments = arguments;

      if (arguments[0] instanceof RegExp) {
        return function (candidate) {
          /* istanbul ignore if */
          if (typeof candidate !== 'string') {
            // Given the way nock is written, it seems like `candidate` will always
            // be a string, regardless of what options might be passed to it.
            // However the code used to contain a truthiness test of `candidate`.
            // The check is being preserved for now.
            throw Error("Nock internal assertion failed: typeof candidate is " + (typeof candidate === "undefined" ? "undefined" : (0, _typeof3.default)(candidate)) + ". If you encounter this error, please report it as a bug.");
          }
          return candidate.replace(filteringArguments[0], filteringArguments[1]);
        };
      } else if (typeof arguments[0] === 'function') {
        return arguments[0];
      }
    }
  }, {
    key: "filteringPath",
    value: function filteringPath() {
      this.transformPathFunction = this.buildFilter.apply(this, arguments);
      if (!this.transformPathFunction) {
        throw new Error('Invalid arguments: filtering path should be a function or a regular expression');
      }
      return this;
    }
  }, {
    key: "filteringRequestBody",
    value: function filteringRequestBody() {
      this.transformRequestBodyFunction = this.buildFilter.apply(this, arguments);
      if (!this.transformRequestBodyFunction) {
        throw new Error('Invalid arguments: filtering request body should be a function or a regular expression');
      }
      return this;
    }
  }, {
    key: "matchHeader",
    value: function matchHeader(name, value) {
      //  We use lower-case header field names throughout Nock.
      this.matchHeaders.push({ name: name.toLowerCase(), value: value });
      return this;
    }
  }, {
    key: "defaultReplyHeaders",
    value: function defaultReplyHeaders(headers) {
      this._defaultReplyHeaders = common.headersInputToRawArray(headers);
      return this;
    }
  }, {
    key: "persist",
    value: function persist() {
      var flag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (typeof flag !== 'boolean') {
        throw new Error('Invalid arguments: argument should be a boolean');
      }
      this._persist = flag;
      return this;
    }

    /**
     * @private
     * @returns {boolean}
     */

  }, {
    key: "shouldPersist",
    value: function shouldPersist() {
      return this._persist;
    }
  }, {
    key: "replyContentLength",
    value: function replyContentLength() {
      this.contentLen = true;
      return this;
    }
  }, {
    key: "replyDate",
    value: function replyDate(d) {
      this.date = d || new Date();
      return this;
    }
  }]);
  return Scope;
}(EventEmitter);

function loadDefs(path) {
  if (!fs) {
    throw new Error('No fs');
  }

  var contents = fs.readFileSync(path);
  return JSON.parse(contents);
}

function load(path) {
  return define(loadDefs(path));
}

function getStatusFromDefinition(nockDef) {
  // Backward compatibility for when `status` was encoded as string in `reply`.
  if (nockDef.reply !== undefined) {
    var parsedReply = parseInt(nockDef.reply, 10);
    if (isNaN(parsedReply)) {
      throw Error('`reply`, when present, must be a numeric string');
    }

    return parsedReply;
  }

  var DEFAULT_STATUS_OK = 200;
  return nockDef.status || DEFAULT_STATUS_OK;
}

function getScopeFromDefinition(nockDef) {
  //  Backward compatibility for when `port` was part of definition.
  if (nockDef.port !== undefined) {
    //  Include `port` into scope if it doesn't exist.
    var options = url.parse(nockDef.scope);
    if (options.port === null) {
      return nockDef.scope + ":" + nockDef.port;
    } else {
      if (parseInt(options.port) !== parseInt(nockDef.port)) {
        throw new Error('Mismatched port numbers in scope and port properties of nock definition.');
      }
    }
  }

  return nockDef.scope;
}

function tryJsonParse(string) {
  try {
    return JSON.parse(string);
  } catch (err) {
    return string;
  }
}

function define(nockDefs) {
  var scopes = [];

  nockDefs.forEach(function (nockDef) {
    var nscope = getScopeFromDefinition(nockDef);
    var npath = nockDef.path;
    if (!nockDef.method) {
      throw Error('Method is required');
    }
    var method = nockDef.method.toLowerCase();
    var status = getStatusFromDefinition(nockDef);
    var rawHeaders = nockDef.rawHeaders || [];
    var reqheaders = nockDef.reqheaders || {};
    var badheaders = nockDef.badheaders || [];
    var options = (0, _extends3.default)({}, nockDef.options);

    //  We use request headers for both filtering (see below) and mocking.
    //  Here we are setting up mocked request headers but we don't want to
    //  be changing the user's options object so we clone it first.
    options.reqheaders = reqheaders;
    options.badheaders = badheaders;

    // Response is not always JSON as it could be a string or binary data or
    // even an array of binary buffers (e.g. when content is encoded).
    var response = void 0;
    if (!nockDef.response) {
      response = '';
      // TODO: Rename `responseIsBinary` to `responseIsUtf8Representable`.
    } else if (nockDef.responseIsBinary) {
      response = Buffer.from(nockDef.response, 'hex');
    } else {
      response = typeof nockDef.response === 'string' ? tryJsonParse(nockDef.response) : nockDef.response;
    }

    var scope = new Scope(nscope, options);

    // If request headers were specified filter by them.
    (0, _entries2.default)(reqheaders).forEach(function (_ref2) {
      var _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
          fieldName = _ref3[0],
          value = _ref3[1];

      scope.matchHeader(fieldName, value);
    });

    var acceptableFilters = ['filteringRequestBody', 'filteringPath'];
    acceptableFilters.forEach(function (filter) {
      if (nockDef[filter]) {
        scope[filter](nockDef[filter]);
      }
    });

    scope.intercept(npath, method, nockDef.body).reply(status, response, rawHeaders);

    scopes.push(scope);
  });

  return scopes;
}

mod_scopejs = {
  Scope: Scope,
  load: load,
  loadDefs: loadDefs,
  define: define
};
var mod_scopejs;
exports.default = mod_scopejs;
module.exports = exports.default;