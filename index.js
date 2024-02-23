'use strict';

const punycode = require('punycode/');
const nearley  = require('nearley');

const grammar = nearley.Grammar.fromCompiled(require('./grammar.js'));
grammar.start = 'main';

// a class encapsulating an email address per RFC-5321

class Address {
    constructor (user, host) {
        if (typeof user === 'object' && user.original) {
            // Assume constructing from JSON parse
            for (const k in user) {
                this[k] = user[k];
            }
            return this;
        }
        if (!host) {
            this.original = user;
            this.parse(user);
        }
        else {
            this.original = `${user}@${host}`;
            this.user = user;
            this.original_host = host;

            if (/[\u0080-\uFFFF]/.test(host)) {
                this.is_utf8 = true;
                host = punycode.toASCII(host);
            }

            this.host = host.toLowerCase();
        }
    }

    parse (addr) {
        // empty addr is ok
        if (addr === '' || addr === '<>') {
            this.user = '';
            this.host = '';
            return;
        }

        // bare postmaster is permissible: RFC-5321 (4.1.1.3)
        switch (addr.toLowerCase()) {
            case 'postmaster':
            case '<postmaster>':
                this.user = 'postmaster';
                this.host = '';
                return;
        }

        const parser = new nearley.Parser(grammar);

        parser.feed(addr);
        const result = parser.results[0][0];

        let domainpart = result.domain;
        this.original_host = domainpart;

        if (/[\u0080-\uFFFF]/.test(domainpart)) {
            this.is_utf8 = true;
            domainpart = punycode.toASCII(domainpart);
        }

        this.host = domainpart.toLowerCase();
        this.user = result.local_part;
    }

    isNull () {
        return this.user ? 0 : 1;
    }

    format (use_punycode) {
        if (this.isNull()) return '<>';

        return `<${this.address(null, use_punycode)}>`;
    }

    address (set, use_punycode) {
        if (set) {
            this.original = set;
            this.parse(set);
        }
        return (this.user || '') + (this.original_host ? `@${(use_punycode ? this.host : this.original_host)}` : '');
    }

    toString () {
        return this.format();
    }
}

exports.Address = Address;
