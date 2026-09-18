import { describe, expect, it } from 'vitest'
import { isAppearancePreference, nextPreference, resolveAppearance } from './Appearance.ts'

describe('Appearance', () => {
  it('follows the system when the preference is system', () => {
    expect(resolveAppearance('system', true)).toBe('dark')
    expect(resolveAppearance('system', false)).toBe('light')
  })
  it('pins an explicit preference regardless of the system', () => {
    expect(resolveAppearance('light', true)).toBe('light')
    expect(resolveAppearance('dark', false)).toBe('dark')
  })
  it('cycles system -> light -> dark -> system', () => {
    expect(nextPreference('system')).toBe('light')
    expect(nextPreference('light')).toBe('dark')
    expect(nextPreference('dark')).toBe('system')
  })
  it('validates stored values', () => {
    expect(isAppearancePreference('dark')).toBe(true)
    expect(isAppearancePreference('midnight')).toBe(false)
    expect(isAppearancePreference(null)).toBe(false)
  })
})
