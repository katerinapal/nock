import imp_got_clientjs from "./got_client";
import imp_indexjs from "..";
import ext_sinonjsfaketimers from "@sinonjs/fake-timers";
'use strict'

const fakeTimers = ext_sinonjsfaketimers
const nock = imp_indexjs
const got = imp_got_clientjs

// https://github.com/nock/nock/issues/1334
it('should still return successfully when fake timer is enabled', async () => {
  const clock = fakeTimers.install()
  const scope = nock('http://example.test').get('/').reply()

  await got('http://example.test')

  clock.uninstall()
  scope.done()
})
