import imp_got_clientjs from "./got_client";
import imp_indexjs from "..";
import ext_chai from "chai";
'use strict'

const { expect } = ext_chai
const nock = imp_indexjs
const got = imp_got_clientjs

it('follows redirects', async () => {
  const scope = nock('http://example.test')
    .get('/YourAccount')
    .reply(302, undefined, {
      Location: 'http://example.test/Login',
    })
    .get('/Login')
    .reply(200, 'Here is the login page')

  const { statusCode, body } = await got('http://example.test/YourAccount')

  expect(statusCode).to.equal(200)
  expect(body).to.equal('Here is the login page')

  scope.done()
})
