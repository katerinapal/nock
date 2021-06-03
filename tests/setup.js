import ext_sinonchai from "sinon-chai";
import ext_sinon from "sinon";
import ext_dirtychai from "dirty-chai";
import ext_chai from "chai";
import _indexjs from "..";
'use strict'

const nock = _indexjs
const chai = ext_chai
const dirtyChai = ext_dirtychai
const sinon = ext_sinon
const sinonChai = ext_sinonchai

chai.use(dirtyChai)
chai.use(sinonChai)

afterEach(function () {
  nock.restore()
  nock.abortPendingRequests()
  nock.cleanAll()
  nock.enableNetConnect()
  nock.emitter.removeAllListeners()
  // It's important that Sinon is restored before Nock is reactivated for tests that stub/spy built-in methods,
  // otherwise Sinon loses track of the stubs and can't restore them.
  sinon.restore()
  nock.activate()
})
