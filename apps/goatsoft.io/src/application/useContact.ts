import { siteConfig } from '@/infrastructure/config/site.ts'

export interface ContactMessage {
  name: string
  email: string
  message: string
}

/**
 * Delivers a contact message through Web3Forms, a form backend that forwards it to us
 * by email. The access key is public by design (it only permits submissions to the
 * owner's inbox), so it ships in the client build. @see PRIVACY.md
 */
export function useContact() {
  const configured = Boolean(siteConfig.web3formsKey)

  async function submit(message: ContactMessage): Promise<void> {
    if (!configured) throw new Error('The contact form is not configured yet.')
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

  return { configured, submit }
}
