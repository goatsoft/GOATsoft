/**
 * The two resolved looks of the site. "Summit" is light, "Midnight" is dark,
 * matching the GOAT app's theme names. @see ADR 0003
 */
export type Appearance = 'light' | 'dark'

/** What the visitor asked for: follow the system, or pin one appearance. */
export type AppearancePreference = 'system' | Appearance

export const APPEARANCE_PREFERENCES: readonly AppearancePreference[] = ['system', 'light', 'dark']

export function resolveAppearance(preference: AppearancePreference, systemPrefersDark: boolean): Appearance {
  if (preference === 'system') return systemPrefersDark ? 'dark' : 'light'
  return preference
}

export function nextPreference(current: AppearancePreference): AppearancePreference {
  const i = APPEARANCE_PREFERENCES.indexOf(current)
  return APPEARANCE_PREFERENCES[(i + 1) % APPEARANCE_PREFERENCES.length] ?? 'system'
}

export function isAppearancePreference(value: unknown): value is AppearancePreference {
  return typeof value === 'string' && (APPEARANCE_PREFERENCES as readonly string[]).includes(value)
}
