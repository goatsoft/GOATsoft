<script setup lang="ts">
const { contactOpen } = useDialogs()
const { configured, submit } = useContact()

const form = reactive({ name: '', email: '', message: '' })
const state = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const error = ref('')

async function onSubmit() {
  if (state.value === 'sending') return
  state.value = 'sending'
  error.value = ''
  try {
    await submit({ ...form })
    state.value = 'sent'
    form.name = ''
    form.email = ''
    form.message = ''
  } catch (e) {
    state.value = 'error'
    error.value = e instanceof Error ? e.message : 'Something went wrong. Please try again.'
  }
}

const field = 'mt-1.5 w-full rounded-xl bg-foreground/5 px-3.5 py-2.5 text-sm text-foreground ring-hair outline-none transition-shadow placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring/60'
</script>

<template>
  <Dialog v-model:open="contactOpen">
    <h2 class="pr-8 text-xl font-semibold tracking-tight">Get in touch</h2>
    <p class="mt-2 text-sm text-muted-foreground">
      Send a message and it reaches us by email through Web3Forms. Nothing is stored on this site.
    </p>

    <div v-if="state === 'sent'" class="mt-6 flex items-start gap-3 rounded-2xl p-4 ring-hair">
      <span class="mt-0.5 text-foreground [&_svg]:size-5"><i-hugeicons-checkmark-circle-02 aria-hidden="true" /></span>
      <div class="text-sm">
        <p class="font-semibold">Message sent</p>
        <p class="mt-1 text-muted-foreground">Thanks for reaching out. We will get back to you.</p>
      </div>
    </div>

    <form v-else class="mt-6 space-y-4" @submit.prevent="onSubmit">
      <div>
        <label class="text-eyebrow" for="contact-name">Name</label>
        <input id="contact-name" v-model.trim="form.name" required autocomplete="name" :class="field" />
      </div>
      <div>
        <label class="text-eyebrow" for="contact-email">Email</label>
        <input id="contact-email" v-model.trim="form.email" type="email" required autocomplete="email" :class="field" />
      </div>
      <div>
        <label class="text-eyebrow" for="contact-message">Message</label>
        <textarea id="contact-message" v-model.trim="form.message" required rows="4" class="resize-y" :class="field" />
      </div>

      <p v-if="state === 'error'" class="text-sm text-red-500">{{ error }}</p>
      <p v-if="!configured" class="text-sm text-muted-foreground">The contact form is not configured yet.</p>

      <Button type="submit" size="lg" class="w-full" :class="state === 'sending' ? 'pointer-events-none opacity-80' : ''">
        <i-hugeicons-sent v-if="state !== 'sending'" aria-hidden="true" />
        {{ state === 'sending' ? 'Sending...' : 'Send message' }}
      </Button>
    </form>
  </Dialog>
</template>
