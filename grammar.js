// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
;(function () {
  function id(x) {
    return x[0]
  }

  // from https://github.com/jonathantneal/array-flat-polyfill
  if (!Array.prototype.flat) {
    Object.defineProperty(Array.prototype, 'flat', {
      configurable: true,
      value: function flat() {
        var depth = isNaN(arguments[0]) ? 1 : Number(arguments[0])

        return depth
          ? Array.prototype.reduce.call(
              this,
              function (acc, cur) {
                if (Array.isArray(cur)) {
                  acc.push.apply(acc, flat.call(cur, depth - 1))
                } else {
                  acc.push(cur)
                }

                return acc
              },
              [],
            )
          : Array.prototype.slice.call(this)
      },
      writable: true,
    })
  }

  function flat_string(d) {
    if (d) {
      if (Array.isArray(d)) return d.flat(Infinity).join('')
      return d
    }
    return ''
  }
  var grammar = {
    Lexer: undefined,
    ParserRules: [
      { name: 'main', symbols: ['Mailbox'] },
      { name: 'main', symbols: ['Path'] },
      { name: 'Reverse_path', symbols: ['Path'] },
      {
        name: 'Reverse_path$string$1',
        symbols: [{ literal: '<' }, { literal: '>' }],
        postprocess: function joiner(d) {
          return d.join('')
        },
      },
      { name: 'Reverse_path', symbols: ['Reverse_path$string$1'] },
      { name: 'Forward_path', symbols: ['Path'] },
      {
        name: 'Path$ebnf$1$subexpression$1',
        symbols: ['A_d_l', { literal: ':' }],
      },
      {
        name: 'Path$ebnf$1',
        symbols: ['Path$ebnf$1$subexpression$1'],
        postprocess: id,
      },
      {
        name: 'Path$ebnf$1',
        symbols: [],
        postprocess: function (d) {
          return null
        },
      },
      {
        name: 'Path',
        symbols: [{ literal: '<' }, 'Path$ebnf$1', 'Mailbox', { literal: '>' }],
        postprocess: function (d) {
          return d[2]
        },
      },
      { name: 'A_d_l$ebnf$1', symbols: [] },
      {
        name: 'A_d_l$ebnf$1$subexpression$1',
        symbols: [{ literal: ',' }, 'At_domain'],
      },
      {
        name: 'A_d_l$ebnf$1',
        symbols: ['A_d_l$ebnf$1', 'A_d_l$ebnf$1$subexpression$1'],
        postprocess: function arrpush(d) {
          return d[0].concat([d[1]])
        },
      },
      { name: 'A_d_l', symbols: ['At_domain', 'A_d_l$ebnf$1'] },
      { name: 'At_domain', symbols: [{ literal: '@' }, 'Domain'] },
      { name: 'Domain$ebnf$1', symbols: [] },
      {
        name: 'Domain$ebnf$1$subexpression$1',
        symbols: [{ literal: '.' }, 'sub_domain'],
      },
      {
        name: 'Domain$ebnf$1',
        symbols: ['Domain$ebnf$1', 'Domain$ebnf$1$subexpression$1'],
        postprocess: function arrpush(d) {
          return d[0].concat([d[1]])
        },
      },
      { name: 'Domain', symbols: ['sub_domain', 'Domain$ebnf$1'] },
      { name: 'sub_domain', symbols: ['U_label'] },
      { name: 'Let_dig', symbols: ['ALPHA_DIGIT'], postprocess: id },
      { name: 'Ldh_str$ebnf$1', symbols: [] },
      {
        name: 'Ldh_str$ebnf$1',
        symbols: ['Ldh_str$ebnf$1', 'ALPHA_DIG_DASH'],
        postprocess: function arrpush(d) {
          return d[0].concat([d[1]])
        },
      },
      { name: 'Ldh_str', symbols: ['Ldh_str$ebnf$1', 'Let_dig'] },
      { name: 'U_Let_dig', symbols: ['ALPHA_DIGIT_U'], postprocess: id },
      { name: 'U_Ldh_str$ebnf$1', symbols: [] },
      {
        name: 'U_Ldh_str$ebnf$1',
        symbols: ['U_Ldh_str$ebnf$1', 'ALPHA_DIG_DASH_U'],
        postprocess: function arrpush(d) {
          return d[0].concat([d[1]])
        },
      },
      { name: 'U_Ldh_str', symbols: ['U_Ldh_str$ebnf$1', 'U_Let_dig'] },
      { name: 'U_label$ebnf$1$subexpression$1', symbols: ['U_Ldh_str'] },
      {
        name: 'U_label$ebnf$1',
        symbols: ['U_label$ebnf$1$subexpression$1'],
        postprocess: id,
      },
      {
        name: 'U_label$ebnf$1',
        symbols: [],
        postprocess: function (d) {
          return null
        },
      },
      { name: 'U_label', symbols: ['U_Let_dig', 'U_label$ebnf$1'] },
      {
        name: 'address_literal$subexpression$1',
        symbols: ['IPv4_address_literal'],
      },
      {
        name: 'address_literal$subexpression$1',
        symbols: ['IPv6_address_literal'],
      },
      {
        name: 'address_literal$subexpression$1',
        symbols: ['General_address_literal'],
      },
      {
        name: 'address_literal',
        symbols: [
          { literal: '[' },
          'address_literal$subexpression$1',
          { literal: ']' },
        ],
      },
      { name: 'non_local_part', symbols: ['Domain'] },
      { name: 'non_local_part', symbols: ['address_literal'] },
      {
        name: 'Mailbox',
        symbols: ['Local_part', { literal: '@' }, 'non_local_part'],
        postprocess: function (d) {
          return { local_part: flat_string(d[0]), domain: flat_string(d[2]) }
        },
      },
      { name: 'Local_part', symbols: ['Dot_string'] },
      { name: 'Local_part', symbols: ['Quoted_string'] },
      { name: 'Dot_string$ebnf$1', symbols: [] },
      {
        name: 'Dot_string$ebnf$1$subexpression$1',
        symbols: [{ literal: '.' }, 'Atom'],
      },
      {
        name: 'Dot_string$ebnf$1',
        symbols: ['Dot_string$ebnf$1', 'Dot_string$ebnf$1$subexpression$1'],
        postprocess: function arrpush(d) {
          return d[0].concat([d[1]])
        },
      },
      { name: 'Dot_string', symbols: ['Atom', 'Dot_string$ebnf$1'] },
      {
        name: 'Atom$ebnf$1',
        symbols: [/[0-9A-Za-z!#$%&'*+\-/=?^_`{|}~\u0080-\uFFFF/]/],
      },
      {
        name: 'Atom$ebnf$1',
        symbols: [
          'Atom$ebnf$1',
          /[0-9A-Za-z!#$%&'*+\-/=?^_`{|}~\u0080-\uFFFF/]/,
        ],
        postprocess: function arrpush(d) {
          return d[0].concat([d[1]])
        },
      },
      { name: 'Atom', symbols: ['Atom$ebnf$1'] },
      { name: 'Quoted_string$ebnf$1', symbols: [] },
      {
        name: 'Quoted_string$ebnf$1',
        symbols: ['Quoted_string$ebnf$1', 'QcontentSMTP'],
        postprocess: function arrpush(d) {
          return d[0].concat([d[1]])
        },
      },
      {
        name: 'Quoted_string',
        symbols: ['DQUOTE', 'Quoted_string$ebnf$1', 'DQUOTE'],
      },
      { name: 'QcontentSMTP', symbols: ['qtextSMTP'] },
      { name: 'QcontentSMTP', symbols: ['quoted_pairSMTP'] },
      { name: 'quoted_pairSMTP', symbols: [{ literal: '\\' }, /[\x20-\x7e]/] },
      {
        name: 'qtextSMTP',
        symbols: [/[\x20-\x21\x23-\x5b\x5d-\x7e\u0080-\uFFFF]/],
        postprocess: id,
      },
      {
        name: 'IPv4_address_literal$macrocall$2',
        symbols: [{ literal: '.' }, 'Snum'],
      },
      {
        name: 'IPv4_address_literal$macrocall$1',
        symbols: [
          'IPv4_address_literal$macrocall$2',
          'IPv4_address_literal$macrocall$2',
          'IPv4_address_literal$macrocall$2',
        ],
      },
      {
        name: 'IPv4_address_literal',
        symbols: ['Snum', 'IPv4_address_literal$macrocall$1'],
      },
      {
        name: 'IPv6_address_literal$subexpression$1',
        symbols: [/[iI]/, /[pP]/, /[vV]/, { literal: '6' }, { literal: ':' }],
        postprocess: function (d) {
          return d.join('')
        },
      },
      {
        name: 'IPv6_address_literal',
        symbols: ['IPv6_address_literal$subexpression$1', 'IPv6_addr'],
      },
      { name: 'General_address_literal$ebnf$1', symbols: ['dcontent'] },
      {
        name: 'General_address_literal$ebnf$1',
        symbols: ['General_address_literal$ebnf$1', 'dcontent'],
        postprocess: function arrpush(d) {
          return d[0].concat([d[1]])
        },
      },
      {
        name: 'General_address_literal',
        symbols: [
          'Standardized_tag',
          { literal: ':' },
          'General_address_literal$ebnf$1',
        ],
      },
      { name: 'Standardized_tag', symbols: ['Ldh_str'] },
      { name: 'dcontent', symbols: [/[\x21-\x5a\x5e-\x7e]/], postprocess: id },
      { name: 'Snum', symbols: ['DIGIT'] },
      { name: 'Snum$subexpression$1', symbols: [/[1-9]/, 'DIGIT'] },
      { name: 'Snum', symbols: ['Snum$subexpression$1'] },
      {
        name: 'Snum$subexpression$2',
        symbols: [{ literal: '1' }, 'DIGIT', 'DIGIT'],
      },
      { name: 'Snum', symbols: ['Snum$subexpression$2'] },
      {
        name: 'Snum$subexpression$3',
        symbols: [{ literal: '2' }, /[0-4]/, 'DIGIT'],
      },
      { name: 'Snum', symbols: ['Snum$subexpression$3'] },
      {
        name: 'Snum$subexpression$4',
        symbols: [{ literal: '2' }, { literal: '5' }, /[0-5]/],
      },
      { name: 'Snum', symbols: ['Snum$subexpression$4'] },
      { name: 'IPv6_addr', symbols: ['IPv6_full'] },
      { name: 'IPv6_addr', symbols: ['IPv6_comp'] },
      { name: 'IPv6_addr', symbols: ['IPv6v4_full'] },
      { name: 'IPv6_addr', symbols: ['IPv6v4_comp'] },
      { name: 'IPv6_hex', symbols: ['HEXDIG'] },
      { name: 'IPv6_hex$subexpression$1', symbols: ['HEXDIG', 'HEXDIG'] },
      { name: 'IPv6_hex', symbols: ['IPv6_hex$subexpression$1'] },
      {
        name: 'IPv6_hex$subexpression$2',
        symbols: ['HEXDIG', 'HEXDIG', 'HEXDIG'],
      },
      { name: 'IPv6_hex', symbols: ['IPv6_hex$subexpression$2'] },
      {
        name: 'IPv6_hex$subexpression$3',
        symbols: ['HEXDIG', 'HEXDIG', 'HEXDIG', 'HEXDIG'],
      },
      { name: 'IPv6_hex', symbols: ['IPv6_hex$subexpression$3'] },
      {
        name: 'IPv6_full$macrocall$2',
        symbols: [{ literal: ':' }, 'IPv6_hex'],
      },
      {
        name: 'IPv6_full$macrocall$1',
        symbols: [
          'IPv6_full$macrocall$2',
          'IPv6_full$macrocall$2',
          'IPv6_full$macrocall$2',
          'IPv6_full$macrocall$2',
          'IPv6_full$macrocall$2',
          'IPv6_full$macrocall$2',
          'IPv6_full$macrocall$2',
        ],
      },
      { name: 'IPv6_full', symbols: ['IPv6_hex', 'IPv6_full$macrocall$1'] },
      {
        name: 'IPv6_comp$ebnf$1$subexpression$1$macrocall$2',
        symbols: [{ literal: ':' }, 'IPv6_hex'],
      },
      {
        name: 'IPv6_comp$ebnf$1$subexpression$1$macrocall$1',
        symbols: [
          'IPv6_comp$ebnf$1$subexpression$1$macrocall$2',
          'IPv6_comp$ebnf$1$subexpression$1$macrocall$2',
          'IPv6_comp$ebnf$1$subexpression$1$macrocall$2',
          'IPv6_comp$ebnf$1$subexpression$1$macrocall$2',
          'IPv6_comp$ebnf$1$subexpression$1$macrocall$2',
        ],
      },
      {
        name: 'IPv6_comp$ebnf$1$subexpression$1',
        symbols: ['IPv6_hex', 'IPv6_comp$ebnf$1$subexpression$1$macrocall$1'],
      },
      {
        name: 'IPv6_comp$ebnf$1',
        symbols: ['IPv6_comp$ebnf$1$subexpression$1'],
        postprocess: id,
      },
      {
        name: 'IPv6_comp$ebnf$1',
        symbols: [],
        postprocess: function (d) {
          return null
        },
      },
      {
        name: 'IPv6_comp$string$1',
        symbols: [{ literal: ':' }, { literal: ':' }],
        postprocess: function joiner(d) {
          return d.join('')
        },
      },
      {
        name: 'IPv6_comp$ebnf$2$subexpression$1$macrocall$2',
        symbols: [{ literal: ':' }, 'IPv6_hex'],
      },
      {
        name: 'IPv6_comp$ebnf$2$subexpression$1$macrocall$1',
        symbols: [
          'IPv6_comp$ebnf$2$subexpression$1$macrocall$2',
          'IPv6_comp$ebnf$2$subexpression$1$macrocall$2',
          'IPv6_comp$ebnf$2$subexpression$1$macrocall$2',
          'IPv6_comp$ebnf$2$subexpression$1$macrocall$2',
          'IPv6_comp$ebnf$2$subexpression$1$macrocall$2',
        ],
      },
      {
        name: 'IPv6_comp$ebnf$2$subexpression$1',
        symbols: ['IPv6_hex', 'IPv6_comp$ebnf$2$subexpression$1$macrocall$1'],
      },
      {
        name: 'IPv6_comp$ebnf$2',
        symbols: ['IPv6_comp$ebnf$2$subexpression$1'],
        postprocess: id,
      },
      {
        name: 'IPv6_comp$ebnf$2',
        symbols: [],
        postprocess: function (d) {
          return null
        },
      },
      {
        name: 'IPv6_comp',
        symbols: ['IPv6_comp$ebnf$1', 'IPv6_comp$string$1', 'IPv6_comp$ebnf$2'],
      },
      {
        name: 'IPv6v4_full$macrocall$2',
        symbols: [{ literal: ':' }, 'IPv6_hex'],
      },
      {
        name: 'IPv6v4_full$macrocall$1',
        symbols: [
          'IPv6v4_full$macrocall$2',
          'IPv6v4_full$macrocall$2',
          'IPv6v4_full$macrocall$2',
          'IPv6v4_full$macrocall$2',
          'IPv6v4_full$macrocall$2',
        ],
      },
      {
        name: 'IPv6v4_full',
        symbols: [
          'IPv6_hex',
          'IPv6v4_full$macrocall$1',
          { literal: ':' },
          'IPv4_address_literal',
        ],
      },
      {
        name: 'IPv6v4_comp$ebnf$1$subexpression$1$macrocall$2',
        symbols: [{ literal: ':' }, 'IPv6_hex'],
      },
      {
        name: 'IPv6v4_comp$ebnf$1$subexpression$1$macrocall$1',
        symbols: [
          'IPv6v4_comp$ebnf$1$subexpression$1$macrocall$2',
          'IPv6v4_comp$ebnf$1$subexpression$1$macrocall$2',
          'IPv6v4_comp$ebnf$1$subexpression$1$macrocall$2',
        ],
      },
      {
        name: 'IPv6v4_comp$ebnf$1$subexpression$1',
        symbols: ['IPv6_hex', 'IPv6v4_comp$ebnf$1$subexpression$1$macrocall$1'],
      },
      {
        name: 'IPv6v4_comp$ebnf$1',
        symbols: ['IPv6v4_comp$ebnf$1$subexpression$1'],
        postprocess: id,
      },
      {
        name: 'IPv6v4_comp$ebnf$1',
        symbols: [],
        postprocess: function (d) {
          return null
        },
      },
      {
        name: 'IPv6v4_comp$string$1',
        symbols: [{ literal: ':' }, { literal: ':' }],
        postprocess: function joiner(d) {
          return d.join('')
        },
      },
      {
        name: 'IPv6v4_comp$ebnf$2$subexpression$1$macrocall$2',
        symbols: [{ literal: ':' }, 'IPv6_hex'],
      },
      {
        name: 'IPv6v4_comp$ebnf$2$subexpression$1$macrocall$1',
        symbols: [
          'IPv6v4_comp$ebnf$2$subexpression$1$macrocall$2',
          'IPv6v4_comp$ebnf$2$subexpression$1$macrocall$2',
          'IPv6v4_comp$ebnf$2$subexpression$1$macrocall$2',
        ],
      },
      {
        name: 'IPv6v4_comp$ebnf$2$subexpression$1',
        symbols: [
          'IPv6_hex',
          'IPv6v4_comp$ebnf$2$subexpression$1$macrocall$1',
          { literal: ':' },
        ],
      },
      {
        name: 'IPv6v4_comp$ebnf$2',
        symbols: ['IPv6v4_comp$ebnf$2$subexpression$1'],
        postprocess: id,
      },
      {
        name: 'IPv6v4_comp$ebnf$2',
        symbols: [],
        postprocess: function (d) {
          return null
        },
      },
      {
        name: 'IPv6v4_comp',
        symbols: [
          'IPv6v4_comp$ebnf$1',
          'IPv6v4_comp$string$1',
          'IPv6v4_comp$ebnf$2',
          'IPv4_address_literal',
        ],
      },
      { name: 'DIGIT', symbols: [/[0-9]/], postprocess: id },
      {
        name: 'ALPHA_DIGIT_U',
        symbols: [/[0-9A-Za-z\u0080-\uFFFF]/],
        postprocess: id,
      },
      { name: 'ALPHA_DIGIT', symbols: [/[0-9A-Za-z]/], postprocess: id },
      { name: 'ALPHA_DIG_DASH', symbols: [/[-0-9A-Za-z]/], postprocess: id },
      {
        name: 'ALPHA_DIG_DASH_U',
        symbols: [/[-0-9A-Za-z\u0080-\uFFFF]/],
        postprocess: id,
      },
      { name: 'HEXDIG', symbols: [/[0-9A-Fa-f]/], postprocess: id },
      { name: 'DQUOTE', symbols: [{ literal: '"' }], postprocess: id },
    ],
    ParserStart: 'main',
  }
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = grammar
  } else {
    window.grammar = grammar
  }
})()
