/// <reference types="vite/client" />
interface ImportMetaEnv {
  /** GitHub organisation whose public repositories feed the showcase. */
  readonly VITE_GITHUB_ORG?: string
  /** Canonical site URL, used for Open Graph metadata. */
  readonly VITE_SITE_URL?: string
  /** Deploy base path, e.g. "/goatsoft-web/" for a project site. */
  readonly VITE_BASE?: string
}
interface ImportMeta { readonly env: ImportMetaEnv }
