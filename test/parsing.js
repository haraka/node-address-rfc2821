'use strict'

const { describe, it } = require('node:test')
const assert = require('node:assert/strict')

const { Address } = require('..')

const expectOk = (input, want) => {
  const address = new Address(input)

  assert.equal(address.user, want.user, `user for ${JSON.stringify(input)}`)
  assert.equal(address.host, want.host, `host for ${JSON.stringify(input)}`)

  if ('original_host' in want) {
    assert.equal(
      address.original_host,
      want.original_host,
      `original_host for ${JSON.stringify(input)}`,
    )
  }

  if ('is_utf8' in want) {
    assert.equal(
      address.is_utf8,
      want.is_utf8,
      `is_utf8 for ${JSON.stringify(input)}`,
    )
  }

  return address
}

describe('Address parsing — null paths and postmaster', () => {
  it('<> parses as the null reverse-path', () => {
    const address = new Address('<>')
    assert.equal(address.user, '')
    assert.equal(address.host, '')
    assert.equal(address.isNull(), true)
  })

  it('empty string parses as the null reverse-path', () => {
    const address = new Address('')
    assert.equal(address.user, '')
    assert.equal(address.host, '')
    assert.equal(address.isNull(), true)
  })

  it('postmaster forms are accepted case-insensitively', () => {
    for (const input of [
      'postmaster',
      'Postmaster',
      'POSTMASTER',
      '<PostMaster>',
    ]) {
      expectOk(input, { user: 'postmaster', host: '' })
    }
  })
})

describe('Address parsing — local-parts and mailbox forms', () => {
  const mailboxCases = [
    ['<foo@example.com>', { user: 'foo', host: 'example.com' }],
    ['<foo+bar@example.com>', { user: 'foo+bar', host: 'example.com' }],
    ['<$foo@example.com>', { user: '$foo', host: 'example.com' }],
    ['<Pelé@example.com>', { user: 'Pelé', host: 'example.com' }],
    ['foo@example.com', { user: 'foo', host: 'example.com' }],
    ['<foo@foo.x.example.com>', { user: 'foo', host: 'foo.x.example.com' }],
    ['foo@foo.x.example.com', { user: 'foo', host: 'foo.x.example.com' }],
    ['<123@example.com>', { user: '123', host: 'example.com' }],
    ['<FooBAR@example.com>', { user: 'FooBAR', host: 'example.com' }],
    ['<a.b.c@example.com>', { user: 'a.b.c', host: 'example.com' }],
  ]

  for (const [input, want] of mailboxCases) {
    it(`${input} parses`, () => {
      expectOk(input, want)
    })
  }

  const atextSpecials = [
    '!',
    '#',
    '$',
    '%',
    '&',
    "'",
    '*',
    '+',
    '-',
    '/',
    '=',
    '?',
    '^',
    '_',
    '`',
    '{',
    '|',
    '}',
    '~',
  ]

  for (const ch of atextSpecials) {
    it(`atext "${ch}" is accepted in the local-part`, () => {
      const local = `${ch}foo`
      expectOk(`<${local}@example.com>`, { user: local, host: 'example.com' })
    })
  }

  const quotedCases = [
    ['<"foo bar"@example.com>', { user: '"foo bar"', host: 'example.com' }],
    [
      '<"user@inside"@example.com>',
      { user: '"user@inside"', host: 'example.com' },
    ],
    [
      '<"musa_ibrah@caramail.comandrea.luger"@wifo.ac.at>',
      {
        user: '"musa_ibrah@caramail.comandrea.luger"',
        host: 'wifo.ac.at',
      },
    ],
  ]

  for (const [input, want] of quotedCases) {
    it(`${input} parses`, () => {
      expectOk(input, want)
    })
  }
})

