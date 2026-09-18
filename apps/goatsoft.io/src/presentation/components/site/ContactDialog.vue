<script setup lang="ts">
const { contactOpen } = useDialogs()
const { configured, r$, status, errorMessage, submit } = useContact()

const field = 'mt-1.5 w-full rounded-xl bg-foreground/5 px-3.5 py-2.5 text-sm text-foreground ring-hair outline-none transition-shadow placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring/60'
const invalid = 'ring-red-500/70 focus-visible:ring-red-500/70'
</script>

<template>
  <Dialog v-model:open="contactOpen">
    <h2 class="pr-8 text-xl font-semibold tracking-tight">Get in touch</h2>
    <p class="mt-2 text-sm text-muted-foreground">
      Send a message and it reaches us by email.
    </p>

    <div v-if="status === 'sent'" class="mt-6 flex items-start gap-3 rounded-2xl p-4 ring-hair">
      <span class="mt-0.5 text-foreground [&_svg]:size-5"><Icon name="hugeicons:checkmark-circle-02" aria-hidden="true" /></span>
      <div class="text-sm">
        <p class="font-semibold">Message sent</p>
        <p class="mt-1 text-muted-foreground">Thanks for reaching out. We will get back to you.</p>
      </div>
    </div>

    <form v-else class="mt-6 space-y-4" novalidate @submit.prevent="submit">
      <div>
        <label class="text-eyebrow" for="contact-name">Name</label>
        <input
          id="contact-name" v-model.trim="r$.name.$value" autocomplete="name"
          :aria-invalid="r$.name.$error" :aria-describedby="r$.name.$error ? 'contact-name-error' : undefined"
          :class="[field, r$.name.$error ? invalid : '']" @blur="r$.name.$touch()"
        />
        <p v-if="r$.name.$error" id="contact-name-error" class="mt-1.5 text-xs text-red-500">{{ r$.name.$errors[0] }}</p>
      </div>
      <div>
        <label class="text-eyebrow" for="contact-email">Email</label>
        <input
          id="contact-email" v-model.trim="r$.email.$value" type="email" inputmode="email" autocomplete="email"
          :aria-invalid="r$.email.$error" :aria-describedby="r$.email.$error ? 'contact-email-error' : undefined"
          :class="[field, r$.email.$error ? invalid : '']" @blur="r$.email.$touch()"
        />
        <p v-if="r$.email.$error" id="contact-email-error" class="mt-1.5 text-xs text-red-500">{{ r$.email.$errors[0] }}</p>
      </div>
      <div>
        <label class="text-eyebrow" for="contact-message">Message</label>
        <textarea
          id="contact-message" v-model.trim="r$.message.$value" rows="4" class="resize-y"
          :aria-invalid="r$.message.$error" :aria-describedby="r$.message.$error ? 'contact-message-error' : undefined"
          :class="[field, r$.message.$error ? invalid : '']" @blur="r$.message.$touch()"
        />
        <p v-if="r$.message.$error" id="contact-message-error" class="mt-1.5 text-xs text-red-500">{{ r$.message.$errors[0] }}</p>
      </div>

      <p v-if="status === 'error' && errorMessage" class="text-sm text-red-500">{{ errorMessage }}</p>
      <p v-if="!configured" class="text-sm text-muted-foreground">The contact form is not configured yet.</p>

      <Button type="submit" size="lg" class="w-full" :class="status === 'sending' ? 'pointer-events-none opacity-80' : ''">
        <Icon name="hugeicons:sent" v-if="status !== 'sending'" aria-hidden="true" />
        {{ status === 'sending' ? 'Sending...' : 'Send message' }}
      </Button>
    </form>
  </Dialog>
</template>
