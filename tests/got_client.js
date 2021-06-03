import ext_got from "got";
'use strict'

const got = ext_got

// https://github.com/nock/nock/issues/1523
mod_got_clientjs = got.extend({ retry: 0 })
var mod_got_clientjs;
export default mod_got_clientjs;
