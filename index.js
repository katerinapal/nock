import libscope_scopejs from "./lib/scope";
import librecorder_recorderjs from "./lib/recorder";
import libintercept_interceptjs from "./lib/intercept";
import libglobal_emitter_global_emitterjs from "./lib/global_emitter";
import libback_Back from "./lib/back";
'use strict'

const back = libback_Back
const emitter = libglobal_emitter_global_emitterjs
const {
  activate,
  isActive,
  isDone,
  isOn,
  pendingMocks,
  activeMocks,
  removeInterceptor,
  disableNetConnect,
  enableNetConnect,
  removeAll,
  abortPendingRequests,
} = libintercept_interceptjs
const recorder = librecorder_recorderjs
const { Scope, load, loadDefs, define } = libscope_scopejs

mod_indexjs = (basePath, options) => new Scope(basePath, options)

Object.assign(module.exports, {
  activate,
  isActive,
  isDone,
  pendingMocks,
  activeMocks,
  removeInterceptor,
  disableNetConnect,
  enableNetConnect,
  cleanAll: removeAll,
  abortPendingRequests,
  load,
  loadDefs,
  define,
  emitter,
  recorder: {
    rec: recorder.record,
    clear: recorder.clear,
    play: recorder.outputs,
  },
  restore: recorder.restore,
  back,
})

// We always activate Nock on import, overriding the globals.
// Setting the Back mode "activates" Nock by overriding the global entries in the `http/s` modules.
// If Nock Back is configured, we need to honor that setting for backward compatibility,
// otherwise we rely on Nock Back's default initializing side effect.
if (isOn()) {
  back.setMode(process.env.NOCK_BACK_MODE || 'dryrun')
}
var mod_indexjs;
export default mod_indexjs;
