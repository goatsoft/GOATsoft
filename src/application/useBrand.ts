import { brandAssetsFor } from '@/domain/brand/BrandAssets.ts'
import { ORGANISATION } from '@/domain/organisation/Organisation.ts'
import { asset } from '@/infrastructure/config/site.ts'

/**
 * Use case: the organisation's identity and the asset set for the current appearance,
 * with public paths already prefixed for the deploy base.
 */
export function useBrand() {
  const { appearance } = useAppearance()
  const assets = computed(() => {
    const set = brandAssetsFor(appearance.value)
    return {
      logo: asset(set.logo),
      wordmark: asset(set.wordmark),
      heroVideo: { mp4: asset(set.heroVideo.mp4), webm: asset(set.heroVideo.webm), poster: asset(set.heroVideo.poster) },
    }
  })
  return {
    organisation: ORGANISATION,
    appearance,
    assets,
    year: new Date().getFullYear(),
  }
}
