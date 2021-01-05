
### 1.2.1 - 2021-01-01

- The '+' character was mistakenly missing from atext/atom definition
- package.json: tell npx the nearlyc package name


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
