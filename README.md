[![Build Status][ci-img]][ci-url]
[![Coverage Status][cov-img]][cov-url]

# address-rfc2821

Parser for RFC-821/RFC-2821/RFC-5321 (envelope) format email addresses (Mailbox and Path).

This module parses email addresses from the SMTP envelope. These are the portions immediately following the SMTP verbs `MAIL FROM:` and `RCPT TO:`. RFC-5321 email addesses look like this:

```
<>             // null
<Postmaster>
<from@example.com>
<to@example.com>
<dot.atom.string@example.com>
<"quoted string"@example.com>
angle-brackets-optional@example.com
```

To parse email addresses contained in the message headers (To: From: BCC, CC), look instead at an RFC 2822/5322 parser such as [address-rfc2822](https://www.npmjs.com/package/address-rfc2822) or [email-addresses](https://www.npmjs.com/package/email-addresses).

## Installation

    npm install address-rfc2821

## Usage

    const Address = require('address-rfc2821').Address;

    const parsed = new Address('<user@example.com>');

# Address Object

The Address object is an interface to reading email addresses passed in at
SMTP time. It parses all the formats in RFC-2821 and 2822, as well as UTF8
email addresses according to the RFCs 5890, 5891 and 5892 providing the
domain in punycode when encountered It also supports correctly escaping
email addresses.

## API

- new Address (user, host)

Create a new address object for user@host

- new Address (email)

Creates a new address object by parsing the email address. Will throw an
exception if the address cannot be parsed.

- address.user

Access the local part of the email address

- address.host

Access the domain part of the email address, decoded if necessary to punycode

- address.original_host

Access the domain part of the email address, unencoded and case preserved

- address.format(use_punycode=false)

Provides the email address in the appropriate `<user@host>` format. And
deals correctly with the null sender and local names.

If use_punycode = true, uses address.host instead of address.original_host.

- address.toString()

Same as format().

- address.address(newval=null, use_punycode=false)

Provides the email address in 'user@host' format.

If use_punycode = true, uses address.host instead of address.original_host.

## License

This module is MIT licensed.

[ci-img]: https://github.com/haraka/node-address-rfc2821/actions/workflows/ci.yml/badge.svg
[ci-url]: https://github.com/haraka/node-address-rfc2821/actions/workflows/ci.yml
[cov-img]: https://codecov.io/github/haraka/node-address-rfc2821/coverage.svg?branch=master
[cov-url]: https://codecov.io/github/haraka/node-address-rfc2821?branch=master
