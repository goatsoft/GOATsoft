<script setup lang="ts">
/** Hosts the site's dialogs and links them to the URL hash so #privacy and #contact
 *  (shareable) open the right one. Clears the hash when both are closed. */
const { privacyOpen, contactOpen, openPrivacy, openContact } = useDialogs()

function syncFromHash() {
  const hash = location.hash.replace('#', '')
  if (hash === 'contact') openContact()
  else if (hash === 'privacy') openPrivacy()
}

onMounted(() => {
  syncFromHash()
  window.addEventListener('hashchange', syncFromHash)
})
onUnmounted(() => window.removeEventListener('hashchange', syncFromHash))

watch([privacyOpen, contactOpen], ([p, c]) => {
  if (!p && !c && (location.hash === '#privacy' || location.hash === '#contact')) {
    history.replaceState(null, '', location.pathname + location.search)
  }
})
</script>

<template>
  <PrivacyDialog />
  <ContactDialog />
</template>
