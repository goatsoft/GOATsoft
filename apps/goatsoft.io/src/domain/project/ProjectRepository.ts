import type { Project } from './Project.ts'

/**
 * Port: where projects come from. Implemented in `src/infrastructure`
 * (GitHub REST, a static catalogue, and a composite that falls back). @see ADR 0006
 */
export interface ProjectRepository {
  /** Every project the source knows about, unordered and uncurated. */
  list(signal?: AbortSignal): Promise<readonly Project[]>
}

export type ProjectSource = 'github' | 'catalogue'

export interface ProjectListing {
  readonly projects: readonly Project[]
  readonly source: ProjectSource
}
