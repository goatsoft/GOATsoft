<script setup lang="ts">
/** Cycles system -> light -> dark. The icon shows what is active, the label says what comes next. */
const { preference, appearance, cycle } = useAppearance()
const label = computed(() => {
  const next = preference.value === 'system' ? 'light' : preference.value === 'light' ? 'dark' : 'system'
  return `Appearance: ${preference.value} (${appearance.value}). Switch to ${next}`
})
</script>

<template>
  <button
    type="button"
    class="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:glass-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 [&_svg]:size-5"
    :aria-label="label" :title="label"
    @click="cycle"
  >
    <i-hugeicons-computer v-if="preference === 'system'" aria-hidden="true" />
    <i-hugeicons-sun-03 v-else-if="preference === 'light'" aria-hidden="true" />
    <i-hugeicons-moon-02 v-else aria-hidden="true" />
  </button>
</template>
