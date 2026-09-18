import type { Project, ProjectCuration } from '@/domain/project/Project.ts'
import type { ProjectRepository } from '@/domain/project/ProjectRepository.ts'

/**
 * Editorial catalogue. Two jobs:
 * 1. `CURATION` decorates whatever GitHub returns (tagline, accent, order, hidden).
 * 2. `SNAPSHOT` is the offline fallback when GitHub is unreachable or rate limited.
 * Keep the snapshot honest: it mirrors public repositories, never invents them. @see ADR 0006
 */
export const CURATION: readonly ProjectCuration[] = [
  {
    slug: 'GOAT',
    order: 1,
    featured: true,
    accent: 'violet',
    tagline: 'Private AI workspace for Mac',
    description: 'A native AI workspace for Mac. Connect local models to project files, tools and memory, with permissions you control.',
  },
  {
    slug: 'goatherd.dev',
    order: 2,
    accent: 'blue',
    tagline: 'GOAT documentation',
    description: 'GOAT documentation: getting started, practical guides and technical reference. Built from goatsoft/GOAT.',
  },
  { slug: 'goatsoft.github.io', hidden: true },
  { slug: '.github', hidden: true },
]

export const SNAPSHOT: readonly Project[] = [
  {
    slug: 'GOAT',
    name: 'GOAT',
    description: 'A native AI workspace for Mac. Connect local models to project files, tools and memory, with permissions you control.',
    repoUrl: 'https://github.com/goatsoft/GOAT',
    homepageUrl: 'https://goatapp.dev/',
    language: 'Swift',
    stars: 1,
    topics: [],
  },
  {
    slug: 'goatherd.dev',
    name: 'goatherd.dev',
    description: 'GOAT documentation: getting started, practical guides and technical reference. Built from goatsoft/GOAT.',
    repoUrl: 'https://github.com/goatsoft/goatherd.dev',
    homepageUrl: 'https://goatherd.dev/',
    language: 'HTML',
    stars: 0,
    topics: [],
  },
]

export class StaticProjectRepository implements ProjectRepository {
  constructor(private readonly projects: readonly Project[] = SNAPSHOT) {}
  async list(): Promise<readonly Project[]> {
    return this.projects
  }
}
