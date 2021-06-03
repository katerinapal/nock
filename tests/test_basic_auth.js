import imp_got_clientjs from "./got_client";
import imp_indexjs from "..";
import ext_assertrejects from "assert-rejects";
import ext_chai from "chai";
'use strict'

const { expect } = ext_chai
const assertRejects = ext_assertrejects
const nock = imp_indexjs
const got = imp_got_clientjs

describe('basic auth with username and password', () => {
  beforeEach(done => {
    nock('http://example.test')
      .get('/test')
      .basicAuth({ user: 'foo', pass: 'bar' })
      .reply(200, 'Here is the content')
    done()
  })

  it('succeeds when it matches', async () => {
    const response = await got('http://example.test/test', {
      username: 'foo',
      password: 'bar',
    })
    expect(response.statusCode).to.equal(200)
    expect(response.body).to.equal('Here is the content')
  })

  it('fails when it doesnt match', async () => {
    await assertRejects(
      got('http://example.test/test'),
      /Nock: No match for request/
    )
  })
})

describe('basic auth with username only', () => {
  beforeEach(done => {
    nock('http://example.test')
      .get('/test')
      .basicAuth({ user: 'foo' })
      .reply(200, 'Here is the content')
    done()
  })

  it('succeeds when it matches', async () => {
    const response = await got('http://example.test/test', {
      username: 'foo',
      password: '',
    })
    expect(response.statusCode).to.equal(200)
    expect(response.body).to.equal('Here is the content')
  })

  it('fails when it doesnt match', async () => {
    await assertRejects(
      got('http://example.test/test'),
      /Nock: No match for request/
    )
  })
})
