[![Build Status][ci-img]][ci-url]
[![Dependencies][dep-img]][dep-url]
[![Coverage Status][cov-img]][cov-url]
[![WinCI status][win-ci-img]][win-ci-url]

# address-rfc2821

Parser for RFC2821 (Envelope) format email addresses.

This module parses RFC2821 email address from the SMTP envelope. These are the
portions immediately following the SMTP verbs `MAIL FROM:` and `RCPT TO:`. RFC 2821 (and 5321) email addesses look like this:

````
<>             // null
<from@sender.com>
<to@sender.com>
````

To parse email addresses contained in the message headers (To: From: BCC, CC), look instead at an RFC 2822/5322 parser such as [email-addresses](https://www.npmjs.com/package/email-addresses).


Installation
------------

    npm install address-rfc2821

Usage
-----

    var Address = require('address-rfc2821').Address;

    var parsed = new Address('<user@example.com>');


License
-------

This module is MIT licensed.


[ci-img]: https://travis-ci.org/haraka/node-address-rfc2821.svg?branch=master
[ci-url]: https://travis-ci.org/haraka/node-address-rfc2821
[dep-img]: https://david-dm.org/haraka/node-address-rfc2821.svg
[dep-url]: https://david-dm.org/haraka/node-address-rfc2821
[cov-img]: https://codecov.io/github/haraka/node-address-rfc2821/coverage.svg?branch=master
[cov-url]: https://codecov.io/github/haraka/node-address-rfc2821?branch=master
[win-ci-img]: https://ci.appveyor.com/api/projects/status/ai1jt6yrphrehpg9?svg=true
[win-ci-url]: https://ci.appveyor.com/project/msimerson/node-address-rfc2821-1wf12/branch/master
