import { isAppearancePreference, nextPreference, resolveAppearance, type Appearance, type AppearancePreference } from '@/domain/brand/Appearance.ts'

const STORAGE_KEY = 'goatsoft.appearance'

const preference = ref<AppearancePreference>('system')
const systemPrefersDark = ref(false)
let started = false

function readStored(): AppearancePreference {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return isAppearancePreference(raw) ? raw : 'system'
  } catch {
    return 'system'
  }
}

function start() {
  if (started || typeof window === 'undefined') return
  started = true
  const media = matchMedia('(prefers-color-scheme: dark)')
  systemPrefersDark.value = media.matches
  media.addEventListener('change', e => (systemPrefersDark.value = e.matches))
  preference.value = readStored()
  watchEffect(() => {
    document.documentElement.classList.toggle('dark', resolveAppearance(preference.value, systemPrefersDark.value) === 'dark')
  })
}

/**
 * Use case: which appearance the page shows. Follows the system by default; a
 * visitor may pin light or dark and the choice survives reloads. The inline script
 * in index.html applies the same rule before first paint. @see ADR 0003
 */
export function useAppearance() {
  start()
  const appearance = computed<Appearance>(() => resolveAppearance(preference.value, systemPrefersDark.value))
  const isDark = computed(() => appearance.value === 'dark')

  function setPreference(value: AppearancePreference) {
    preference.value = value
    try {
      if (value === 'system') localStorage.removeItem(STORAGE_KEY)
      else localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // Private mode or storage disabled: the choice still applies for this page view.
    }
  }

  return {
    appearance,
    isDark,
    preference: readonly(preference),
    setPreference,
    cycle: () => setPreference(nextPreference(preference.value)),
  }
}
