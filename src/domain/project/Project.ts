/**
 * A public piece of GOATsoft work shown in the showcase.
 * Pure data, no framework or DOM types. @see ADR 0002
 */
export interface Project {
  /** Repository name, unique within the organisation (`GOAT`, `goatherd.dev`). */
  readonly slug: string
  readonly name: string
  readonly description: string
  readonly repoUrl: string
  readonly homepageUrl?: string
  readonly language?: string
  readonly stars: number
  readonly topics: readonly string[]
  /** ISO 8601 timestamp of the last push or update. */
  readonly updatedAt?: string
  /** Curated presentation hints; absent when the project came only from GitHub. */
  readonly tagline?: string
  readonly accent?: ProjectAccent
  readonly featured?: boolean
}

export type ProjectAccent = 'blue' | 'violet' | 'indigo' | 'green'

/** Curated overrides keyed by slug; the catalogue applies these on top of live data. */
export interface ProjectCuration {
  readonly slug: string
  readonly tagline?: string
  readonly accent?: ProjectAccent
  readonly featured?: boolean
  /** Order within the showcase; lower comes first. Uncurated projects follow, by stars. */
  readonly order?: number
  /** Hide from the showcase (forks, scratch repos, the website itself). */
  readonly hidden?: boolean
  /** Human description used when GitHub has none. */
  readonly description?: string
}

export function projectUpdatedAt(project: Project): number {
  return project.updatedAt ? Date.parse(project.updatedAt) : 0
}
