'use strict'

const assert = require('node:assert/strict')

const Address = require('../index').Address

function _check(address, user, host, original_host) {
  const a = new Address(address)
  assert.equal(a.user, user)
  assert.equal(a.host, host)
  if (original_host) {
    assert.equal(a.original_host, original_host)
  }
}

describe('good addresses pass', function () {
  it('<>', function () {
    _check('<>', '', '')
  })

  it('<postmaster>', function () {
    _check('<postmaster>', 'postmaster', '')
  })

  it('<foo@example.com>', function () {
    _check('<foo@example.com>', 'foo', 'example.com')
  })

  it('<foo+bar@example.com>', function () {
    _check('<foo+bar@example.com>', 'foo+bar', 'example.com')
  })

  it('<$foo@example.com>', function () {
    _check('<$foo@example.com>', '$foo', 'example.com')
  })

  it('<"musa_ibrah@caramail.comandrea.luger"@wifo.ac.at>', function () {
    _check(
      '<"musa_ibrah@caramail.comandrea.luger"@wifo.ac.at>',
      '"musa_ibrah@caramail.comandrea.luger"',
      'wifo.ac.at',
    )
  })

  it('foo@example.com', function () {
    _check('foo@example.com', 'foo', 'example.com')
  })

  it('<foo@foo.x.example.com>', function () {
    _check('<foo@foo.x.example.com>', 'foo', 'foo.x.example.com')
  })

  it('foo@foo.x.example.com', function () {
    _check('foo@foo.x.example.com', 'foo', 'foo.x.example.com')
  })

  it('<андрис@уайлддак.орг>', function () {
    _check(
      '<андрис@уайлддак.орг>',
      'андрис',
      'xn--80aalaxjd5d.xn--c1avg',
      'уайлддак.орг',
    )
  })
})

describe('wikipedia examples: https://en.wikipedia.org/wiki/Email_address#Internationalization_examples', function () {
  it('<Pelé@example.com>', function () {
    _check('<Pelé@example.com>', 'Pelé', 'example.com')
  })

  it('<δοκιμή@παράδειγμα.δοκιμή>', function () {
    _check(
      '<δοκιμή@παράδειγμα.δοκιμή>',
      'δοκιμή',
      'xn--hxajbheg2az3al.xn--jxalpdlp',
      'παράδειγμα.δοκιμή',
    )
  })

  it('<我買@屋企.香港>', function () {
    _check('<我買@屋企.香港>', '我買', 'xn--hoqu73a.xn--j6w193g', '屋企.香港')
  })

  it('<二ノ宮@黒川.日本>', function () {
    _check(
      '<二ノ宮@黒川.日本>',
      '二ノ宮',
      'xn--5rtw95l.xn--wgv71a',
      '黒川.日本',
    )
  })

  it('<медведь@с-балалайкой.рф>', function () {
    _check(
      '<медведь@с-балалайкой.рф>',
      'медведь',
      'xn----8sbaac5cahfb0b0a.xn--p1ai',
      'с-балалайкой.рф',
    )
  })

  it('<संपर्क@डाटामेल.भारत>', function () {
    _check(
      '<संपर्क@डाटामेल.भारत>',
      'संपर्क',
      'xn--c2bd4bq1db8d.xn--h2brj9c',
      'डाटामेल.भारत',
    )
  })
})

describe('bad addresses fail', function () {
  it('foo@example.com+bob@attacker.com', function () {
    assert.throws(function () {
      new Address('foo@example.com+bob@attacker.com')
    })
  })

  it('<user@example.com#>', function () {
    assert.throws(function () {
      new Address('<user@example.com#>')
    })
  })

  it('<user@example.com>.', function () {
    assert.throws(function () {
      new Address('<user@example.com.>')
    })
  })

  it('<foo bar@example.com>', function () {
    assert.throws(function () {
      new Address('<foo bar@example.com>')
    })
  })
})

describe('isNull', function () {
  it('positive <>', function () {
    assert.ok(new Address('<>').isNull())
  })

  it('negative', function () {
    assert.ok(!new Address('<matt@example.com>').isNull())
  })
})

describe('format()', function () {
  it('works', function () {
    const addr = new Address('<matt@example.com>')
    assert.equal(addr.user, 'matt')
    assert.equal(addr.host, 'example.com')
    assert.equal(addr.format(), '<matt@example.com>')
  })

  it('lower cases hostnames', function () {
    const addr = new Address('<matt@exAMple.com>')
    assert.equal(addr.host, 'example.com')
  })

  it('no latin escaping', function () {
    const addr = new Address('<přílišžluťoučkýkůň@přílišžluťoučkýkůň.cz>')
    assert.equal(addr.format(), '<přílišžluťoučkýkůň@přílišžluťoučkýkůň.cz>')
  })

  it('spaces inside a quoted string', function () {
    const addr = new Address('<"pří lišžlu ťoučkýkůň"@přílišžluťoučkýkůň.cz>')
    assert.equal(
      addr.format(),
      '<"pří lišžlu ťoučkýkůň"@přílišžluťoučkýkůň.cz>',
    )
  })
})
