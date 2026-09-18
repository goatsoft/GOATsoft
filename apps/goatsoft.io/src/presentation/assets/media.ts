import type { Appearance } from '@/domain/brand/Appearance.ts'
import darkWebm from './video/ibex-climb-dark.webm?url'
import darkMp4 from './video/ibex-climb-dark.mp4?url'
import darkPoster from './video/ibex-climb-dark-poster.jpg?url'
import lightWebm from './video/ibex-climb-light.webm?url'
import lightMp4 from './video/ibex-climb-light.mp4?url'
import lightPoster from './video/ibex-climb-light-poster.jpg?url'

/**
 * Hero footage, bundled by Vite (hashed URLs) rather than served from public/.
 * One edit per appearance; webm is offered first with mp4 as the fallback. @see ADR 0010
 */
export interface HeroVideoSources {
  readonly webm: string
  readonly mp4: string
  readonly poster: string
}

const HERO_VIDEO: Record<Appearance, HeroVideoSources> = {
  dark: { webm: darkWebm, mp4: darkMp4, poster: darkPoster },
  light: { webm: lightWebm, mp4: lightMp4, poster: lightPoster },
}

export function heroVideoFor(appearance: Appearance): HeroVideoSources {
  return HERO_VIDEO[appearance]
}
