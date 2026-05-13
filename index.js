'use strict'

const punycode = require('punycode/')
const nearley = require('nearley')

const grammar = nearley.Grammar.fromCompiled(require('./grammar.js'))
grammar.start = 'main'

// a class encapsulating an email address per RFC-5321

class Address {
  constructor(user, host) {
    if (typeof user === 'object' && user.original) {
      // Assume constructing from JSON parse
      for (const k in user) {
        this[k] = user[k]
      }
      return this
    }
    if (!host) {
      this.original = user
      this.parse(user)
    } else {
      this.original = `${user}@${host}`
      this.user = user
      this.original_host = host

      if (/[\u0080-\uFFFF]/.test(host)) {
        this.is_utf8 = true
        host = punycode.toASCII(host)
      }

      this.host = host.toLowerCase()
    }
  }

  parse(addr) {
    // empty addr is ok
    if (addr === '' || addr === '<>') {
      this.user = ''
      this.host = ''
      return
    }

    // bare postmaster is permissible: RFC-5321 (4.1.1.3)
    switch (addr.toLowerCase()) {
      case 'postmaster':
      case '<postmaster>':
        this.user = 'postmaster'
        this.host = ''
        return
    }

    // RFC-5321 \u00A74.5.3.1.3: a reverse-path or forward-path is at most
    // 256 octets including punctuation. Enforcing this up front also
    // avoids the underlying nearley grammar's O(n\u00B2) behavior on long
    // atoms, which would otherwise be a DoS surface.
    const addrBytes = Buffer.byteLength(addr, 'utf8')
    if (addrBytes > 256) {
      throw new Error(`RFC-5321 path exceeds 256 octets (${addrBytes} given)`)
    }

    const parser = new nearley.Parser(grammar)

    try {
      parser.feed(addr)
    } catch (err) {
      // nearley throws on unexpected tokens; surface as a parse error
      throw new Error(`Invalid RFC-5321 address: ${err.message}`)
    }
    if (!parser.results.length) {
      throw new Error(`Invalid RFC-5321 address: ${JSON.stringify(addr)}`)
    }
    const result = parser.results[0][0]

    let domainpart = result.domain
    this.original_host = domainpart

    // RFC-5321 \u00A74.5.3.1.1 / \u00A74.5.3.1.2: 64 octet local-part,
    // 255 octet domain.
    if (Buffer.byteLength(result.local_part, 'utf8') > 64) {
      throw new Error('RFC-5321 local-part exceeds 64 octets')
    }
    if (Buffer.byteLength(domainpart, 'utf8') > 255) {
      throw new Error('RFC-5321 domain exceeds 255 octets')
    }

    if (/[\u0080-\uFFFF]/.test(domainpart)) {
      this.is_utf8 = true
      domainpart = punycode.toASCII(domainpart)
    }

    this.host = domainpart.toLowerCase()
    this.user = result.local_part
  }

  isNull() {
    return !this.user
  }

  format(use_punycode) {
    if (this.isNull()) return '<>'

    return `<${this.address(null, use_punycode)}>`
  }

  address(set, use_punycode) {
    if (set) {
      this.original = set
      this.parse(set)
    }
    return (
      (this.user || '') +
      (this.original_host
        ? `@${use_punycode ? this.host : this.original_host}`
        : '')
    )
  }

  toString() {
    return this.format()
  }
}

exports.Address = Address
