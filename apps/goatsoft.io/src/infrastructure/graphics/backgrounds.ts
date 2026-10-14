import type { AuroraModule } from '@goatsoft/aurora'
import aboutDark from './backgrounds/about-dark.aurora'
import aboutLight from './backgrounds/about-light.aurora'
import ambientDark from './backgrounds/ambient-dark.aurora'
import ambientLight from './backgrounds/ambient-light.aurora'
import heroDark from './backgrounds/hero-dark.aurora'
import heroLight from './backgrounds/hero-light.aurora'
import heroTouch from './backgrounds/hero-touch.aurora'
import openSourceDark from './backgrounds/open-source-dark.aurora'
import openSourceLight from './backgrounds/open-source-light.aurora'

export type BackgroundName = 'ambient' | 'hero' | 'about' | 'open-source'
export type BackgroundAppearance = 'dark' | 'light'

/**
 * The site's Aurora backgrounds, one per place and appearance, in the monochrome ramps.
 * The `.aurora` files are validated and given their CSS fallback at build time; edit them
 * in Aurora Studio. @see ADR 0014
 */
const BACKGROUNDS: Record<BackgroundName, Record<BackgroundAppearance, AuroraModule>> = {
  'ambient': { dark: ambientDark, light: ambientLight },
  'hero': { dark: heroDark, light: heroLight },
  'about': { dark: aboutDark, light: aboutLight },
  'open-source': { dark: openSourceDark, light: openSourceLight },
}

/** The background for a place. Touch screens get a brighter hero mist on dark, as the video is smaller there. */
export function backgroundFor(name: BackgroundName, appearance: BackgroundAppearance, touch = false): AuroraModule {
  if (name === 'hero' && appearance === 'dark' && touch) return heroTouch
  return BACKGROUNDS[name][appearance]
}

/** Every background the first screen can show, for warming up before the app starts. */
export function firstScreenBackgrounds(appearance: BackgroundAppearance, touch: boolean): AuroraModule[] {
  return [backgroundFor('ambient', appearance), backgroundFor('hero', appearance, touch)]
}
