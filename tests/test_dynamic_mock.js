import imp_got_clientjs from "./got_client";
import imp_indexjs from "..";
import ext_chai from "chai";
'use strict'

const { expect } = ext_chai
const nock = imp_indexjs
const got = imp_got_clientjs

// "dynamic" refers to `reply` getting a single callback argument that returns or calls the callback with an array of [status, [body, headers]]]
describe('dynamic `reply()` function', () => {
  it('can provide only the status code by returning an array', async () => {
    const scope = nock('http://example.test')
      .get('/')
      .reply(() => [201])

    const { statusCode, body } = await got('http://example.test')
    expect(statusCode).to.equal(201)
    expect(body).to.equal('')

    scope.done()
  })

  it('can provide the status code and body by returning an array', async () => {
    const scope = nock('http://example.test')
      .get('/')
      .reply(function () {
        return [201, 'DEF']
      })

    const { statusCode, body } = await got('http://example.test')
    expect(statusCode).to.equal(201)
    expect(body).to.equal('DEF')

    scope.done()
  })

  it('can provide the status code, body, and headers by returning an array', async () => {
    const scope = nock('http://example.test')
      .get('/')
      .reply(function () {
        return [201, 'DEF', { 'X-Foo': 'bar' }]
      })

    const { statusCode, body, headers } = await got('http://example.test')
    expect(statusCode).to.equal(201)
    expect(body).to.equal('DEF')
    expect(headers).to.deep.equal({ 'x-foo': 'bar' })

    scope.done()
  })

  it('should provide the status code and body by passing them to the asynchronous callback', async () => {
    const scope = nock('http://example.test')
      .get('/')
      .reply(function (path, reqBody, cb) {
        setTimeout(function () {
          cb(null, [201, 'GHI'])
        }, 1e3)
      })

    const { statusCode, body } = await got('http://example.test')
    expect(statusCode).to.equal(201)
    expect(body).to.equal('GHI')

    scope.done()
  })
})
