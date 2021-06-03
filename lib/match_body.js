"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _common = require("./common");

var _common2 = _interopRequireDefault(_common);

var _querystring = require("querystring");

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var querystring = _querystring2.default;

var common = _common2.default;

var mod_anonymus = function matchBody(options, spec, body) {
  if (spec instanceof RegExp) {
    return spec.test(body);
  }

  if (Buffer.isBuffer(spec)) {
    var encoding = common.isUtf8Representable(spec) ? 'utf8' : 'hex';
    spec = spec.toString(encoding);
  }

  var contentType = (options.headers && (options.headers['Content-Type'] || options.headers['content-type']) || '').toString();

  var isMultipart = contentType.includes('multipart');
  var isUrlencoded = contentType.includes('application/x-www-form-urlencoded');

  // try to transform body to json
  var json = void 0;
  if ((typeof spec === "undefined" ? "undefined" : (0, _typeof3.default)(spec)) === 'object' || typeof spec === 'function') {
    try {
      json = JSON.parse(body);
    } catch (err) {
      // not a valid JSON string
    }
    if (json !== undefined) {
      body = json;
    } else if (isUrlencoded) {
      body = querystring.parse(body);
    }
  }

  if (typeof spec === 'function') {
    return spec.call(options, body);
  }

  // strip line endings from both so that we get a match no matter what OS we are running on
  // if Content-Type does not contains 'multipart'
  if (!isMultipart && typeof body === 'string') {
    body = body.replace(/\r?\n|\r/g, '');
  }

  if (!isMultipart && typeof spec === 'string') {
    spec = spec.replace(/\r?\n|\r/g, '');
  }

  // Because the nature of URL encoding, all the values in the body have been cast to strings.
  // dataEqual does strict checking so we we have to cast the non-regexp values in the spec too.
  if (isUrlencoded) {
    spec = mapValuesDeep(spec, function (val) {
      return val instanceof RegExp ? val : "" + val;
    });
  }

  return common.dataEqual(spec, body);
};

/**
 * Based on lodash issue discussion
 * https://github.com/lodash/lodash/issues/1244
 */
function mapValuesDeep(obj, cb) {
  if (Array.isArray(obj)) {
    return obj.map(function (v) {
      return mapValuesDeep(v, cb);
    });
  }
  if (common.isPlainObject(obj)) {
    return common.mapValue(obj, function (v) {
      return mapValuesDeep(v, cb);
    });
  }
  return cb(obj);
}
exports.default = mod_anonymus;
module.exports = exports.default;