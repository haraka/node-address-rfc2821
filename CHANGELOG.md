# Changelog

The format is based on [Keep a Changelog](https://keepachangelog.com/).

### Unreleased

### [2.1.4] - 2026-01-18

- feat: add TypeScript type definitions #53
- docs: enable syntax highlighting #52
- chore: replace .npmignore with package.json[files]

### [2.1.3] - 2025-01-31

- dep(eslint): upgrade to v9
- doc: mv Changes.md CHANGELOG.md
- doc(CONTRIBUTORS): added
- doc(Changes): fix markdown formatting (#50)
- style: prettier

### [2.1.2] - 2024-02-23

- load npm version of punycode (specify / after require)
- dep(mocha): remove dev dep (installed by npx)
- dep(punycode): bump 2.3.0 to 2.3.1

### 2.1.1 - 2023-08-22

- feat: bundle grammar.js, build with prepack, fixes #46
- ci: updated to latest
- added .release
- README: update badge URLs

### 2.0.1 - 2021-01-21

- grammer.ne: add polyfill for Array.flat (#43)
- restore compatibility with Node < 12
- restore node 10 testing

### 2.0.0 - 2021-01-05

- major version bump, nearley output requires node.js > 11
- package.json: declare dependency on node >= 12

### 1.2.3 - 2021-01-05

- revert nearley version in 1.x line, incompatible with node < 11

### 1.2.2 - 2021-01-05

- package.json: remove spurious < character #37
- README: update for es6 syntax #36

### 1.2.1 - 2021-01-01

- The '+' character was mistakenly missing from atext/atom definition #31
- package.json: tell npx the nearlyc package name #34

### 1.2.0 - 2020-12-25

- Replace regular expression based parser with parser based on <https://nearley.js.org/>
- Double quote characters are not stripped from the local-part of the address if present.
- No added escaping is attempted inside quoted-strings

### 1.1.4 - 2020-12-14

- packaging updates
- replace Travis CI & AppVeyor for GH Actions

### 1.1.3 - 2018-05-11

- change unicode regexps to not escape latin chars #15

### 1.1.2 - 2017-06-25

- remove dev dependency versions

### 1.1.1

- Fix a bug when using the constructor to generate an address

### 1.1.0

- support IDN email addresses

### 1.0.0 - 2016-12-08

- replaced null host or user values with empty strings

[1.1.4]: https://github.com/haraka/node-address-rfc2821/releases/tag/1.1.4
[2.0.0]: https://github.com/haraka/node-address-rfc2821/releases/tag/2.0.0
[2.1.0]: https://github.com/haraka/node-address-rfc2821/releases/tag/v2.1.0
[2.1.1]: https://github.com/haraka/node-address-rfc2821/releases/tag/v2.1.1
[2.1.2]: https://github.com/haraka/node-address-rfc2821/releases/tag/v2.1.2
[2.1.3]: https://github.com/haraka/node-address-rfc2821/releases/tag/v2.1.3
[2.1.4]: https://github.com/haraka/node-address-rfc2821/releases/tag/v2.1.4
