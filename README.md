# address-rfc2822


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