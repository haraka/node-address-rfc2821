declare class Address {
  user: string
  host: string
  original_host?: string

  constructor(user: string, host: string)
  constructor(email: string)

  format(use_punycode?: boolean): string

  address(newval?: string, use_punycode?: boolean): string

  toString(): string
}

export { Address }
