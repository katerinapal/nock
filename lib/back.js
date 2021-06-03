"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _debug = require("debug");

var _debug2 = _interopRequireDefault(_debug);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

var _scope = require("./scope");

var _scope2 = _interopRequireDefault(_scope);

var _intercept = require("./intercept");

var _intercept2 = _interopRequireDefault(_intercept);

var _recorder = require("./recorder");

var _recorder2 = _interopRequireDefault(_recorder);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mod_Back = Back;

'use strict';

var assert = _assert2.default;
var recorder = _recorder2.default;
var activate = _intercept2.default.activate,
    disableNetConnect = _intercept2.default.disableNetConnect,
    enableNetConnect = _intercept2.default.enableNetConnect,
    cleanAll = _intercept2.default.removeAll;
var loadDefs = _scope2.default.loadDefs,
    define = _scope2.default.define;
var format = _util2.default.format;

var path = _path2.default;
var debug = (0, _debug2.default)('nock.back');

var _mode = null;

var fs = void 0;

try {
  fs = _fs2.default;
} catch (err) {}
// do nothing, probably in browser


/**
 * nock the current function with the fixture given
 *
 * @param {string}   fixtureName  - the name of the fixture, e.x. 'foo.json'
 * @param {object}   options      - [optional] extra options for nock with, e.x. `{ assert: true }`
 * @param {function} nockedFn     - [optional] callback function to be executed with the given fixture being loaded;
 *                                  if defined the function will be called with context `{ scopes: loaded_nocks || [] }`
 *                                  set as `this` and `nockDone` callback function as first and only parameter;
 *                                  if not defined a promise resolving to `{nockDone, context}` where `context` is
 *                                  aforementioned `{ scopes: loaded_nocks || [] }`
 *
 * List of options:
 *
 * @param {function} before       - a preprocessing function, gets called before nock.define
 * @param {function} after        - a postprocessing function, gets called after nock.define
 * @param {function} afterRecord  - a postprocessing function, gets called after recording. Is passed the array
 *                                  of scopes recorded and should return the array scopes to save to the fixture
 * @param {function} recorder     - custom options to pass to the recorder
 *
 */
function Back(fixtureName, options, nockedFn) {
  if (!Back.fixtures) {
    throw new Error('Back requires nock.back.fixtures to be set\n' + 'Ex:\n' + "\trequire(nock).back.fixtures = '/path/to/fixtures/'");
  }

  if (typeof fixtureName !== 'string') {
    throw new Error('Parameter fixtureName must be a string');
  }

  if (arguments.length === 1) {
    options = {};
  } else if (arguments.length === 2) {
    // If 2nd parameter is a function then `options` has been omitted
    // otherwise `options` haven't been omitted but `nockedFn` was.
    if (typeof options === 'function') {
      nockedFn = options;
      options = {};
    }
  }

  _mode.setup();

  var fixture = path.join(Back.fixtures, fixtureName);
  var context = _mode.start(fixture, options);

  var nockDone = function nockDone() {
    _mode.finish(fixture, options, context);
  };

  debug('context:', context);

  // If nockedFn is a function then invoke it, otherwise return a promise resolving to nockDone.
  if (typeof nockedFn === 'function') {
    nockedFn.call(context, nockDone);
  } else {
    return _promise2.default.resolve({ nockDone: nockDone, context: context });
  }
}

/*******************************************************************************
 *                                    Modes                                     *
 *******************************************************************************/

var wild = {
  setup: function setup() {
    cleanAll();
    recorder.restore();
    activate();
    enableNetConnect();
  },

  start: function start() {
    return load(); // don't load anything but get correct context
  },

  finish: function finish() {
    // nothing to do
  }
};

var dryrun = {
  setup: function setup() {
    recorder.restore();
    cleanAll();
    activate();
    //  We have to explicitly enable net connectivity as by default it's off.
    enableNetConnect();
  },

  start: function start(fixture, options) {
    var contexts = load(fixture, options);

    enableNetConnect();
    return contexts;
  },

  finish: function finish() {
    // nothing to do
  }
};

