import ext_assertrejects from "assert-rejects";
import got_client_got_clientjs from "./got_client";
import _indexjs from "..";
import ext_chai from "chai";
'use strict'

const { expect } = ext_chai
const nock = _indexjs
const got = got_client_got_clientjs
const assertRejects = ext_assertrejects

describe('repeating', () => {
  it('`once()`', async () => {
    const scope = nock('http://example.test')
      .get('/')
      .once()
      .reply(200, 'Hello World!')

    const { statusCode } = await got('http://example.test/')
    expect(statusCode).to.equal(200)

    await assertRejects(
      got('http://example.test/'),
      /Nock: No match for request/
    )

    scope.done()
  })

  it('`twice()`', async () => {
    const scope = nock('http://example.test')
      .get('/')
      .twice()
      .reply(200, 'Hello World!')

    // eslint-disable-next-line no-unused-vars
    for (const _ of Array(2)) {
      const { statusCode } = await got('http://example.test/')
      expect(statusCode).to.equal(200)
    }

    await assertRejects(
      got('http://example.test/'),
      /Nock: No match for request/
    )

    scope.done()
  })

  it('`thrice()`', async () => {
    const scope = nock('http://example.test')
      .get('/')
      .thrice()
      .reply(200, 'Hello World!')

    // eslint-disable-next-line no-unused-vars
    for (const _ of Array(3)) {
      const { statusCode } = await got('http://example.test/')
      expect(statusCode).to.equal(200)
    }

    await assertRejects(
      got('http://example.test/'),
      /Nock: No match for request/
    )

    scope.done()
  })

  describe('`times()`', () => {
    it('repeating 4 times', async () => {
      const scope = nock('http://example.test')
        .get('/')
        .times(4)
        .reply(200, 'Hello World!')

      // eslint-disable-next-line no-unused-vars
      for (const _ of Array(4)) {
        const { statusCode } = await got('http://example.test/')
        expect(statusCode).to.equal(200)
      }

      await assertRejects(
        got('http://example.test/'),
        /Nock: No match for request/
      )

      scope.done()
    })

    it('invalid argument is ignored', async () => {
      const scope = nock('http://example.test')
        .get('/')
        .times(0)
        .reply(200, 'Hello World!')

      const { statusCode } = await got('http://example.test/')
      expect(statusCode).to.equal(200)

      await assertRejects(
        got('http://example.test/'),
        /Nock: No match for request/
      )

      scope.done()
    })
  })

  it('`isDone()` considers repeated responses', async () => {
    const scope = nock('http://example.test').get('/').times(2).reply(204)

    // eslint-disable-next-line no-unused-vars
    for (const _ of Array(2)) {
      expect(scope.isDone()).to.be.false()
      await got('http://example.test/')
    }
    expect(scope.isDone()).to.be.true()
  })
})
