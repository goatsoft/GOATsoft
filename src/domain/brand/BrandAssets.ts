import type { Appearance } from './Appearance.ts'

/**
 * Brand assets come in pairs, one per appearance. Paths are relative to the
 * public root; the presentation layer prefixes the deploy base. @see ADR 0004
 */
export interface HeroVideo {
  readonly mp4: string
  readonly webm: string
  /** Still frame shown before playback and wherever autoplay is refused. */
  readonly poster: string
}

export interface BrandAssetSet {
  readonly logo: string
  readonly wordmark: string
  readonly heroVideo: HeroVideo
}

export type BrandAssets = Readonly<Record<Appearance, BrandAssetSet>>

/**
 * Placeholder assets. Replace the files under `public/brand` and `public/media`
 * with the final logos and hero videos; keep these paths so nothing else changes.
 */
export const BRAND_ASSETS: BrandAssets = {
  light: {
    logo: 'brand/logo-light.svg',
    wordmark: 'brand/wordmark-light.svg',
    heroVideo: { mp4: 'media/hero-light.mp4', webm: 'media/hero-light.webm', poster: 'media/hero-light-poster.jpg' },
  },
  dark: {
    logo: 'brand/logo-dark.svg',
    wordmark: 'brand/wordmark-dark.svg',
    heroVideo: { mp4: 'media/hero-dark.mp4', webm: 'media/hero-dark.webm', poster: 'media/hero-dark-poster.jpg' },
  },
}

export function brandAssetsFor(appearance: Appearance, assets: BrandAssets = BRAND_ASSETS): BrandAssetSet {
  return assets[appearance]
}
