import _indexjs from "..";
import ext_zlib from "zlib";
import ext_http from "http";
import ext_chai from "chai";
'use strict'

const { expect } = ext_chai
const http = ext_http
const zlib = ext_zlib
const nock = _indexjs

it('should accept and decode gzip encoded application/json', done => {
  const message = {
    my: 'contents',
  }

  nock('http://example.test')
    .post('/')
    .reply(function (url, actual) {
      expect(actual).to.deep.equal(message)
      done()
      return [200]
    })

  const req = http.request({
    hostname: 'example.test',
    path: '/',
    method: 'POST',
    headers: {
      'content-encoding': 'gzip',
      'content-type': 'application/json',
    },
  })

  const compressedMessage = zlib.gzipSync(JSON.stringify(message))

  req.write(compressedMessage)
  req.end()
})

it('should accept and decode gzip encoded application/json, when headers come from a client as an array', done => {
  const compressedMessage = zlib.gzipSync(JSON.stringify({ my: 'contents' }))

  const scope = nock('http://example.test')
    .post('/', compressedMessage)
    .reply(200)

  const req = http.request({
    hostname: 'example.test',
    path: '/',
    method: 'POST',
    headers: {
      'content-encoding': ['gzip'],
      'content-type': ['application/json'],
    },
  })
  req.on('response', () => {
    scope.done()
    done()
  })

  req.write(compressedMessage)
  req.end()
})

it('should accept and decode deflate encoded application/json', done => {
  const message = {
    my: 'contents',
  }

  nock('http://example.test')
    .post('/')
    .reply(function (url, actual) {
      expect(actual).to.deep.equal(message)
      done()
      return [200]
    })

  const req = http.request({
    hostname: 'example.test',
    path: '/',
    method: 'POST',
    headers: {
      'content-encoding': 'deflate',
      'content-type': 'application/json',
    },
  })

  const compressedMessage = zlib.deflateSync(JSON.stringify(message))

  req.write(compressedMessage)
  req.end()
})
