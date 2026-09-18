import { useRegleSchema } from '@regle/schemas'
import { siteConfig } from '@/infrastructure/config/site.ts'
import type { ContactMessage } from '@/domain/contact/ContactMessage.ts'
import { contactSchema } from '@/domain/contact/ContactMessage.ts'

export type ContactStatus = 'idle' | 'sending' | 'sent' | 'error'

/**
 * Contact form use case: binds the domain contact schema with Regle for reactive,
 * per-field validation, and delivers a valid message through Web3Forms, which forwards
 * it to us by email. The access key is public by design (submit-only to the owner's
 * inbox), so it ships in the client build. @see PRIVACY.md, ADR 0011
 */
export function useContact() {
  const configured = Boolean(siteConfig.web3formsKey)

  const { r$ } = useRegleSchema({ name: '', email: '', message: '' }, contactSchema)
  const status = ref<ContactStatus>('idle')
  const errorMessage = ref('')

  async function submit(): Promise<void> {
    if (status.value === 'sending') return
    const { valid, data } = await r$.$validate()
    if (!valid) return
    if (!configured) {
      status.value = 'error'
      errorMessage.value = 'The contact form is not configured yet.'
      return
    }
    status.value = 'sending'
    errorMessage.value = ''
    try {
      await deliver(data)
      status.value = 'sent'
      r$.$reset()
    } catch (e) {
      status.value = 'error'
      errorMessage.value = e instanceof Error ? e.message : 'Something went wrong. Please try again.'
    }
  }

  return { configured, r$, status, errorMessage, submit }
}

async function deliver(message: ContactMessage): Promise<void> {
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: siteConfig.web3formsKey,
      subject: 'New message from goatsoft.io',
      from_name: message.name,
      name: message.name,
      email: message.email,
      message: message.message,
      botcheck: '',
    }),
  })
  const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string }
  if (!res.ok || !data.success) throw new Error(data.message || 'Could not send your message. Please try again.')
}
