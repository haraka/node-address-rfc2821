'use strict';

var assert = require('assert');

var Address = require('../index').Address;

function _check(address, user, host, original_host) {
    var a = new Address(address);
    assert.equal(a.user, user);
    assert.equal(a.host, host);
    if (original_host) {
        assert.equal(a.original_host, original_host);
    }
}

describe('good addresses pass', function () {

    it('<>', function () {
        _check('<>', '', '');
    });

    it('<postmaster>', function () {
        _check('<postmaster>', 'postmaster', '');
    });

    it('<foo@example.com>', function () {
        _check('<foo@example.com>', 'foo', 'example.com');
    });

    it('<"musa_ibrah@caramail.comandrea.luger"@wifo.ac.at>', function () {
        _check('<"musa_ibrah@caramail.comandrea.luger"@wifo.ac.at>',
            'musa_ibrah@caramail.comandrea.luger', 'wifo.ac.at');
    });

    it('<foo bar@example.com>', function () {
        _check('<foo bar@example.com>', 'foo bar', 'example.com');
    });

    it('foo@example.com', function () {
        _check('foo@example.com', 'foo', 'example.com');
    });

    it('<foo@foo.x.example.com>', function () {
        _check('<foo@foo.x.example.com>', 'foo', 'foo.x.example.com');
    });

    it('foo@foo.x.example.com', function () {
        _check('foo@foo.x.example.com', 'foo', 'foo.x.example.com');
    });

    it('<андрис@уайлддак.орг>', function () {
        _check('<андрис@уайлддак.орг>', 'андрис', 'xn--80aalaxjd5d.xn--c1avg', 'уайлддак.орг');
    });
});

describe('bad addresses fail', function () {

    it('<user@example.com#>', function () {
        assert.throws(function () {
            new Address('<user@example.com#>');
        });
    });

    it('<user@example.com>.', function () {
        assert.throws(function () {
            new Address('<user@example.com.>');
        });
    });
});

describe('compile_re', function () {

    it('compiles with no exceptions', function () {
        var addr = require('../index');
        addr.compile_re();
        assert.ok(addr);
    });
});

describe('isNull', function () {
    it('positive <>', function () {
        assert.ok(new Address('<>').isNull());
    });

    it('negative', function () {
        assert.ok(!new Address('<matt@example.com>').isNull());
    });
});

describe('format()', function () {
    it('works', function (done) {
        var addr = new Address('<matt@example.com>');
        assert.equal(addr.user, 'matt');
        assert.equal(addr.host, 'example.com');
        assert.equal(addr.format(), '<matt@example.com>');
        done();
    });

    it('lower cases hostnames', function (done) {
        var addr = new Address('<matt@exAMple.com>');
        assert.equal(addr.host, 'example.com');
        done();
    });
});
