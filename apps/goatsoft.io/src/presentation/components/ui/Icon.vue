<script setup lang="ts">
/**
 * One icon component for the whole app: <Icon name="collection:icon" />.
 *
 * - "gs" brand icons are AUTO-LOADED from assets/svg/icons via import.meta.glob, so
 *   dropping an SVG in that folder makes <Icon name="gs:<filename>" /> work with no
 *   registration, at build and with HMR. They render in their own colours.
 * - Utility icons (hugeicons, simple-icons) come from unplugin-icons virtual modules,
 *   registered below from actual usage so only what is used gets bundled (tree-shaken).
 */
import type { Component } from 'vue'
import I_hugeicons_arrow_up_right_01 from '~icons/hugeicons/arrow-up-right-01'
import I_hugeicons_book_open_01 from '~icons/hugeicons/book-open-01'
import I_hugeicons_cancel_01 from '~icons/hugeicons/cancel-01'
import I_hugeicons_checkmark_circle_02 from '~icons/hugeicons/checkmark-circle-02'
import I_hugeicons_computer from '~icons/hugeicons/computer'
import I_hugeicons_cpu from '~icons/hugeicons/cpu'
import I_hugeicons_download_04 from '~icons/hugeicons/download-04'
import I_hugeicons_git_fork from '~icons/hugeicons/git-fork'
import I_hugeicons_mail_01 from '~icons/hugeicons/mail-01'
import I_hugeicons_menu_01 from '~icons/hugeicons/menu-01'
import I_hugeicons_moon_02 from '~icons/hugeicons/moon-02'
import I_hugeicons_mountain from '~icons/hugeicons/mountain'
import I_hugeicons_security_check from '~icons/hugeicons/security-check'
import I_hugeicons_sent from '~icons/hugeicons/sent'
import I_hugeicons_shield_01 from '~icons/hugeicons/shield-01'
import I_hugeicons_source_code from '~icons/hugeicons/source-code'
import I_hugeicons_sparkles from '~icons/hugeicons/sparkles'
import I_hugeicons_star from '~icons/hugeicons/star'
import I_hugeicons_sun_03 from '~icons/hugeicons/sun-03'
import I_simple_icons_github from '~icons/simple-icons/github'

const components: Record<string, Component> = {
  'hugeicons:arrow-up-right-01': I_hugeicons_arrow_up_right_01,
  'hugeicons:book-open-01': I_hugeicons_book_open_01,
  'hugeicons:cancel-01': I_hugeicons_cancel_01,
  'hugeicons:checkmark-circle-02': I_hugeicons_checkmark_circle_02,
  'hugeicons:computer': I_hugeicons_computer,
  'hugeicons:cpu': I_hugeicons_cpu,
  'hugeicons:download-04': I_hugeicons_download_04,
  'hugeicons:git-fork': I_hugeicons_git_fork,
  'hugeicons:mail-01': I_hugeicons_mail_01,
  'hugeicons:menu-01': I_hugeicons_menu_01,
  'hugeicons:moon-02': I_hugeicons_moon_02,
  'hugeicons:mountain': I_hugeicons_mountain,
  'hugeicons:security-check': I_hugeicons_security_check,
  'hugeicons:sent': I_hugeicons_sent,
  'hugeicons:shield-01': I_hugeicons_shield_01,
  'hugeicons:source-code': I_hugeicons_source_code,
  'hugeicons:sparkles': I_hugeicons_sparkles,
  'hugeicons:star': I_hugeicons_star,
  'hugeicons:sun-03': I_hugeicons_sun_03,
  'simple-icons:github': I_simple_icons_github,
}

// Auto-loaded brand SVGs: { "gs:goat": "<svg ...>" }. Eager so it is a plain sync map.
const brandModules = import.meta.glob('../../assets/svg/icons/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>
const brand: Record<string, string> = {}
for (const [filePath, svg] of Object.entries(brandModules)) {
  const name = filePath.split('/').pop()!.replace(/\.svg$/, '')
  brand['gs:' + name] = svg.replace(/^\uFEFF?\s*<\?xml[^>]*\?>\s*/, '')
}

const props = defineProps<{ name: string }>()
const component = computed(() => components[props.name])
const rawSvg = computed(() => brand[props.name])
</script>

<template>
  <component :is="component" v-if="component" />
  <!-- eslint-disable-next-line vue/no-v-html -- trusted, build-time brand SVG -->
  <span v-else-if="rawSvg" class="contents" v-html="rawSvg" />
</template>
