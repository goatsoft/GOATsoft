import { describe, expect, it } from 'vitest'
import { fillAuroraUniforms, type AuroraOptions } from './aurora-renderer.ts'

const options: AuroraOptions = {
  colors: [[0.1, 0.2, 0.3], [0.4, 0.5, 0.6], [0.7, 0.8, 0.9]],
  fixed: true, parallax: 0.25, intensity: 0.5, scale: 1.5, speed: 0.06, fade: true, seed: 3, stretch: 0.55, sweep: 0,
}

describe('fillAuroraUniforms', () => {
  it('packs the 80-byte block in std140 order', () => {
    const out = new Float32Array(20)
    fillAuroraUniforms(out, options, 640, 360, 12.5, 0.1)
    expect(Array.from(out)).toEqual([
      640, 360, 12.5, expect.closeTo(0.1, 6),
      expect.closeTo(0.1, 6), expect.closeTo(0.2, 6), expect.closeTo(0.3, 6), 0.5,
      expect.closeTo(0.4, 6), 0.5, expect.closeTo(0.6, 6), 1.5,
      expect.closeTo(0.7, 6), expect.closeTo(0.8, 6), expect.closeTo(0.9, 6), expect.closeTo(0.06, 6),
      1, 3, expect.closeTo(0.55, 6), 0,
    ])
  })
})
