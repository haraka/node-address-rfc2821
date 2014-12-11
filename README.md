# address-rfc2822

[![Build
Status](https://travis-ci.org/haraka/node-address-rfc2821.svg?branch=master)](https://travis-ci.org/haraka/node-address-rfc2821)
[![Coverage
Status](https://coveralls.io/repos/haraka/node-address-rfc2821/badge.png)](https://coveralls.io/r/haraka/node-address-rfc2821)


Parser for RFC2821 (Envelope) format email addresses.

This module parses RFC2821 headers containing addresses such as From, To, CC, and Bcc headers.

It is extracted from the mail server [Haraka](http://haraka.github.io/).

Installation
------------

    npm install address-rfc2821

Usage
-----

    var addrparser = require('address-rfc2821');

    var addresses = addrparser.parse("Matt Simerson <matt@tnpi.net>");
    var address = addresses[0];


License
-------

This module is MIT licensed.
