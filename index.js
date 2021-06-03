"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _scope = require("./lib/scope");

var _scope2 = _interopRequireDefault(_scope);

var _recorder = require("./lib/recorder");

var _recorder2 = _interopRequireDefault(_recorder);

var _intercept = require("./lib/intercept");

var _intercept2 = _interopRequireDefault(_intercept);

var _global_emitter = require("./lib/global_emitter");

var _global_emitter2 = _interopRequireDefault(_global_emitter);

var _back = require("./lib/back");

var _back2 = _interopRequireDefault(_back);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var back = _back2.default;
var emitter = _global_emitter2.default;
var activate = _intercept2.default.activate,
    isActive = _intercept2.default.isActive,
    isDone = _intercept2.default.isDone,
    isOn = _intercept2.default.isOn,
    pendingMocks = _intercept2.default.pendingMocks,
    activeMocks = _intercept2.default.activeMocks,
    removeInterceptor = _intercept2.default.removeInterceptor,
    disableNetConnect = _intercept2.default.disableNetConnect,
    enableNetConnect = _intercept2.default.enableNetConnect,
    removeAll = _intercept2.default.removeAll,
    abortPendingRequests = _intercept2.default.abortPendingRequests;

var recorder = _recorder2.default;
var Scope = _scope2.default.Scope,
    load = _scope2.default.load,
    loadDefs = _scope2.default.loadDefs,
    define = _scope2.default.define;


mod_indexjs = function mod_indexjs(basePath, options) {
  return new Scope(basePath, options);
};

(0, _assign2.default)(module.exports, {
  activate: activate,
  isActive: isActive,
  isDone: isDone,
  pendingMocks: pendingMocks,
  activeMocks: activeMocks,
  removeInterceptor: removeInterceptor,
  disableNetConnect: disableNetConnect,
  enableNetConnect: enableNetConnect,
  cleanAll: removeAll,
  abortPendingRequests: abortPendingRequests,
  load: load,
  loadDefs: loadDefs,
  define: define,
  emitter: emitter,
  recorder: {
    rec: recorder.record,
    clear: recorder.clear,
    play: recorder.outputs
  },
  restore: recorder.restore,
  back: back
});

// We always activate Nock on import, overriding the globals.
// Setting the Back mode "activates" Nock by overriding the global entries in the `http/s` modules.
// If Nock Back is configured, we need to honor that setting for backward compatibility,
// otherwise we rely on Nock Back's default initializing side effect.
if (isOn()) {
  back.setMode(process.env.NOCK_BACK_MODE || 'dryrun');
}
var mod_indexjs;
exports.default = mod_indexjs;
module.exports = exports.default;
