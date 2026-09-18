import { z } from 'zod'

/**
 * The rules that decide whether a contact message is ready to send, as a Zod schema.
 * Framework-free: the application layer binds it with Regle and the presentation layer
 * renders the errors. Values are trimmed as they parse, so the delivered message never
 * carries surrounding whitespace. @see ADR 0011
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Please tell us your name.')
    .max(100, 'That name is a little too long.'),
  email: z
    .string()
    .trim()
    .min(1, 'Please add an email so we can reply.')
    .refine((v) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'That does not look like an email address.'),
  message: z
    .string()
    .trim()
    .min(10, 'A few more words would help us understand.')
    .max(5000, 'That message is too long to send.'),
})

/** A validated, trimmed message ready to hand to the transport. */
export type ContactMessage = z.infer<typeof contactSchema>

/** Raw form input before it has been validated. */
export type ContactDraft = z.input<typeof contactSchema>
