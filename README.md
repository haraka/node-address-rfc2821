# address-rfc2821

[![Build Status][ci-img]][ci-url]
[![Dependencies][dep-img]][dep-url]
[![Coverage Status][cov-img]][cov-url]
[![WinCI status][win-ci-img]][win-ci-url]

Parser for RFC2821 (Envelope) format email addresses.

This module parses RFC2821 headers containing addresses such as From, To, CC, and Bcc headers.

It is extracted from the mail server [Haraka](http://haraka.github.io/).

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
[cov-img]: https://coveralls.io/repos/haraka/node-address-rfc2821/badge.png
[cov-url]: https://coveralls.io/r/haraka/node-address-rfc2821
[win-ci-img]: https://ci.appveyor.com/api/projects/status/ai1jt6yrphrehpg9?svg=true
[win-ci-url]: https://ci.appveyor.com/project/msimerson/node-address-rfc2821-1wf12/branch/master
