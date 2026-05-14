'use strict'

const { describe, it } = require('node:test')
const assert = require('node:assert/strict')

const { Address } = require('..')

describe('Address constructors', () => {
  it('two-arg constructor sets user, host, original, and original_host', () => {
    const address = new Address('user', 'example.com')
    assert.equal(address.user, 'user')
    assert.equal(address.host, 'example.com')
    assert.equal(address.original, 'user@example.com')
    assert.equal(address.original_host, 'example.com')
  })

  it('two-arg constructor lowercases the host', () => {
    const address = new Address('user', 'ExAmPlE.CoM')
    assert.equal(address.host, 'example.com')
    assert.equal(address.original_host, 'ExAmPlE.CoM')
  })

  it('two-arg constructor normalizes UTF-8 hosts to punycode', () => {
    const address = new Address('user', 'δοκιμή.gr')
    assert.equal(address.is_utf8, true)
    assert.notEqual(address.host, 'δοκιμή.gr')
    assert.match(address.host, /^xn--/)
  })

  it('rehydrates from a plain object with an original key', () => {
    const json = {
      original: '<u@example.com>',
      user: 'u',
      host: 'example.com',
      original_host: 'example.com',
    }

    const address = new Address(json)
    assert.equal(address.user, 'u')
    assert.equal(address.host, 'example.com')
    assert.equal(address.original, '<u@example.com>')
    assert.equal(address.original_host, 'example.com')
  })

  it('round-trips through JSON.stringify/parse', () => {
    const address = new Address('<u@example.com>')
    const reparsed = new Address(JSON.parse(JSON.stringify(address)))

    assert.equal(reparsed.user, address.user)
    assert.equal(reparsed.host, address.host)
    assert.equal(reparsed.format(), address.format())
  })
})

describe('Address formatting methods', () => {
  it('format() returns <> when the address is null', () => {
    assert.equal(new Address('<>').format(), '<>')
  })

  it('format() returns the canonical form for parsed input', () => {
    assert.equal(new Address('<u@example.com>').format(), '<u@example.com>')
  })

  it('format() preserves non-Latin input by default', () => {
    const address = new Address('<přílišžluťoučkýkůň@přílišžluťoučkýkůň.cz>')
    assert.equal(address.format(), '<přílišžluťoučkýkůň@přílišžluťoučkýkůň.cz>')
  })

  it('format() preserves spaces inside quoted strings', () => {
    const address = new Address(
      '<"pří lišžlu ťoučkýkůň"@přílišžluťoučkýkůň.cz>',
    )
    assert.equal(
      address.format(),
      '<"pří lišžlu ťoučkýkůň"@přílišžluťoučkýkůň.cz>',
    )
  })

  it('format(true) renders the punycoded host', () => {
    const address = new Address('<u@δοκιμή.gr>')
    assert.match(address.format(true), /xn--/)
  })

  it('format(false) keeps the original host', () => {
    const address = new Address('<u@δοκιμή.gr>')
    assert.equal(address.format(false), '<u@δοκιμή.gr>')
    assert.equal(address.format(), '<u@δοκιμή.gr>')
  })

  it('address() returns user@host without brackets', () => {
    const address = new Address('<u@example.com>')
    assert.equal(address.address(), 'u@example.com')
  })

  it('address() returns just the user when there is no host', () => {
    const address = new Address('postmaster')
    assert.equal(address.address(), 'postmaster')
  })

  it('address() returns an empty string for the null path', () => {
    assert.equal(new Address('<>').address(), '')
  })

  it('address() can re-parse the instance in place', () => {
    const address = new Address('<a@b>')
    address.address('<c@d>')
    assert.equal(address.user, 'c')
    assert.equal(address.host, 'd')
  })

  it('address() use_punycode controls host rendering', () => {
    const address = new Address('<u@δοκιμή.gr>')
    assert.equal(address.address(null, false), 'u@δοκιμή.gr')
    assert.match(address.address(null, true), /^u@xn--/)
  })

  it('toString() matches format()', () => {
    const address = new Address('<u@example.com>')
    assert.equal(address.toString(), address.format())
  })

  it('toString() returns <> for the null path', () => {
    assert.equal(new Address('<>').toString(), '<>')
  })
})

describe('Address null checks', () => {
  it('isNull() is true for <>', () => {
    assert.equal(new Address('<>').isNull(), true)
  })

  it('isNull() is true for the empty string', () => {
    assert.equal(new Address('').isNull(), true)
  })

  it('isNull() is false for a mailbox', () => {
    assert.equal(new Address('<u@example.com>').isNull(), false)
  })

  it('isNull() is false for bare postmaster', () => {
    assert.equal(new Address('postmaster').isNull(), false)
  })
})