var record = {
  setup: function setup() {
    recorder.restore();
    recorder.clear();
    cleanAll();
    activate();
    disableNetConnect();
  },

  start: function start(fixture, options) {
    if (!fs) {
      throw new Error('no fs');
    }
    var context = load(fixture, options);

    if (!context.isLoaded) {
      recorder.record((0, _extends3.default)({
        dont_print: true,
        output_objects: true
      }, options.recorder));

      context.isRecording = true;
    }

    return context;
  },

  finish: function finish(fixture, options, context) {
    if (context.isRecording) {
      var outputs = recorder.outputs();

      if (typeof options.afterRecord === 'function') {
        outputs = options.afterRecord(outputs);
      }

      outputs = typeof outputs === 'string' ? outputs : (0, _stringify2.default)(outputs, null, 4);
      debug('recorder outputs:', outputs);

      fs.mkdirSync(path.dirname(fixture), { recursive: true });
      fs.writeFileSync(fixture, outputs);
    }
  }
};

var lockdown = {
  setup: function setup() {
    recorder.restore();
    recorder.clear();
    cleanAll();
    activate();
    disableNetConnect();
  },

  start: function start(fixture, options) {
    return load(fixture, options);
  },

  finish: function finish() {
    // nothing to do
  }
};

function load(fixture, options) {
  var context = {
    scopes: [],
    assertScopesFinished: function assertScopesFinished() {
      assertScopes(this.scopes, fixture);
    }
  };

  if (fixture && fixtureExists(fixture)) {
    var scopes = loadDefs(fixture);
    applyHook(scopes, options.before);

    scopes = define(scopes);
    applyHook(scopes, options.after);

    context.scopes = scopes;
    context.isLoaded = true;
  }

  return context;
}

function applyHook(scopes, fn) {
  if (!fn) {
    return;
  }

  if (typeof fn !== 'function') {
    throw new Error('processing hooks must be a function');
  }

  scopes.forEach(fn);
}

function fixtureExists(fixture) {
  if (!fs) {
    throw new Error('no fs');
  }

  return fs.existsSync(fixture);
}

function assertScopes(scopes, fixture) {
  var pending = scopes.filter(function (scope) {
    return !scope.isDone();
  }).map(function (scope) {
    return scope.pendingMocks();
  });

  if (pending.length) {
    var _ref;

    assert.fail(format('%j was not used, consider removing %s to rerecord fixture', (_ref = []).concat.apply(_ref, (0, _toConsumableArray3.default)(pending)), fixture));
  }
}

var Modes = {
  wild: wild, // all requests go out to the internet, dont replay anything, doesnt record anything

  dryrun: dryrun, // use recorded nocks, allow http calls, doesnt record anything, useful for writing new tests (default)

  record: record, // use recorded nocks, record new nocks

  lockdown: lockdown // use recorded nocks, disables all http calls even when not nocked, doesnt record
};

Back.setMode = function (mode) {
  if (!(mode in Modes)) {
    throw new Error("Unknown mode: " + mode);
  }

  Back.currentMode = mode;
  debug('New nock back mode:', Back.currentMode);

  _mode = Modes[mode];
  _mode.setup();
};

Back.fixtures = null;
Back.currentMode = null;

/**
 * nock the current function with the fixture given
 *
 * @param {string}   fixtureName  - the name of the fixture, e.x. 'foo.json'
 * @param {object}   options      - [optional] extra options for nock with, e.x. `{ assert: true }`
 * @param {function} nockedFn     - [optional] callback function to be executed with the given fixture being loaded;
 *                                  if defined the function will be called with context `{ scopes: loaded_nocks || [] }`
 *                                  set as `this` and `nockDone` callback function as first and only parameter;
 *                                  if not defined a promise resolving to `{nockDone, context}` where `context` is
 *                                  aforementioned `{ scopes: loaded_nocks || [] }`
 *
 * List of options:
 *
 * @param {function} before       - a preprocessing function, gets called before nock.define
 * @param {function} after        - a postprocessing function, gets called after nock.define
 * @param {function} afterRecord  - a postprocessing function, gets called after recording. Is passed the array
 *                                  of scopes recorded and should return the array scopes to save to the fixture
 * @param {function} recorder     - custom options to pass to the recorder
 *
 */
exports.default = mod_Back;
module.exports = exports.default;