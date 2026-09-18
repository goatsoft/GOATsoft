/**
 * Shared motion-v presets so sections animate with one voice. @see ADR 0007
 * Components import `motion` from 'motion-v' explicitly and spread these.
 *
 * Only functions are exported from application modules: the auto-import scanner
 * stops at an exported array literal, so values are returned from the composable.
 */
const EASE_OUT = [0.22, 1, 0.36, 1] as const

export function useMotionPresets() {
  const reduced = useReducedMotion()
  const touch = typeof matchMedia !== 'undefined' && matchMedia('(hover: none), (pointer: coarse)').matches

  /** Fade and rise on first entry into view. */
  const reveal = (delay = 0) => ({
    initial: reduced.value ? false : { opacity: 0, y: 24, filter: 'blur(6px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    inViewOptions: { once: true, margin: '-10% 0px' as const },
    transition: { duration: 0.8, delay, ease: EASE_OUT },
  })

  /** Hero entrance: plays immediately rather than on scroll. */
  const enter = (delay = 0, y = 24) => ({
    initial: reduced.value ? false : { opacity: 0, y, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.9, delay, ease: EASE_OUT },
  })

  return { reduced, touch, reveal, enter, ease: EASE_OUT }
}
