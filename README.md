[![Build Status][ci-img]][ci-url]
[![Dependencies][dep-img]][dep-url]
[![Coverage Status][cov-img]][cov-url]
[![WinCI status][win-ci-img]][win-ci-url]
[![Greenkeeper badge](https://badges.greenkeeper.io/haraka/node-address-rfc2821.svg)](https://greenkeeper.io/)

# address-rfc2821

Parser for RFC2821 (Envelope) format email addresses.

This module parses RFC2821 email address from the SMTP envelope. These are the
portions immediately following the SMTP verbs `MAIL FROM:` and `RCPT TO:`. RFC 2821 (and 5321) email addesses look like this:

````
<>             // null
<from@sender.com>
<to@sender.com>
````

To parse email addresses contained in the message headers (To: From: BCC, CC), look instead at an RFC 2822/5322 parser such as [address-rfc2822](https://www.npmjs.com/package/address-rfc2822) or [email-addresses](https://www.npmjs.com/package/email-addresses).


Installation
------------

    npm install address-rfc2821

Usage
-----

    var Address = require('address-rfc2821').Address;

    var parsed = new Address('<user@example.com>');


# Address Object

The Address object is an interface to reading email addresses passed in at
SMTP time. It parses all the formats in RFC-2821 and 2822, as well as UTF8
email addresses according to the RFCs 5890, 5891 and 5892 providing the
domain in punycode when encountered It also supports correctly escaping
email addresses.

## API

* new Address (user, host)

Create a new address object for user@host

* new Address (email)

Creates a new address object by parsing the email address. Will throw an
exception if the address cannot be parsed.

* address.user

Access the local part of the email address

* address.host

Access the domain part of the email address, decoded if necessary to punycode

* address.original_host

Access the domain part of the email address, unencoded and case preserved

* address.format(use_punycode=false)

Provides the email address in the appropriate `<user@host>` format. And
deals correctly with the null sender and local names.

If use_punycode = true, uses address.host instead of address.original_host.

* address.toString()

Same as format().

* address.address(newval=null, use_punycode=false)

Provides the email address in 'user@host' format.

If use_punycode = true, uses address.host instead of address.original_host.

Advanced Usage
--------------

It is possible to mess with the regular expressions used to match addresses
for stricter or less strict matching.

To change the behaviour mess with the following variables:

    var adr = require('address-rfc2821');
    // Now change one of the following. Note they are RegExp objects NOT strings.
    adr.atom_expr;
    adr.address_literal_expr;
    adr.subdomain_expr;
    adr.domain_expr;
    adr.qtext_expr;
    adr.text_expr;
    // Don't forget to recompile:
    adr.compile_re();


License
-------

This module is MIT licensed.


[ci-img]: https://travis-ci.org/haraka/node-address-rfc2821.svg?branch=master
[ci-url]: https://travis-ci.org/haraka/node-address-rfc2821
[dep-img]: https://david-dm.org/haraka/node-address-rfc2821.svg
[dep-url]: https://david-dm.org/haraka/node-address-rfc2821
[cov-img]: https://codecov.io/github/haraka/node-address-rfc2821/coverage.svg?branch=master
[cov-url]: https://codecov.io/github/haraka/node-address-rfc2821?branch=master
[win-ci-img]: https://ci.appveyor.com/api/projects/status/rwk0n1mu0124chdb?svg=true
[win-ci-url]: https://ci.appveyor.com/project/msimerson/node-address-rfc2821/branch/master
