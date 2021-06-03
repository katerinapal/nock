import servers_indexjs from "./servers";
import got_client_got_clientjs from "./got_client";
import _indexjs from "..";
import ext_http from "http";
import ext_chai from "chai";
'use strict'

const { expect } = ext_chai
const http = ext_http
const nock = _indexjs

const got = got_client_got_clientjs
const httpsServer = servers_indexjs

describe('NOCK_OFF env var', () => {
  let original
  beforeEach(() => {
    original = process.env.NOCK_OFF
    process.env.NOCK_OFF = 'true'
  })
  afterEach(() => {
    process.env.NOCK_OFF = original
  })

  it('when true, https mocks reach the live server', async () => {
    const responseBody = 'the real thing'
    const { origin } = await httpsServer.startHttpsServer(
      (request, response) => {
        response.writeHead(200)
        response.end(responseBody)
      }
    )

    const scope = nock(origin, { allowUnmocked: true })
      .get('/')
      .reply(200, 'mock')

    const { body } = await got(origin, {
      https: { certificateAuthority: httpsServer.ca },
    })
    expect(body).to.equal(responseBody)
    scope.done()
  })

  it('when true before import, Nock does not activate', async () => {
    nock.restore()
    const originalClient = http.ClientRequest

    delete require.cache[require.resolve('..')]
    const newNock = _indexjs

    expect(http.ClientRequest).to.equal(originalClient)
    expect(newNock.isActive()).to.equal(false)
  })
})
