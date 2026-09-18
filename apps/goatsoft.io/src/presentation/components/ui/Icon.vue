<script setup lang="ts">
/**
 * One icon component for the whole app: <Icon name="collection:icon" />.
 * Backed by unplugin-icons virtual modules, so only the icons registered here are
 * bundled (tree-shaken) and nothing is fetched at runtime. Add a brand SVG to
 * assets/svg/icons for the "gs" collection, then register it below.
 */
import type { Component } from 'vue'
import I_gs_goat from '~icons/gs/goat'
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

const registry: Record<string, Component> = {
  'gs:goat': I_gs_goat,
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

const props = defineProps<{ name: string }>()
const icon = computed(() => registry[props.name])
</script>

<template>
  <component :is="icon" v-if="icon" />
</template>
