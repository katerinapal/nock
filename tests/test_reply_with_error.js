import _indexjs from "..";
import ext_chai from "chai";
import ext_http from "http";
'use strict'

// Tests for `.replyWithError()`.

const http = ext_http
const { expect } = ext_chai
const nock = _indexjs

describe('`replyWithError()`', () => {
  it('returns an error through the request', done => {
    const scope = nock('http://example.test')
      .post('/echo')
      .replyWithError('Service not found')

    const req = http.request({
      host: 'example.test',
      method: 'POST',
      path: '/echo',
      port: 80,
    })

    req.on('error', e => {
      expect(e)
        .to.be.an.instanceof(Error)
        .and.include({ message: 'Service not found' })
      scope.done()
      done()
    })

    req.end()
  })

  it('allows json response', done => {
    const scope = nock('http://example.test')
      .post('/echo')
      .replyWithError({ message: 'Service not found', code: 'test' })

    const req = http.request({
      host: 'example.test',
      method: 'POST',
      path: '/echo',
      port: 80,
    })

    req.on('error', e => {
      expect(e).to.deep.equal({
        message: 'Service not found',
        code: 'test',
      })
      scope.done()
      done()
    })

    req.end()
  })
})
