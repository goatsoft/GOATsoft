/**
 * Build-time configuration read from `VITE_*` variables. The only place that
 * touches `import.meta.env`; everything else receives plain values.
 */
export const siteConfig = {
  organisation: import.meta.env.VITE_GITHUB_ORG || 'goatsoft',
  siteUrl: import.meta.env.VITE_SITE_URL || 'https://goatsoft.github.io/',
  /** Deploy base path, always ending in a slash. */
  base: import.meta.env.BASE_URL,
} as const

/** Prefix a public-root relative path (`brand/logo.svg`) with the deploy base. */
export function asset(path: string): string {
  return `${siteConfig.base.replace(/\/?$/, '/')}${path.replace(/^\//, '')}`
}
