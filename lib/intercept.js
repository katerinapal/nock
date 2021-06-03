"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _values = require("babel-runtime/core-js/object/values");

var _values2 = _interopRequireDefault(_values);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _interceptor = require("./interceptor");

var _interceptor2 = _interopRequireDefault(_interceptor);

var _global_emitter = require("./global_emitter");

var _global_emitter2 = _interopRequireDefault(_global_emitter);

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

var _common = require("./common");

var _common2 = _interopRequireDefault(_common);

var _intercepted_request_router = require("./intercepted_request_router");

var _intercepted_request_router2 = _interopRequireDefault(_intercepted_request_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

/**
 * @module nock/intercept
 */

var InterceptedRequestRouter = _intercepted_request_router2.default.InterceptedRequestRouter;

var common = _common2.default;
var inherits = _util2.default.inherits;

var http = _http2.default;
var debug = (0, _debug2.default)('nock.intercept');
var globalEmitter = _global_emitter2.default;

/**
 * @name NetConnectNotAllowedError
 * @private
 * @desc Error trying to make a connection when disabled external access.
 * @class
 * @example
 * nock.disableNetConnect();
 * http.get('http://zombo.com');
 * // throw NetConnectNotAllowedError
 */
function NetConnectNotAllowedError(host, path) {
  Error.call(this);

  this.name = 'NetConnectNotAllowedError';
  this.code = 'ENETUNREACH';
  this.message = "Nock: Disallowed net connect for \"" + host + path + "\"";

  Error.captureStackTrace(this, this.constructor);
}

inherits(NetConnectNotAllowedError, Error);

var allInterceptors = {};
var allowNetConnect = void 0;

/**
 * Enabled real request.
 * @public
 * @param {String|RegExp} matcher=RegExp.new('.*') Expression to match
 * @example
 * // Enables all real requests
 * nock.enableNetConnect();
 * @example
 * // Enables real requests for url that matches google
 * nock.enableNetConnect('google');
 * @example
 * // Enables real requests for url that matches google and amazon
 * nock.enableNetConnect(/(google|amazon)/);
 * @example
 * // Enables real requests for url that includes google
 * nock.enableNetConnect(host => host.includes('google'));
 */
function enableNetConnect(matcher) {
  if (typeof matcher === 'string') {
    allowNetConnect = new RegExp(matcher);
  } else if (matcher instanceof RegExp) {
    allowNetConnect = matcher;
  } else if (typeof matcher === 'function') {
    allowNetConnect = { test: matcher };
  } else {
    allowNetConnect = /.*/;
  }
}

function isEnabledForNetConnect(options) {
  common.normalizeRequestOptions(options);

  var enabled = allowNetConnect && allowNetConnect.test(options.host);
  debug('Net connect', enabled ? '' : 'not', 'enabled for', options.host);
  return enabled;
}

/**
 * Disable all real requests.
 * @public
 * @example
 * nock.disableNetConnect();
 */
function disableNetConnect() {
  allowNetConnect = undefined;
}

function isOn() {
  return !isOff();
}

function isOff() {
  return process.env.NOCK_OFF === 'true';
}

function addInterceptor(key, interceptor, scope, scopeOptions, host) {
  if (!(key in allInterceptors)) {
    allInterceptors[key] = { key: key, interceptors: [] };
  }
  interceptor.__nock_scope = scope;

  //  We need scope's key and scope options for scope filtering function (if defined)
  interceptor.__nock_scopeKey = key;
  interceptor.__nock_scopeOptions = scopeOptions;
  //  We need scope's host for setting correct request headers for filtered scopes.
  interceptor.__nock_scopeHost = host;
  interceptor.interceptionCounter = 0;

  if (scopeOptions.allowUnmocked) allInterceptors[key].allowUnmocked = true;

  allInterceptors[key].interceptors.push(interceptor);
}

function remove(interceptor) {
  if (interceptor.__nock_scope.shouldPersist() || --interceptor.counter > 0) {
    return;
  }

  var basePath = interceptor.basePath;

  var interceptors = allInterceptors[basePath] && allInterceptors[basePath].interceptors || [];

  // TODO: There is a clearer way to write that we want to delete the first
  // matching instance. I'm also not sure why we couldn't delete _all_
  // matching instances.
  interceptors.some(function (thisInterceptor, i) {
    return thisInterceptor === interceptor ? interceptors.splice(i, 1) : false;
  });
}

function removeAll() {
  (0, _keys2.default)(allInterceptors).forEach(function (key) {
    allInterceptors[key].interceptors.forEach(function (interceptor) {
      interceptor.scope.keyedInterceptors = {};
    });
  });
  allInterceptors = {};
}

/**
 * Return all the Interceptors whose Scopes match against the base path of the provided options.
 *
 * @returns {Interceptor[]}
 */
function interceptorsFor(options) {
  common.normalizeRequestOptions(options);

  debug('interceptors for %j', options.host);

  var basePath = options.proto + "://" + options.host;

  debug('filtering interceptors for basepath', basePath);

  // First try to use filteringScope if any of the interceptors has it defined.
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)((0, _values2.default)(allInterceptors)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ref = _step.value;
      var key = _ref.key;
      var interceptors = _ref.interceptors;
      var allowUnmocked = _ref.allowUnmocked;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(interceptors), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var interceptor = _step2.value;
          var filteringScope = interceptor.__nock_scopeOptions.filteringScope;

          // If scope filtering function is defined and returns a truthy value then
          // we have to treat this as a match.

          if (filteringScope && filteringScope(basePath)) {
            interceptor.scope.logger('found matching scope interceptor');

            // Keep the filtered scope (its key) to signal the rest of the module
            // that this wasn't an exact but filtered match.
            interceptors.forEach(function (ic) {
              ic.__nock_filteredScope = ic.__nock_scopeKey;
            });
            return interceptors;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      if (common.matchStringOrRegexp(basePath, key)) {
        if (allowUnmocked && interceptors.length === 0) {
          debug('matched base path with allowUnmocked (no matching interceptors)');
          return [{
            options: { allowUnmocked: true },
            matchOrigin: function matchOrigin() {
              return false;
            }
          }];
        } else {
          debug("matched base path (" + interceptors.length + " interceptor" + (interceptors.length > 1 ? 's' : '') + ")");
          return interceptors;
        }
      }
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

  return undefined;
}

function removeInterceptor(options) {
  // Lazily import to avoid circular imports.
  var Interceptor = _interceptor2.default;

  var baseUrl = void 0,
      key = void 0,
      method = void 0,
      proto = void 0;
  if (options instanceof Interceptor) {
    baseUrl = options.basePath;
    key = options._key;
  } else {
    proto = options.proto ? options.proto : 'http';

    common.normalizeRequestOptions(options);
    baseUrl = proto + "://" + options.host;
    method = options.method && options.method.toUpperCase() || 'GET';
    key = method + " " + baseUrl + (options.path || '/');
  }

  if (allInterceptors[baseUrl] && allInterceptors[baseUrl].interceptors.length > 0) {
    for (var i = 0; i < allInterceptors[baseUrl].interceptors.length; i++) {
      var interceptor = allInterceptors[baseUrl].interceptors[i];
      if (interceptor._key === key) {
        allInterceptors[baseUrl].interceptors.splice(i, 1);
        interceptor.scope.remove(key, interceptor);
        break;
      }
    }

    return true;
  }

  return false;
}
//  Variable where we keep the ClientRequest we have overridden
//  (which might or might not be node's original http.ClientRequest)
var originalClientRequest = void 0;

function ErroringClientRequest(error) {
  http.OutgoingMessage.call(this);
  process.nextTick(function () {
    this.emit('error', error);
  }.bind(this));
}

inherits(ErroringClientRequest, http.ClientRequest);

function overrideClientRequest() {
  // Here's some background discussion about overriding ClientRequest:
  // - https://github.com/nodejitsu/mock-request/issues/4
  // - https://github.com/nock/nock/issues/26
  // It would be good to add a comment that explains this more clearly.
  debug('Overriding ClientRequest');

  // ----- Extending http.ClientRequest

  //  Define the overriding client request that nock uses internally.
  function OverriddenClientRequest() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _common$normalizeClie = common.normalizeClientRequestArgs.apply(common, args),
        options = _common$normalizeClie.options,
        callback = _common$normalizeClie.callback;

    if ((0, _keys2.default)(options).length === 0) {
      // As weird as it is, it's possible to call `http.request` without
      // options, and it makes a request to localhost or somesuch. We should
      // support it too, for parity. However it doesn't work today, and fixing
      // it seems low priority. Giving an explicit error is nicer than
      // crashing with a weird stack trace. `http[s].request()`, nock's other
      // client-facing entry point, makes a similar check.
      // https://github.com/nock/nock/pull/1386
      // https://github.com/nock/nock/pull/1440
      throw Error('Creating a ClientRequest with empty `options` is not supported in Nock');
    }

    http.OutgoingMessage.call(this);

    //  Filter the interceptors per request options.
    var interceptors = interceptorsFor(options);

    if (isOn() && interceptors) {
      debug('using', interceptors.length, 'interceptors');

      //  Use filtered interceptors to intercept requests.
      // TODO: this shouldn't be a class anymore
      // the overrider explicitly overrides methods and attrs on the request so the `assign` below should be removed.
      var overrider = new InterceptedRequestRouter({
        req: this,
        options: options,
        interceptors: interceptors
      });
      (0, _assign2.default)(this, overrider);

      if (callback) {
        this.once('response', callback);
      }
    } else {
      debug('falling back to original ClientRequest');

      //  Fallback to original ClientRequest if nock is off or the net connection is enabled.
      if (isOff() || isEnabledForNetConnect(options)) {
        originalClientRequest.apply(this, arguments);
      } else {
        common.setImmediate(function () {
          var error = new NetConnectNotAllowedError(options.host, options.path);
          this.emit('error', error);
        }.bind(this));
      }
    }
  }
  inherits(OverriddenClientRequest, http.ClientRequest);

  //  Override the http module's request but keep the original so that we can use it and later restore it.
  //  NOTE: We only override http.ClientRequest as https module also uses it.
  originalClientRequest = http.ClientRequest;
  http.ClientRequest = OverriddenClientRequest;

  debug('ClientRequest overridden');
}

function restoreOverriddenClientRequest() {
  debug('restoring overridden ClientRequest');

  //  Restore the ClientRequest we have overridden.
  if (!originalClientRequest) {
    debug('- ClientRequest was not overridden');
  } else {
    http.ClientRequest = originalClientRequest;
    originalClientRequest = undefined;

    debug('- ClientRequest restored');
  }
}

function isActive() {
  //  If ClientRequest has been overwritten by Nock then originalClientRequest is not undefined.
  //  This means that Nock has been activated.
  return originalClientRequest !== undefined;
}

function interceptorScopes() {
  var _ref2;

  var nestedInterceptors = (0, _values2.default)(allInterceptors).map(function (i) {
    return i.interceptors;
  });
  return (_ref2 = []).concat.apply(_ref2, (0, _toConsumableArray3.default)(nestedInterceptors)).map(function (i) {
    return i.scope;
  });
}

function isDone() {
  return interceptorScopes().every(function (scope) {
    return scope.isDone();
  });
}

function pendingMocks() {
  var _ref3;

  return (_ref3 = []).concat.apply(_ref3, (0, _toConsumableArray3.default)(interceptorScopes().map(function (scope) {
    return scope.pendingMocks();
  })));
}

function activeMocks() {
  var _ref4;

  return (_ref4 = []).concat.apply(_ref4, (0, _toConsumableArray3.default)(interceptorScopes().map(function (scope) {
    return scope.activeMocks();
  })));
}

function activate() {
  if (originalClientRequest) {
    throw new Error('Nock already active');
  }

  overrideClientRequest();

  // ----- Overriding http.request and https.request:

  common.overrideRequests(function (proto, overriddenRequest, args) {
    //  NOTE: overriddenRequest is already bound to its module.

    var _common$normalizeClie2 = common.normalizeClientRequestArgs.apply(common, (0, _toConsumableArray3.default)(args)),
        options = _common$normalizeClie2.options,
        callback = _common$normalizeClie2.callback;

    if ((0, _keys2.default)(options).length === 0) {
      // As weird as it is, it's possible to call `http.request` without
      // options, and it makes a request to localhost or somesuch. We should
      // support it too, for parity. However it doesn't work today, and fixing
      // it seems low priority. Giving an explicit error is nicer than
      // crashing with a weird stack trace. `new ClientRequest()`, nock's
      // other client-facing entry point, makes a similar check.
      // https://github.com/nock/nock/pull/1386
      // https://github.com/nock/nock/pull/1440
      throw Error('Making a request with empty `options` is not supported in Nock');
    }

    // The option per the docs is `protocol`. Its unclear if this line is meant to override that and is misspelled or if
    // the intend is to explicitly keep track of which module was called using a separate name.
    // Either way, `proto` is used as the source of truth from here on out.
    options.proto = proto;

    var interceptors = interceptorsFor(options);

    if (isOn() && interceptors) {
      var matches = interceptors.some(function (interceptor) {
        return interceptor.matchOrigin(options);
      });
      var allowUnmocked = interceptors.some(function (interceptor) {
        return interceptor.options.allowUnmocked;
      });

      if (!matches && allowUnmocked) {
        var req = void 0;
        if (proto === 'https') {
          var ClientRequest = http.ClientRequest;

          http.ClientRequest = originalClientRequest;
          req = overriddenRequest(options, callback);
          http.ClientRequest = ClientRequest;
        } else {
          req = overriddenRequest(options, callback);
        }
        globalEmitter.emit('no match', req);
        return req;
      }

      //  NOTE: Since we already overrode the http.ClientRequest we are in fact constructing
      //    our own OverriddenClientRequest.
      return new http.ClientRequest(options, callback);
    } else {
      globalEmitter.emit('no match', options);
      if (isOff() || isEnabledForNetConnect(options)) {
        return overriddenRequest(options, callback);
      } else {
        var error = new NetConnectNotAllowedError(options.host, options.path);
        return new ErroringClientRequest(error);
      }
    }
  });
}

mod_interceptjs = {
  addInterceptor: addInterceptor,
  remove: remove,
  removeAll: removeAll,
  removeInterceptor: removeInterceptor,
  isOn: isOn,
  activate: activate,
  isActive: isActive,
  isDone: isDone,
  pendingMocks: pendingMocks,
  activeMocks: activeMocks,
  enableNetConnect: enableNetConnect,
  disableNetConnect: disableNetConnect,
  restoreOverriddenClientRequest: restoreOverriddenClientRequest,
  abortPendingRequests: common.removeAllTimers
};
var mod_interceptjs;
exports.default = mod_interceptjs;
module.exports = exports.default;