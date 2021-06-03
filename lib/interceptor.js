"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _entries = require("babel-runtime/core-js/object/entries");

var _entries2 = _interopRequireDefault(_entries);

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _isInteger = require("babel-runtime/core-js/number/is-integer");

var _isInteger2 = _interopRequireDefault(_isInteger);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _match_body = require("./match_body");

var _match_body2 = _interopRequireDefault(_match_body);

var _intercept = require("./intercept");

var _intercept2 = _interopRequireDefault(_intercept);

var _common = require("./common");

var _common2 = _interopRequireDefault(_common);

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _querystring = require("querystring");

var _querystring2 = _interopRequireDefault(_querystring);

var _jsonStringifySafe = require("json-stringify-safe");

var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var stringify = _jsonStringifySafe2.default;
var querystring = _querystring2.default;
var URL = _url2.default.URL,
    URLSearchParams = _url2.default.URLSearchParams;


var common = _common2.default;
var remove = _intercept2.default.remove;

var matchBody = _match_body2.default;

var fs = void 0;
try {
  fs = _fs2.default;
} catch (err) {
  // do nothing, we're in the browser
}

mod_interceptorjs = function () {
  /**
   *
   * Valid argument types for `uri`:
   *  - A string used for strict comparisons with pathname.
   *    The search portion of the URI may also be postfixed, in which case the search params
   *    are striped and added via the `query` method.
   *  - A RegExp instance that tests against only the pathname of requests.
   *  - A synchronous function bound to this Interceptor instance. It's provided the pathname
   *    of requests and must return a boolean denoting if the request is considered a match.
   */
  function Interceptor(scope, uri, method, requestBody, interceptorOptions) {
    (0, _classCallCheck3.default)(this, Interceptor);

    var uriIsStr = typeof uri === 'string';
    // Check for leading slash. Uri can be either a string or a regexp, but
    // When enabled filteringScope ignores the passed URL entirely so we skip validation.

    if (uriIsStr && !scope.scopeOptions.filteringScope && !scope.basePathname && !uri.startsWith('/') && !uri.startsWith('*')) {
      throw Error("Non-wildcard URL path strings must begin with a slash (otherwise they won't match anything) (got: " + uri + ")");
    }

    if (!method) {
      throw new Error('The "method" parameter is required for an intercept call.');
    }

    this.scope = scope;
    this.interceptorMatchHeaders = [];
    this.method = method.toUpperCase();
    this.uri = uri;
    this._key = this.method + " " + scope.basePath + scope.basePathname + (uriIsStr ? '' : '/') + uri;
    this.basePath = this.scope.basePath;
    this.path = uriIsStr ? scope.basePathname + uri : uri;
    this.queries = null;

    this.options = interceptorOptions || {};
    this.counter = 1;
    this._requestBody = requestBody;

    //  We use lower-case header field names throughout Nock.
    this.reqheaders = common.headersFieldNamesToLowerCase(scope.scopeOptions.reqheaders || {});
    this.badheaders = common.headersFieldsArrayToLowerCase(scope.scopeOptions.badheaders || []);

    this.delayBodyInMs = 0;
    this.delayConnectionInMs = 0;

    this.optional = false;

    // strip off literal query parameters if they were provided as part of the URI
    if (uriIsStr && uri.includes('?')) {
      // localhost is a dummy value because the URL constructor errors for only relative inputs
      var parsedURL = new URL(this.path, 'http://localhost');
      this.path = parsedURL.pathname;
      this.query(parsedURL.searchParams);
      this._key = this.method + " " + scope.basePath + this.path;
    }
  }

  (0, _createClass3.default)(Interceptor, [{
    key: "optionally",
    value: function optionally() {
      var flag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      // The default behaviour of optionally() with no arguments is to make the mock optional.
      if (typeof flag !== 'boolean') {
        throw new Error('Invalid arguments: argument should be a boolean');
      }

      this.optional = flag;

      return this;
    }
  }, {
    key: "replyWithError",
    value: function replyWithError(errorMessage) {
      this.errorMessage = errorMessage;

      this.options = (0, _extends3.default)({}, this.scope.scopeOptions, this.options);

      this.scope.add(this._key, this);
      return this.scope;
    }
  }, {
    key: "reply",
    value: function reply(statusCode, body, rawHeaders) {
      // support the format of only passing in a callback
      if (typeof statusCode === 'function') {
        if (arguments.length > 1) {
          // It's not very Javascript-y to throw an error for extra args to a function, but because
          // of legacy behavior, this error was added to reduce confusion for those migrating.
          throw Error('Invalid arguments. When providing a function for the first argument, .reply does not accept other arguments.');
        }
        this.statusCode = null;
        this.fullReplyFunction = statusCode;
      } else {
        if (statusCode !== undefined && !(0, _isInteger2.default)(statusCode)) {
          throw new Error("Invalid " + (typeof statusCode === "undefined" ? "undefined" : (0, _typeof3.default)(statusCode)) + " value for status code");
        }

        this.statusCode = statusCode || 200;
        if (typeof body === 'function') {
          this.replyFunction = body;
          body = null;
        }
      }

      this.options = (0, _extends3.default)({}, this.scope.scopeOptions, this.options);

      this.rawHeaders = common.headersInputToRawArray(rawHeaders);

      if (this.scope.date) {
        // https://tools.ietf.org/html/rfc7231#section-7.1.1.2
        this.rawHeaders.push('Date', this.scope.date.toUTCString());
      }

      // Prepare the headers temporarily so we can make best guesses about content-encoding and content-type
      // below as well as while the response is being processed in RequestOverrider.end().
      // Including all the default headers is safe for our purposes because of the specific headers we introspect.
      // A more thoughtful process is used to merge the default headers when the response headers are finally computed.
      this.headers = common.headersArrayToObject(this.rawHeaders.concat(this.scope._defaultReplyHeaders));

      //  If the content is not encoded we may need to transform the response body.
      //  Otherwise we leave it as it is.
      if (body && typeof body !== 'string' && !Buffer.isBuffer(body) && !common.isStream(body) && !common.isContentEncoded(this.headers)) {
        try {
          body = stringify(body);
        } catch (err) {
          throw new Error('Error encoding response body into JSON');
        }

        if (!this.headers['content-type']) {
          // https://tools.ietf.org/html/rfc7231#section-3.1.1.5
          this.rawHeaders.push('Content-Type', 'application/json');
        }

        if (this.scope.contentLen) {
          // https://tools.ietf.org/html/rfc7230#section-3.3.2
          this.rawHeaders.push('Content-Length', body.length);
        }
      }

      this.scope.logger('reply.headers:', this.headers);
      this.scope.logger('reply.rawHeaders:', this.rawHeaders);

      this.body = body;

      this.scope.add(this._key, this);
      return this.scope;
    }
  }, {
    key: "replyWithFile",
    value: function replyWithFile(statusCode, filePath, headers) {
      if (!fs) {
        throw new Error('No fs');
      }
      var readStream = fs.createReadStream(filePath);
      readStream.pause();
      this.filePath = filePath;
      return this.reply(statusCode, readStream, headers);
    }

    // Also match request headers
    // https://github.com/nock/nock/issues/163

  }, {
    key: "reqheaderMatches",
    value: function reqheaderMatches(options, key) {
      var reqHeader = this.reqheaders[key];
      var header = options.headers[key];

      // https://github.com/nock/nock/issues/399
      // https://github.com/nock/nock/issues/822
      if (header && typeof header !== 'string' && header.toString) {
        header = header.toString();
      }

      // We skip 'host' header comparison unless it's available in both mock and
      // actual request. This because 'host' may get inserted by Nock itself and
      // then get recorded. NOTE: We use lower-case header field names throughout
      // Nock. See https://github.com/nock/nock/pull/196.
      if (key === 'host' && (header === undefined || reqHeader === undefined)) {
        return true;
      }

      if (reqHeader !== undefined && header !== undefined) {
        if (typeof reqHeader === 'function') {
          return reqHeader(header);
        } else if (common.matchStringOrRegexp(header, reqHeader)) {
          return true;
        }
      }

      this.scope.logger("request header field doesn't match:", key, header, reqHeader);
      return false;
    }
  }, {
    key: "match",
    value: function match(req, options, body) {
      var _this = this;

      // check if the logger is enabled because the stringifies can be expensive.
      if (this.scope.logger.enabled) {
        this.scope.logger('attempting match %s, body = %s', stringify(options), stringify(body));
      }

      var method = (options.method || 'GET').toUpperCase();
      var _options$path = options.path,
          path = _options$path === undefined ? '/' : _options$path;

      var matches = void 0;
      var matchKey = void 0;
      var proto = options.proto;


      if (this.method !== method) {
        this.scope.logger("Method did not match. Request " + method + " Interceptor " + this.method);
        return false;
      }

      if (this.scope.transformPathFunction) {
        path = this.scope.transformPathFunction(path);
      }

      var requestMatchesFilter = function requestMatchesFilter(_ref) {
        var name = _ref.name,
            predicate = _ref.value;

        var headerValue = req.getHeader(name);
        if (typeof predicate === 'function') {
          return predicate(headerValue);
        } else {
          return common.matchStringOrRegexp(headerValue, predicate);
        }
      };

      if (!this.scope.matchHeaders.every(requestMatchesFilter) || !this.interceptorMatchHeaders.every(requestMatchesFilter)) {
        this.scope.logger("headers don't match");
        return false;
      }

      var reqHeadersMatch = (0, _keys2.default)(this.reqheaders).every(function (key) {
        return _this.reqheaderMatches(options, key);
      });

      if (!reqHeadersMatch) {
        this.scope.logger("headers don't match");
        return false;
      }

      if (this.scope.scopeOptions.conditionally && !this.scope.scopeOptions.conditionally()) {
        this.scope.logger('matching failed because Scope.conditionally() did not validate');
        return false;
      }

      var badHeaders = this.badheaders.filter(function (header) {
        return header in options.headers;
      });

      if (badHeaders.length) {
        var _scope;

        (_scope = this.scope).logger.apply(_scope, ['request contains bad headers'].concat((0, _toConsumableArray3.default)(badHeaders)));
        return false;
      }

      // Match query strings when using query()
      if (this.queries === null) {
        this.scope.logger('query matching skipped');
      } else {
        // can't rely on pathname or search being in the options, but path has a default
        var _path$split = path.split('?'),
            _path$split2 = (0, _slicedToArray3.default)(_path$split, 2),
            pathname = _path$split2[0],
            search = _path$split2[1];

        var matchQueries = this.matchQuery({ search: search });

        this.scope.logger(matchQueries ? 'query matching succeeded' : 'query matching failed');

        if (!matchQueries) {
          return false;
        }

        // If the query string was explicitly checked then subsequent checks against
        // the path using a callback or regexp only validate the pathname.
        path = pathname;
      }

      // If we have a filtered scope then we use it instead reconstructing the
      // scope from the request options (proto, host and port) as these two won't
      // necessarily match and we have to remove the scope that was matched (vs.
      // that was defined).
      if (this.__nock_filteredScope) {
        matchKey = this.__nock_filteredScope;
      } else {
        matchKey = common.normalizeOrigin(proto, options.host, options.port);
      }

      if (typeof this.uri === 'function') {
        matches = common.matchStringOrRegexp(matchKey, this.basePath) &&
        // This is a false positive, as `uri` is not bound to `this`.
        // eslint-disable-next-line no-useless-call
        this.uri.call(this, path);
      } else {
        matches = common.matchStringOrRegexp(matchKey, this.basePath) && common.matchStringOrRegexp(path, this.path);
      }

      this.scope.logger("matching " + matchKey + path + " to " + this._key + ": " + matches);

      if (matches && this._requestBody !== undefined) {
        if (this.scope.transformRequestBodyFunction) {
          body = this.scope.transformRequestBodyFunction(body, this._requestBody);
        }

        matches = matchBody(options, this._requestBody, body);
        if (!matches) {
          this.scope.logger("bodies don't match: \n", this._requestBody, '\n', body);
        }
      }

      return matches;
    }

    /**
     * Return true when the interceptor's method, protocol, host, port, and path
     * match the provided options.
     */

  }, {
    key: "matchOrigin",
    value: function matchOrigin(options) {
      var isPathFn = typeof this.path === 'function';
      var isRegex = this.path instanceof RegExp;
      var isRegexBasePath = this.scope.basePath instanceof RegExp;

      var method = (options.method || 'GET').toUpperCase();
      var path = options.path;
      var proto = options.proto;

      // NOTE: Do not split off the query params as the regex could use them

      if (!isRegex) {
        path = path ? path.split('?')[0] : '';
      }

      if (this.scope.transformPathFunction) {
        path = this.scope.transformPathFunction(path);
      }
      var comparisonKey = isPathFn || isRegex ? this.__nock_scopeKey : this._key;
      var matchKey = method + " " + proto + "://" + options.host + path;

      if (isPathFn) {
        return !!(matchKey.match(comparisonKey) && this.path(path));
      }

      if (isRegex && !isRegexBasePath) {
        return !!matchKey.match(comparisonKey) && this.path.test(path);
      }

      if (isRegexBasePath) {
        return this.scope.basePath.test(matchKey) && !!path.match(this.path);
      }

      return comparisonKey === matchKey;
    }
  }, {
    key: "matchHostName",
    value: function matchHostName(options) {
      return options.hostname === this.scope.urlParts.hostname;
    }
  }, {
    key: "matchQuery",
    value: function matchQuery(options) {
      if (this.queries === true) {
        return true;
      }

      var reqQueries = querystring.parse(options.search);
      this.scope.logger('Interceptor queries: %j', this.queries);
      this.scope.logger('    Request queries: %j', reqQueries);

      if (typeof this.queries === 'function') {
        return this.queries(reqQueries);
      }

      return common.dataEqual(this.queries, reqQueries);
    }
  }, {
    key: "filteringPath",
    value: function filteringPath() {
      var _scope2;

      (_scope2 = this.scope).filteringPath.apply(_scope2, arguments);
      return this;
    }

    // TODO filtering by path is valid on the intercept level, but not filtering
    // by request body?

  }, {
    key: "markConsumed",
    value: function markConsumed() {
      this.interceptionCounter++;

      remove(this);

      if ((this.scope.shouldPersist() || this.counter > 0) && this.filePath) {
        this.body = fs.createReadStream(this.filePath);
        this.body.pause();
      }

      if (!this.scope.shouldPersist() && this.counter < 1) {
        this.scope.remove(this._key, this);
      }
    }
  }, {
    key: "matchHeader",
    value: function matchHeader(name, value) {
      this.interceptorMatchHeaders.push({ name: name, value: value });
      return this;
    }
  }, {
    key: "basicAuth",
    value: function basicAuth(_ref2) {
      var user = _ref2.user,
          _ref2$pass = _ref2.pass,
          pass = _ref2$pass === undefined ? '' : _ref2$pass;

      var encoded = Buffer.from(user + ":" + pass).toString('base64');
      this.matchHeader('authorization', "Basic " + encoded);
      return this;
    }

    /**
     * Set query strings for the interceptor
     * @name query
     * @param queries Object of query string name,values (accepts regexp values)
     * @public
     * @example
     * // Will match 'http://zombo.com/?q=t'
     * nock('http://zombo.com').get('/').query({q: 't'});
     */

  }, {
    key: "query",
    value: function query(queries) {
      if (this.queries !== null) {
        throw Error("Query parameters have already been defined");
      }

      // Allow all query strings to match this route
      if (queries === true) {
        this.queries = queries;
        return this;
      }

      if (typeof queries === 'function') {
        this.queries = queries;
        return this;
      }

      var strFormattingFn = void 0;
      if (this.scope.scopeOptions.encodedQueryParams) {
        strFormattingFn = common.percentDecode;
      }

      if (queries instanceof URLSearchParams) {
        // Normalize the data into the shape that is matched against.
        // Duplicate keys are handled by combining the values into an array.
        queries = querystring.parse(queries.toString());
      } else if (!common.isPlainObject(queries)) {
        throw Error("Argument Error: " + queries);
      }

      this.queries = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)((0, _entries2.default)(queries)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ref3 = _step.value;

          var _ref4 = (0, _slicedToArray3.default)(_ref3, 2);

          var key = _ref4[0];
          var value = _ref4[1];

          var formatted = common.formatQueryValue(key, value, strFormattingFn);

          var _formatted = (0, _slicedToArray3.default)(formatted, 2),
              formattedKey = _formatted[0],
              formattedValue = _formatted[1];

          this.queries[formattedKey] = formattedValue;
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

      return this;
    }

    /**
     * Set number of times will repeat the interceptor
     * @name times
     * @param newCounter Number of times to repeat (should be > 0)
     * @public
     * @example
     * // Will repeat mock 5 times for same king of request
     * nock('http://zombo.com).get('/').times(5).reply(200, 'Ok');
     */

  }, {
    key: "times",
    value: function times(newCounter) {
      if (newCounter < 1) {
        return this;
      }

      this.counter = newCounter;

      return this;
    }

    /**
     * An sugar syntax for times(1)
     * @name once
     * @see {@link times}
     * @public
     * @example
     * nock('http://zombo.com).get('/').once().reply(200, 'Ok');
     */

  }, {
    key: "once",
    value: function once() {
      return this.times(1);
    }

    /**
     * An sugar syntax for times(2)
     * @name twice
     * @see {@link times}
     * @public
     * @example
     * nock('http://zombo.com).get('/').twice().reply(200, 'Ok');
     */

  }, {
    key: "twice",
    value: function twice() {
      return this.times(2);
    }

    /**
     * An sugar syntax for times(3).
     * @name thrice
     * @see {@link times}
     * @public
     * @example
     * nock('http://zombo.com).get('/').thrice().reply(200, 'Ok');
     */

  }, {
    key: "thrice",
    value: function thrice() {
      return this.times(3);
    }

    /**
     * Delay the response by a certain number of ms.
     *
     * @param {(integer|object)} opts - Number of milliseconds to wait, or an object
     * @param {integer} [opts.head] - Number of milliseconds to wait before response is sent
     * @param {integer} [opts.body] - Number of milliseconds to wait before response body is sent
     * @return {Interceptor} - the current interceptor for chaining
     */

  }, {
    key: "delay",
    value: function delay(opts) {
      var headDelay = void 0;
      var bodyDelay = void 0;
      if (typeof opts === 'number') {
        headDelay = opts;
        bodyDelay = 0;
      } else if ((typeof opts === "undefined" ? "undefined" : (0, _typeof3.default)(opts)) === 'object') {
        headDelay = opts.head || 0;
        bodyDelay = opts.body || 0;
      } else {
        throw new Error("Unexpected input opts " + opts);
      }

      return this.delayConnection(headDelay).delayBody(bodyDelay);
    }

    /**
     * Delay the response body by a certain number of ms.
     *
     * @param {integer} ms - Number of milliseconds to wait before response is sent
     * @return {Interceptor} - the current interceptor for chaining
     */

  }, {
    key: "delayBody",
    value: function delayBody(ms) {
      this.delayBodyInMs = ms;
      return this;
    }

    /**
     * Delay the connection by a certain number of ms.
     *
     * @param  {integer} ms - Number of milliseconds to wait
     * @return {Interceptor} - the current interceptor for chaining
     */

  }, {
    key: "delayConnection",
    value: function delayConnection(ms) {
      this.delayConnectionInMs = ms;
      return this;
    }
  }]);
  return Interceptor;
}();
var mod_interceptorjs;
exports.default = mod_interceptorjs;
module.exports = exports.default;