<script setup lang="ts">
import privacyMarkdown from '../../../../PRIVACY.md?raw'
import { renderMarkdown } from '@/lib/markdown.ts'
const { privacyOpen } = useDialogs()
const html = renderMarkdown(privacyMarkdown)
</script>

<template>
  <Dialog v-model:open="privacyOpen">
    <!-- eslint-disable-next-line vue/no-v-html -- trusted, build-time PRIVACY.md -->
    <div class="doc-content pr-6" v-html="html" />
  </Dialog>
</template>
