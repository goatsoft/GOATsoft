import { describe, expect, it } from 'vitest'
import { contactSchema } from './ContactMessage.ts'

const valid = { name: 'Bea Goat', email: 'bea@goatsoft.io', message: 'Hello there, I have a question about GOAT.' }

describe('contactSchema', () => {
  it('accepts and trims a complete message', () => {
    const res = contactSchema.safeParse({ name: '  Bea Goat ', email: ' bea@goatsoft.io ', message: '  Hello there team  ' })
    expect(res.success).toBe(true)
    if (res.success) expect(res.data).toEqual({ name: 'Bea Goat', email: 'bea@goatsoft.io', message: 'Hello there team' })
  })

  it('requires a name', () => {
    expect(contactSchema.safeParse({ ...valid, name: '   ' }).success).toBe(false)
  })

  it('rejects a malformed email but accepts a plain one', () => {
    expect(contactSchema.safeParse({ ...valid, email: 'nope' }).success).toBe(false)
    expect(contactSchema.safeParse({ ...valid, email: 'a@b.co' }).success).toBe(true)
  })

  it('asks for a message of at least a few words', () => {
    expect(contactSchema.safeParse({ ...valid, message: 'hi' }).success).toBe(false)
    expect(contactSchema.safeParse({ ...valid, message: '' }).success).toBe(false)
  })
})
