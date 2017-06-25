'use strict';

var punycode = require('punycode');

// a class encapsulating an email address per RFC-2821

var qchar = /([^a-zA-Z0-9!#\$\%\&\x27\*\+\x2D\/=\?\^_`{\|}~.\u0100-\uFFFF])/;

function Address (user, host) {
    if (typeof user === 'object' && user.original) {
        // Assume constructing from JSON parse
        for (var k in user) {
            this[k] = user[k];
        }
        return this;
    }
    var match = /^<(.*)>$/.exec(user);
    if (match) {
        this.original = user;
        this.parse(match[1]);
    }
    else if (!host) {
        this.original = user;
        this.parse(user);
    }
    else {
        this.original = user + '@' + host;
        this.user = user;
        this.original_host = host;

        if (/[\u0100-\uFFFF]/.test(host)) {
            this.is_utf8 = true;
            host = punycode.toASCII(host);
        }

        this.host = host;
    }

}

var idn_allowed = require('./_idn');

exports.atom_expr = /[a-zA-Z0-9!#%&*+=?\^_`{|}~\$\x27\x2D\/\u0100-\uFFFF]+/;
exports.address_literal_expr =
  /(?:\[(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|IPv6:[0-9A-Fa-f:.]+)\])/;
// exports.subdomain_expr = /(?:[a-zA-Z0-9](?:[_\-a-zA-Z0-9]*[a-zA-Z0-9])?)/;
exports.subdomain_expr = new RegExp('(?:' + idn_allowed.source + '(?:(?:[_\-]|' + idn_allowed.source + ')*' + idn_allowed.source + ')?)');

// you can override this when loading and re-run compile_re()
exports.domain_expr = undefined;

/* eslint no-control-regex: 0 */
exports.qtext_expr = /[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F\u0100-\uFFFF]/;
exports.text_expr  = /\\([\x01-\x09\x0B\x0C\x0E-\x7F])/;

var domain_re;
var source_route_re;
var user_host_re;
var atoms_re;
var qt_re;

exports.compile_re = function () {
    domain_re = exports.domain_expr || new RegExp (
        exports.subdomain_expr.source +
            '(?:\\.' + exports.subdomain_expr.source + ')*'
    );

    if (!exports.domain_expr && exports.address_literal_expr) {
        // if address_literal_expr is set, add it in
        domain_re = new RegExp('(?:' + exports.address_literal_expr.source +
                               '|'   + domain_re.source + ')');
    }

    source_route_re = new RegExp('^@' + domain_re.source +
                                 '(?:,@' + domain_re.source + ')*:');

    user_host_re = new RegExp('^(.*)@(' + domain_re.source + ')$');

    atoms_re = new RegExp('^' + exports.atom_expr.source +
                          '(\\.' + exports.atom_expr.source + ')*');

    qt_re = new RegExp('^"((' + exports.qtext_expr.source +
                       '|' + exports.text_expr.source + ')*)"$');
};

exports.compile_re();

Address.prototype.parse = function (addr) {
    // strip source route
    addr = addr.replace(source_route_re, '');

    // empty addr is ok
    if (addr === '') {
        this.user = '';
        this.host = '';
        return;
    }

    // bare postmaster is permissible: RFC-2821 (4.5.1)
    if (addr.toLowerCase() === 'postmaster') {
        this.user = 'postmaster';
        this.host = '';
        return;
    }

    var matches = user_host_re.exec(addr);

    if (!matches) {
        throw new Error('Invalid domain in address: ' + addr);
    }

    var localpart  = matches[1];
    var domainpart = matches[2];
    this.original_host = domainpart;

    if (/[\u0100-\uFFFF]/.test(domainpart)) {
        this.is_utf8 = true;
        domainpart = punycode.toASCII(domainpart);
    }

    this.host = domainpart.toLowerCase();

    if (atoms_re.test(localpart)) {
        // simple case, we are done
        this.user = localpart;
        return;
    }
    matches = qt_re.exec(localpart);
    if (matches) {
        localpart = matches[1];
        this.user = localpart.replace(exports.text_expr, '$1', 'g');
        return;
    }
    throw new Error('Invalid local part in address: ' + addr);
};

Address.prototype.isNull = function () {
    return this.user ? 0 : 1;
};

Address.prototype.format = function (use_punycode) {
    if (this.isNull()) {
        return '<>';
    }

    var user = this.user.replace(qchar, '\\$1', 'g');
    if (user !== this.user) {
        return '<"' + user + '"' + (this.original_host ? ('@' + (use_punycode ? this.host : this.original_host)) : '') + '>';
    }
    return '<' + this.address(null, use_punycode) + '>';
};

Address.prototype.address = function (set, use_punycode) {
    if (set) {
        this.original = set;
        this.parse(set);
    }
    return (this.user || '') + (this.original_host ? ('@' + (use_punycode ? this.host : this.original_host)) : '');
};

Address.prototype.toString = function () {
    return this.format();
};

exports.Address = Address;
