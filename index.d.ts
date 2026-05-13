declare class Address {
  user: string
  host: string
  original: string
  original_host?: string
  is_utf8?: boolean

  constructor(user: string, host: string)
  constructor(email: string)

  parse(addr: string): void

  isNull(): boolean

  format(use_punycode?: boolean): string

  address(set?: string | null, use_punycode?: boolean): string

  toString(): string
}

export { Address }
