import { ORGANISATION } from '@/domain/organisation/Organisation.ts'

/**
 * Use case: the organisation's identity and the current appearance. Binary brand
 * assets (logo, hero video) are bundled by Vite and resolved in the presentation
 * layer, not here. @see ADR 0010
 */
export function useBrand() {
  const { appearance } = useAppearance()
  return {
    organisation: ORGANISATION,
    appearance,
    year: new Date().getFullYear(),
  }
}
