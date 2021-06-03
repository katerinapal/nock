import imp_interceptorjs from "../lib/interceptor";
import imp_scopejs from "../lib/scope";
import imp_got_clientjs from "./got_client";
import imp_indexjs from "..";
import ext_proxyquire from "proxyquire";
import ext_chai from "chai";
import ext_path from "path";
'use strict'

// Tests for `.replyWithFile()`.

const path = ext_path
const { expect } = ext_chai
const proxyquire = ext_proxyquire.preserveCache()
const nock = imp_indexjs
const got = imp_got_clientjs

const textFilePath = path.resolve(__dirname, './assets/reply_file_1.txt')
const binaryFilePath = path.resolve(__dirname, './assets/reply_file_2.txt.gz')

describe('`replyWithFile()`', () => {
  it('reply with file', async () => {
    const scope = nock('http://example.test')
      .get('/')
      .replyWithFile(200, textFilePath)

    const { statusCode, body } = await got('http://example.test/')

    expect(statusCode).to.equal(200)
    expect(body).to.equal('Hello from the file!')

    scope.done()
  })

  it('reply with file with headers', async () => {
    const scope = nock('http://example.test')
      .get('/')
      .replyWithFile(200, binaryFilePath, {
        'content-encoding': 'gzip',
      })

    const { statusCode, body } = await got('http://example.test/')

    expect(statusCode).to.equal(200)
    expect(body).to.have.lengthOf(20)
    scope.done()
  })

  describe('with no fs', () => {
    const { Scope } = imp_scopejs

    it('throws the expected error', () => {
      expect(() =>
        new Scope('http://example.test')
          .get('/')
          .replyWithFile(200, textFilePath)
      ).to.throw(Error, 'No fs')
    })
  })
})
