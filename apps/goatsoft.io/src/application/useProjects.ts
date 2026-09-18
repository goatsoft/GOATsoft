import type { Project } from '@/domain/project/Project.ts'
import type { ProjectSource } from '@/domain/project/ProjectRepository.ts'
import { curateProjects } from '@/domain/project/ProjectCatalogue.ts'
import { CompositeProjectRepository } from '@/infrastructure/catalogue/CompositeProjectRepository.ts'
import { CURATION, SHOWN, StaticProjectRepository } from '@/infrastructure/catalogue/StaticProjectRepository.ts'
import { GitHubProjectRepository } from '@/infrastructure/github/GitHubProjectRepository.ts'
import { siteConfig } from '@/infrastructure/config/site.ts'

type Status = 'idle' | 'loading' | 'ready' | 'error'

/**
 * Use case: the curated showcase. Live GitHub data when reachable, the catalogue
 * snapshot otherwise; curation is applied either way. @see ADR 0006
 */
export function useProjects() {
  const projects = ref<readonly Project[]>([])
  const status = ref<Status>('idle')
  const source = ref<ProjectSource>('catalogue')
  let controller: AbortController | null = null

  const repository = new CompositeProjectRepository(
    new GitHubProjectRepository({
      organisation: siteConfig.organisation,
      storage: typeof sessionStorage !== 'undefined' ? sessionStorage : undefined,
    }),
    new StaticProjectRepository(),
  )

  async function load() {
    controller?.abort()
    controller = new AbortController()
    status.value = 'loading'
    try {
      const listing = await repository.listWithSource(controller.signal)
      projects.value = curateProjects(listing.projects, CURATION, SHOWN)
      source.value = listing.source
      status.value = 'ready'
    } catch (error) {
      if (controller.signal.aborted) return
      status.value = 'error'
      console.warn('Projects unavailable', error)
    }
  }

  onMounted(load)
  onUnmounted(() => controller?.abort())

  const featured = computed(() => projects.value.filter(p => p.featured))
  const others = computed(() => projects.value.filter(p => !p.featured))

  return { projects, featured, others, status, source, reload: load }
}
