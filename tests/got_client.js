"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _got = require("got");

var _got2 = _interopRequireDefault(_got);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

'use strict';

var got = _got2.default;

// https://github.com/nock/nock/issues/1523
mod_got_clientjs = got.extend({ retry: 0 });
var mod_got_clientjs;
exports.default = mod_got_clientjs;
module.exports = exports.default;