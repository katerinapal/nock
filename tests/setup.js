"use strict";

var _sinonChai = require("sinon-chai");

var _sinonChai2 = _interopRequireDefault(_sinonChai);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _dirtyChai = require("dirty-chai");

var _dirtyChai2 = _interopRequireDefault(_dirtyChai);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _ = require("..");

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var nock = _2.default;
var chai = _chai2.default;
var dirtyChai = _dirtyChai2.default;
var sinon = _sinon2.default;
var sinonChai = _sinonChai2.default;

chai.use(dirtyChai);
chai.use(sinonChai);

afterEach(function () {
  nock.restore();
  nock.abortPendingRequests();
  nock.cleanAll();
  nock.enableNetConnect();
  nock.emitter.removeAllListeners();
  // It's important that Sinon is restored before Nock is reactivated for tests that stub/spy built-in methods,
  // otherwise Sinon loses track of the stubs and can't restore them.
  sinon.restore();
  nock.activate();
});