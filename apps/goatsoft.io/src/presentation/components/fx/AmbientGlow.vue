<script setup lang="ts">
/**
 * Page background: one Aurora pinned to the viewport, following scroll at a fraction of
 * the page speed. Sits behind everything; the hero paints over it. @see ADR 0014
 */
</script>

<template>
  <div class="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
    <AuroraBackdrop name="ambient" />
  </div>
</template>
