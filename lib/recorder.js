"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require("babel-runtime/core-js/object/entries");

var _entries2 = _interopRequireDefault(_entries);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _intercept = require("./intercept");

var _intercept2 = _interopRequireDefault(_intercept);

var _common = require("./common");

var _common2 = _interopRequireDefault(_common);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

var _querystring = require("querystring");

var _querystring2 = _interopRequireDefault(_querystring);

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var debug = (0, _debug2.default)('nock.recorder');
var querystring = _querystring2.default;
var inspect = _util2.default.inspect;


var common = _common2.default;
var restoreOverriddenClientRequest = _intercept2.default.restoreOverriddenClientRequest;


var SEPARATOR = '\n<<<<<<-- cut here -->>>>>>\n';
var recordingInProgress = false;
var _outputs = [];

function getScope(options) {
  var _common$normalizeRequ = common.normalizeRequestOptions(options),
      proto = _common$normalizeRequ.proto,
      host = _common$normalizeRequ.host,
      port = _common$normalizeRequ.port;

  return common.normalizeOrigin(proto, host, port);
}

function getMethod(options) {
  return options.method || 'GET';
}

function getBodyFromChunks(chunks, headers) {
  // If we have headers and there is content-encoding it means that the body
  // shouldn't be merged but instead persisted as an array of hex strings so
  // that the response chunks can be mocked one by one.
  if (headers && common.isContentEncoded(headers)) {
    return {
      body: chunks.map(function (chunk) {
        return chunk.toString('hex');
      })
    };
  }

  var mergedBuffer = Buffer.concat(chunks);

  // The merged buffer can be one of three things:
  // 1. A UTF-8-representable string buffer which represents a JSON object.
  // 2. A UTF-8-representable buffer which doesn't represent a JSON object.
  // 3. A non-UTF-8-representable buffer which then has to be recorded as a hex string.
  var isUtf8Representable = common.isUtf8Representable(mergedBuffer);
  if (isUtf8Representable) {
    var maybeStringifiedJson = mergedBuffer.toString('utf8');
    try {
      return {
        isUtf8Representable: isUtf8Representable,
        body: JSON.parse(maybeStringifiedJson)
      };
    } catch (err) {
      return {
        isUtf8Representable: isUtf8Representable,
        body: maybeStringifiedJson
      };
    }
  } else {
    return {
      isUtf8Representable: isUtf8Representable,
      body: mergedBuffer.toString('hex')
    };
  }
}

function generateRequestAndResponseObject(_ref) {
  var req = _ref.req,
      bodyChunks = _ref.bodyChunks,
      options = _ref.options,
      res = _ref.res,
      dataChunks = _ref.dataChunks,
      reqheaders = _ref.reqheaders;

  var _getBodyFromChunks = getBodyFromChunks(dataChunks, res.headers),
      body = _getBodyFromChunks.body,
      isUtf8Representable = _getBodyFromChunks.isUtf8Representable;

  options.path = req.path;

  return {
    scope: getScope(options),
    method: getMethod(options),
    path: options.path,
    // Is it deliberate that `getBodyFromChunks()` is called a second time?
    body: getBodyFromChunks(bodyChunks).body,
    status: res.statusCode,
    response: body,
    rawHeaders: res.rawHeaders,
    reqheaders: reqheaders || undefined,
    // When content-encoding is enabled, isUtf8Representable is `undefined`,
    // so we explicitly check for `false`.
    responseIsBinary: isUtf8Representable === false
  };
}

