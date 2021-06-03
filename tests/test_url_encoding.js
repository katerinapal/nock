import imp_got_clientjs from "./got_client";
import imp_indexjs from "..";
import ext_chai from "chai";
'use strict'

const { expect } = ext_chai
const nock = imp_indexjs
const got = imp_got_clientjs

it('url encoding', async () => {
  const scope = nock('http://example.test').get('/key?a=[1]').reply(200)

  const { statusCode } = await got('http://example.test/key?a=[1]')
  expect(statusCode).to.equal(200)

  scope.done()
})
