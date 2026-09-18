import type { Appearance } from '@/domain/brand/Appearance.ts'
import darkWebm from './video/ibex-climb-dark.webm?url'
import darkMp4 from './video/ibex-climb-dark.mp4?url'
import darkPoster from './video/ibex-climb-dark-poster.jpg?url'

/**
 * Hero footage, bundled by Vite (hashed URLs) rather than served from public/.
 * webm is offered first with mp4 as the fallback. One edit per appearance; the
 * light appearance reuses the dark grade until a light one exists. @see ADR 0010
 */
export interface HeroVideoSources {
  readonly webm: string
  readonly mp4: string
  readonly poster: string
}

const DARK: HeroVideoSources = { webm: darkWebm, mp4: darkMp4, poster: darkPoster }

const HERO_VIDEO: Record<Appearance, HeroVideoSources> = {
  dark: DARK,
  light: DARK,
}

export function heroVideoFor(appearance: Appearance): HeroVideoSources {
  return HERO_VIDEO[appearance]
}