function generateRequestAndResponse(_ref2) {
  var req = _ref2.req,
      bodyChunks = _ref2.bodyChunks,
      options = _ref2.options,
      res = _ref2.res,
      dataChunks = _ref2.dataChunks,
      reqheaders = _ref2.reqheaders;

  var requestBody = getBodyFromChunks(bodyChunks).body;
  var responseBody = getBodyFromChunks(dataChunks, res.headers).body;

  // Remove any query params from options.path so they can be added in the query() function
  var path = options.path;

  var queryIndex = req.path.indexOf('?');
  var queryObj = {};
  if (queryIndex !== -1) {
    // Remove the query from the path
    path = path.substring(0, queryIndex);

    var queryStr = req.path.slice(queryIndex + 1);
    queryObj = querystring.parse(queryStr);
  }

  // Escape any single quotes in the path as the output uses them
  path = path.replace(/'/g, "\\'");

  // Always encode the query parameters when recording.
  var encodedQueryObj = {};
  for (var key in queryObj) {
    var formattedPair = common.formatQueryValue(key, queryObj[key], common.percentEncode);
    encodedQueryObj[formattedPair[0]] = formattedPair[1];
  }

  var lines = [];

  // We want a leading newline.
  lines.push('');

  var scope = getScope(options);
  lines.push("nock('" + scope + "', {\"encodedQueryParams\":true})");

  var methodName = getMethod(options).toLowerCase();
  if (requestBody) {
    lines.push("  ." + methodName + "('" + path + "', " + (0, _stringify2.default)(requestBody) + ")");
  } else {
    lines.push("  ." + methodName + "('" + path + "')");
  }

  (0, _entries2.default)(reqheaders || {}).forEach(function (_ref3) {
    var _ref4 = (0, _slicedToArray3.default)(_ref3, 2),
        fieldName = _ref4[0],
        fieldValue = _ref4[1];

    var safeName = (0, _stringify2.default)(fieldName);
    var safeValue = (0, _stringify2.default)(fieldValue);
    lines.push("  .matchHeader(" + safeName + ", " + safeValue + ")");
  });

  if (queryIndex !== -1) {
    lines.push("  .query(" + (0, _stringify2.default)(encodedQueryObj) + ")");
  }

  var statusCode = res.statusCode.toString();
  var stringifiedResponseBody = (0, _stringify2.default)(responseBody);
  var headers = inspect(res.rawHeaders);
  lines.push("  .reply(" + statusCode + ", " + stringifiedResponseBody + ", " + headers + ");");

  return lines.join('\n');
}

//  This module variable is used to identify a unique recording ID in order to skip
//  spurious requests that sometimes happen. This problem has been, so far,
//  exclusively detected in nock's unit testing where 'checks if callback is specified'
//  interferes with other tests as its t.end() is invoked without waiting for request
//  to finish (which is the point of the test).
var currentRecordingId = 0;

var defaultRecordOptions = {
  dont_print: false,
  enable_reqheaders_recording: false,
  logging: console.log,
  output_objects: false,
  use_separator: true
};

function record(recOptions) {
  //  Trying to start recording with recording already in progress implies an error
  //  in the recording configuration (double recording makes no sense and used to lead
  //  to duplicates in output)
  if (recordingInProgress) {
    throw new Error('Nock recording already in progress');
  }

  recordingInProgress = true;

  // Set the new current recording ID and capture its value in this instance of record().
  currentRecordingId = currentRecordingId + 1;
  var thisRecordingId = currentRecordingId;

  // Originally the parameter was a dont_print boolean flag.
  // To keep the existing code compatible we take that case into account.
  if (typeof recOptions === 'boolean') {
    recOptions = { dont_print: recOptions };
  }

  recOptions = (0, _extends3.default)({}, defaultRecordOptions, recOptions);

  debug('start recording', thisRecordingId, recOptions);

  var _recOptions = recOptions,
      dontPrint = _recOptions.dont_print,
      enableReqHeadersRecording = _recOptions.enable_reqheaders_recording,
      logging = _recOptions.logging,
      outputObjects = _recOptions.output_objects,
      useSeparator = _recOptions.use_separator;


  debug(thisRecordingId, 'restoring overridden requests before new overrides');
  //  To preserve backward compatibility (starting recording wasn't throwing if nock was already active)
  //  we restore any requests that may have been overridden by other parts of nock (e.g. intercept)
  //  NOTE: This is hacky as hell but it keeps the backward compatibility *and* allows correct
  //    behavior in the face of other modules also overriding ClientRequest.
  common.restoreOverriddenRequests();
  //  We restore ClientRequest as it messes with recording of modules that also override ClientRequest (e.g. xhr2)
  restoreOverriddenClientRequest();

  //  We override the requests so that we can save information on them before executing.
  common.overrideRequests(function (proto, overriddenRequest, rawArgs) {
    var _common$normalizeClie = common.normalizeClientRequestArgs.apply(common, (0, _toConsumableArray3.default)(rawArgs)),
        options = _common$normalizeClie.options,
        callback = _common$normalizeClie.callback;

    var bodyChunks = [];

    // Node 0.11 https.request calls http.request -- don't want to record things
    // twice.
    /* istanbul ignore if */
    if (options._recording) {
      return overriddenRequest(options, callback);
    }
    options._recording = true;

    var req = overriddenRequest(options, function (res) {
      debug(thisRecordingId, 'intercepting', proto, 'request to record');

      //  We put our 'end' listener to the front of the listener array.
      res.once('end', function () {
        debug(thisRecordingId, proto, 'intercepted request ended');

        var reqheaders = void 0;
        // Ignore request headers completely unless it was explicitly enabled by the user (see README)
        if (enableReqHeadersRecording) {
          // We never record user-agent headers as they are worse than useless -
          // they actually make testing more difficult without providing any benefit (see README)
          reqheaders = req.getHeaders();
          common.deleteHeadersField(reqheaders, 'user-agent');
        }

        var generateFn = outputObjects ? generateRequestAndResponseObject : generateRequestAndResponse;
        var out = generateFn({
          req: req,
          bodyChunks: bodyChunks,
          options: options,
          res: res,
          dataChunks: dataChunks,
          reqheaders: reqheaders
        });

        debug('out:', out);

        //  Check that the request was made during the current recording.
        //  If it hasn't then skip it. There is no other simple way to handle
        //  this as it depends on the timing of requests and responses. Throwing
        //  will make some recordings/unit tests fail randomly depending on how
        //  fast/slow the response arrived.
        //  If you are seeing this error then you need to make sure that all
        //  the requests made during a single recording session finish before
        //  ending the same recording session.
        if (thisRecordingId !== currentRecordingId) {
          debug('skipping recording of an out-of-order request', out);
          return;
        }

        _outputs.push(out);

        if (!dontPrint) {
          if (useSeparator) {
            if (typeof out !== 'string') {
              out = (0, _stringify2.default)(out, null, 2);
            }
            logging(SEPARATOR + out + SEPARATOR);
          } else {
            logging(out);
          }
        }
      });

      var encoding = void 0;
      // We need to be aware of changes to the stream's encoding so that we
      // don't accidentally mangle the data.
      var setEncoding = res.setEncoding;

      res.setEncoding = function (newEncoding) {
        encoding = newEncoding;
        return setEncoding.apply(this, arguments);
      };

      var dataChunks = [];
      // Replace res.push with our own implementation that stores chunks
      var origResPush = res.push;
      res.push = function (data) {
        if (data) {
          if (encoding) {
            data = Buffer.from(data, encoding);
          }
          dataChunks.push(data);
        }

        return origResPush.call(res, data);
      };

      if (callback) {
        callback(res, options, callback);
      }

      debug('finished setting up intercepting');

      // We override both the http and the https modules; when we are
      // serializing the request, we need to know which was called.
      // By stuffing the state, we can make sure that nock records
      // the intended protocol.
      if (proto === 'https') {
        options.proto = 'https';
      }
    });

    var recordChunk = function recordChunk(chunk, encoding) {
      debug(thisRecordingId, 'new', proto, 'body chunk');
      if (!Buffer.isBuffer(chunk)) {
        chunk = Buffer.from(chunk, encoding);
      }
      bodyChunks.push(chunk);
    };

    var oldWrite = req.write;
    req.write = function (chunk, encoding) {
      if (typeof chunk !== 'undefined') {
        recordChunk(chunk, encoding);
        oldWrite.apply(req, arguments);
      } else {
        throw new Error('Data was undefined.');
      }
    };

    // Starting in Node 8, `OutgoingMessage.end()` directly calls an internal
    // `write_` function instead of proxying to the public
    // `OutgoingMessage.write()` method, so we have to wrap `end` too.
    var oldEnd = req.end;
    req.end = function (chunk, encoding, callback) {
      debug('req.end');
      if (typeof chunk === 'function') {
        callback = chunk;
        chunk = null;
      } else if (typeof encoding === 'function') {
        callback = encoding;
        encoding = null;
      }

      if (chunk) {
        recordChunk(chunk, encoding);
      }
      oldEnd.call(req, chunk, encoding, callback);
    };

    return req;
  });
}

// Restore *all* the overridden http/https modules' properties.
function restore() {
  debug(currentRecordingId, 'restoring all the overridden http/https properties');

  common.restoreOverriddenRequests();
  restoreOverriddenClientRequest();
  recordingInProgress = false;
}

function clear() {
  _outputs = [];
}

mod_recorderjs = {
  record: record,
  outputs: function outputs() {
    return _outputs;
  },
  restore: restore,
  clear: clear
};
var mod_recorderjs;
exports.default = mod_recorderjs;
module.exports = exports.default;