describe('Address parsing — routes and address literals', () => {
  it('single source-route hop is accepted and stripped on format', () => {
    const address = new Address('<@route.example.com:user@example.com>')
    assert.equal(address.user, 'user')
    assert.equal(address.host, 'example.com')
    assert.equal(address.format(), '<user@example.com>')
  })

  it('multiple source-route hops are accepted and stripped on format', () => {
    const address = new Address(
      '<@r1.example.com,@r2.example.com:user@example.com>',
    )
    assert.equal(address.user, 'user')
    assert.equal(address.host, 'example.com')
    assert.equal(address.format(), '<user@example.com>')
  })

  it('IPv4 literals are accepted', () => {
    expectOk('<u@[1.2.3.4]>', { user: 'u', host: '[1.2.3.4]' })
    expectOk('<u@[0.0.0.0]>', { user: 'u', host: '[0.0.0.0]' })
    expectOk('<u@[255.255.255.255]>', { user: 'u', host: '[255.255.255.255]' })
  })

  it('IPv6 literals preserve original casing while normalizing the host', () => {
    const address = expectOk('<u@[IPv6:::1]>', {
      user: 'u',
      host: '[ipv6:::1]',
      original_host: '[IPv6:::1]',
    })
    assert.equal(address.format(), '<u@[IPv6:::1]>')
  })

  it('additional IPv6 forms are accepted', () => {
    expectOk('<u@[IPv6:2001:db8::1]>', {
      user: 'u',
      host: '[ipv6:2001:db8::1]',
      original_host: '[IPv6:2001:db8::1]',
    })
    expectOk('<u@[IPv6:fe80::1]>', {
      user: 'u',
      host: '[ipv6:fe80::1]',
      original_host: '[IPv6:fe80::1]',
    })
  })
})

describe('Address parsing — host normalization and internationalization', () => {
  it('lowercases the host and preserves original_host', () => {
    const address = new Address('<u@ExAmPlE.CoM>')
    assert.equal(address.host, 'example.com')
    assert.equal(address.original_host, 'ExAmPlE.CoM')
  })

  const idnCases = [
    [
      '<андрис@уайлддак.орг>',
      {
        user: 'андрис',
        host: 'xn--80aalaxjd5d.xn--c1avg',
        original_host: 'уайлддак.орг',
        is_utf8: true,
      },
    ],
    [
      '<δοκιμή@παράδειγμα.δοκιμή>',
      {
        user: 'δοκιμή',
        host: 'xn--hxajbheg2az3al.xn--jxalpdlp',
        original_host: 'παράδειγμα.δοκιμή',
      },
    ],
    [
      '<我買@屋企.香港>',
      {
        user: '我買',
        host: 'xn--hoqu73a.xn--j6w193g',
        original_host: '屋企.香港',
      },
    ],
    [
      '<二ノ宮@黒川.日本>',
      {
        user: '二ノ宮',
        host: 'xn--5rtw95l.xn--wgv71a',
        original_host: '黒川.日本',
      },
    ],
    [
      '<медведь@с-балалайкой.рф>',
      {
        user: 'медведь',
        host: 'xn----8sbaac5cahfb0b0a.xn--p1ai',
        original_host: 'с-балалайкой.рф',
      },
    ],
    [
      '<संपर्क@डाटामेल.भारत>',
      {
        user: 'संपर्क',
        host: 'xn--c2bd4bq1db8d.xn--h2brj9c',
        original_host: 'डाटामेल.भारत',
      },
    ],
  ]

  for (const [input, want] of idnCases) {
    it(`${input} normalizes to punycode`, () => {
      expectOk(input, want)
    })
  }

  it('ASCII domains leave is_utf8 unset', () => {
    const address = new Address('<u@example.com>')
    assert.equal(address.is_utf8, undefined)
  })
})

describe('Address parsing — round-trips and RFC-5321 length limits', () => {
  const canonical = [
    '<foo@example.com>',
    '<foo+bar@example.com>',
    '<a.b.c@example.com>',
    '<u@[1.2.3.4]>',
    '<u@[IPv6:::1]>',
    '<"quoted user"@example.com>',
  ]

  for (const input of canonical) {
    it(`parse → format is identity for ${input}`, () => {
      const address = new Address(input)
      assert.equal(address.format(), input)

      const reparsed = new Address(address.format())
      assert.equal(reparsed.user, address.user)
      assert.equal(reparsed.host, address.host)
    })
  }

  it('local-part of exactly 64 octets is accepted', () => {
    const local = 'a'.repeat(64)
    expectOk(`<${local}@b>`, { user: local, host: 'b' })
  })

  it('sub-domain of 63 octets is accepted', () => {
    const subdomain = 'a'.repeat(63)
    expectOk(`<u@${subdomain}.example.com>`, {
      user: 'u',
      host: `${subdomain}.example.com`,
    })
  })

  it('path of exactly 256 octets is accepted', () => {
    const host = `${'a'.repeat(63)}.${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(59)}`
    const input = `<u@${host}>`

    assert.equal(input.length, 255)
    expectOk(input, { user: 'u', host })
  })
})
