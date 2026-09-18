<script setup lang="ts">
/**
 * Accessible modal built on the native <dialog> element: focus trapping, Esc to close
 * and an inert backdrop come for free. v-model:open drives showModal() / close().
 */
const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [boolean] }>()
const el = ref<HTMLDialogElement | null>(null)

watch(() => props.open, (v) => {
  const d = el.value
  if (!d) return
  if (v && !d.open) d.showModal()
  else if (!v && d.open) d.close()
})
onMounted(() => { if (props.open) el.value?.showModal() })

function close() { if (props.open) emit('update:open', false) }
function onBackdrop(e: MouseEvent) { if (e.target === el.value) close() }
</script>

<template>
  <dialog
    ref="el"
    class="site-dialog m-auto w-[min(92vw,40rem)] rounded-3xl bg-transparent p-0 text-foreground"
    @close="close"
    @click="onBackdrop"
  >
    <div class="glass relative max-h-[85vh] overflow-y-auto overscroll-contain rounded-3xl p-6 shadow-ink sm:p-8">
      <button
        type="button" aria-label="Close"
        class="absolute right-4 top-4 z-10 inline-flex size-9 items-center justify-center rounded-full text-muted-foreground ring-hair transition-colors hover:glass-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 [&_svg]:size-4"
        @click="close"
      >
        <Icon name="hugeicons:cancel-01" aria-hidden="true" />
      </button>
      <slot />
    </div>
  </dialog>
</template>

<style scoped>
.site-dialog::backdrop {
  background: color-mix(in oklab, var(--goat-bg) 68%, transparent);
  backdrop-filter: blur(6px);
}
.site-dialog {
  opacity: 0;
  transform: translateY(8px) scale(0.98);
  transition: opacity 0.2s ease, transform 0.2s ease, overlay 0.2s ease allow-discrete, display 0.2s ease allow-discrete;
}
.site-dialog[open] { opacity: 1; transform: none; }
@starting-style {
  .site-dialog[open] { opacity: 0; transform: translateY(8px) scale(0.98); }
}
@media (prefers-reduced-motion: reduce) { .site-dialog { transition: none; } }
</style>
