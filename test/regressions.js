'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')

const { Address } = require('..')

const expectReject = (input) => {
  assert.throws(
    () => new Address(input),
    (err) => err.name !== 'TypeError',
    `Address(${JSON.stringify(input)}) should throw a parse Error, not a TypeError`,
  )
}

test('invalid inputs throw parse errors instead of internal TypeErrors', () => {
  const invalidInputs = [
    'a',
    'foo',
    'foo@example.com+bob@attacker.com',
    'no-brackets@host+second@host',
    '<user@example.com#>',
    '<user@example.com.>',
    '<foo bar@example.com>',
    '<>>',
    '<@>',
    '<"unterminated',
    '<@route:user@host',
    `<${'a'.repeat(65)}@b>`,
    `<u@${'a'.repeat(300)}>`,
    `<u@${'ñ'.repeat(129)}>`,
  ]

  for (const input of invalidInputs) {
    expectReject(input)
  }
})

test('long inputs do not trigger super-linear parse time', () => {
  const input = '<@a:b@' + 'A'.repeat(10000) + '>'

  try {
    new Address('<@a:b@' + 'A'.repeat(50) + '>')
  } catch {
    /* irrelevant */
  }

  const started = process.hrtime.bigint()
  try {
    new Address(input)
  } catch {
    /* parse may legitimately reject; we only care about time */
  }
  const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6

  assert.ok(
    elapsedMs < 500,
    `source-route parse on 10000-char host took ${elapsedMs.toFixed(0)}ms — super-linear time complexity in nearley grammar`,
  )
})

test('parse rejection on long invalid input does not take seconds', () => {
  const input = '<"x"@a' + 'A'.repeat(16000)

  const started = process.hrtime.bigint()
  try {
    new Address(input)
  } catch {
    /* rejection is expected; we are checking responsiveness */
  }
  const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6

  assert.ok(
    elapsedMs < 1000,
    `parsing a 16KB malformed input took ${elapsedMs.toFixed(0)}ms — parser rejection path is super-linear`,
  )
})
