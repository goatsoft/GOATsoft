import type { Project } from '@/domain/project/Project.ts'
import type { ProjectRepository } from '@/domain/project/ProjectRepository.ts'

/** The subset of the GitHub REST "repository" resource the site reads. */
export interface GitHubRepo {
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  topics?: string[]
  pushed_at?: string | null
  updated_at?: string | null
  fork?: boolean
  archived?: boolean
  private?: boolean
}

export function toProject(repo: GitHubRepo): Project {
  return {
    slug: repo.name,
    name: repo.name,
    description: repo.description ?? '',
    repoUrl: repo.html_url,
    homepageUrl: repo.homepage || undefined,
    language: repo.language ?? undefined,
    stars: repo.stargazers_count,
    topics: repo.topics ?? [],
    updatedAt: repo.pushed_at ?? repo.updated_at ?? undefined,
  }
}

export interface GitHubProjectRepositoryOptions {
  organisation: string
  fetch?: typeof fetch
  apiBase?: string
  /** Session cache to spare the anonymous rate limit while a visitor browses. */
  storage?: Pick<Storage, 'getItem' | 'setItem'>
  cacheTtlMs?: number
}

interface CacheEntry { at: number; repos: GitHubRepo[] }

/**
 * Adapter: public repositories of a GitHub organisation, unauthenticated.
 * Forks, archived and private repos are excluded; curation decides the rest. @see ADR 0006
 */
export class GitHubProjectRepository implements ProjectRepository {
  private readonly organisation: string
  private readonly fetchFn: typeof fetch
  private readonly apiBase: string
  private readonly storage?: Pick<Storage, 'getItem' | 'setItem'>
  private readonly cacheTtlMs: number

  constructor(options: GitHubProjectRepositoryOptions) {
    this.organisation = options.organisation
    this.fetchFn = options.fetch ?? globalThis.fetch.bind(globalThis)
    this.apiBase = options.apiBase ?? 'https://api.github.com'
    this.storage = options.storage
    this.cacheTtlMs = options.cacheTtlMs ?? 10 * 60 * 1000
  }

  private get cacheKey() { return `goatsoft.github.repos.${this.organisation}` }

  async list(signal?: AbortSignal): Promise<readonly Project[]> {
    const cached = this.readCache()
    if (cached) return cached.map(toProject)
    const url = `${this.apiBase}/orgs/${encodeURIComponent(this.organisation)}/repos?type=public&sort=updated&per_page=100`
    const response = await this.fetchFn(url, { signal, headers: { Accept: 'application/vnd.github+json' } })
    if (!response.ok) throw new Error(`GitHub responded ${response.status} for ${this.organisation}`)
    const repos = (await response.json()) as GitHubRepo[]
    const visible = repos.filter(r => !r.fork && !r.archived && !r.private)
    this.writeCache(visible)
    return visible.map(toProject)
  }

  private readCache(): GitHubRepo[] | null {
    try {
      const raw = this.storage?.getItem(this.cacheKey)
      if (!raw) return null
      const entry = JSON.parse(raw) as CacheEntry
      if (Date.now() - entry.at > this.cacheTtlMs) return null
      return entry.repos
    } catch {
      return null
    }
  }

  private writeCache(repos: GitHubRepo[]) {
    try {
      this.storage?.setItem(this.cacheKey, JSON.stringify({ at: Date.now(), repos } satisfies CacheEntry))
    } catch {
      // Storage may be full or disabled; the cache is an optimisation only.
    }
  }
}
