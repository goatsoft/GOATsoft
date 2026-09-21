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
    download: true,
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
  {
    slug: 'SwiftHosts',
    order: 2,
    accent: 'indigo',
    tagline: 'Native macOS hosts file manager',
    description: 'A modern native macOS /etc/hosts file manager, built with Swift and SwiftUI.',
  },
  {
    slug: 'OKLabColorPicker',
    order: 3,
    accent: 'green',
    tagline: 'OKLab color picker for SwiftUI',
    description: 'Perceptually uniform OKLab & OKLCH color picker component for SwiftUI across macOS, iOS, visionOS, and watchOS. Built-in color harmonies and WCAG contrast evaluation.',
  },
  { slug: 'goatsoft.github.io', hidden: true },
  { slug: '.github', hidden: true },
]

/** Only these repositories appear in the showcase, in this order. Everything else GitHub returns is ignored. */
export const SHOWN: readonly string[] = ['GOAT', 'SwiftHosts', 'OKLabColorPicker']

export const SNAPSHOT: readonly Project[] = [
  {
    slug: 'GOAT',
    name: 'GOAT',
    description: 'A native AI workspace for Mac. Connect local models to project files, tools and memory, with permissions you control.',
    repoUrl: 'https://github.com/goatsoft/GOAT',
    homepageUrl: 'https://goatapp.dev/',
    download: true,
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
  {
    slug: 'SwiftHosts',
    name: 'SwiftHosts',
    description: 'A modern native macOS /etc/hosts file manager, built with Swift and SwiftUI.',
    repoUrl: 'https://github.com/goatsoft/SwiftHosts',
    language: 'Swift',
    stars: 0,
    topics: [],
  },
  {
    slug: 'OKLabColorPicker',
    name: 'OKLabColorPicker',
    description: 'Perceptually uniform OKLab & OKLCH color picker component for SwiftUI across macOS, iOS, visionOS, and watchOS. Built-in color harmonies and WCAG contrast evaluation.',
    repoUrl: 'https://github.com/goatsoft/OKLabColorPicker',
    language: 'Swift',
    stars: 1,
    topics: [],
  },
]

export class StaticProjectRepository implements ProjectRepository {
  constructor(private readonly projects: readonly Project[] = SNAPSHOT) {}
  async list(): Promise<readonly Project[]> {
    return this.projects
  }
}
