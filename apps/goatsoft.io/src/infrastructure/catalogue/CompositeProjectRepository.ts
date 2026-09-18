import type { ProjectListing, ProjectRepository } from '@/domain/project/ProjectRepository.ts'

/**
 * Tries the live source first and falls back to the catalogue snapshot on any
 * failure (offline, rate limit, non-JSON). The listing reports which one answered
 * so the UI can say so quietly. @see ADR 0006
 */
export class CompositeProjectRepository {
  constructor(
    private readonly live: ProjectRepository,
    private readonly fallback: ProjectRepository,
    private readonly onFallback: (error: unknown) => void = () => {},
  ) {}

  async listWithSource(signal?: AbortSignal): Promise<ProjectListing> {
    try {
      const projects = await this.live.list(signal)
      if (projects.length === 0) throw new Error('Live source returned no projects')
      return { projects, source: 'github' }
    } catch (error) {
      if (signal?.aborted) throw error
      this.onFallback(error)
      return { projects: await this.fallback.list(signal), source: 'catalogue' }
    }
  }
}
