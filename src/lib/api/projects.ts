import { supabase } from '../supabase'
import { Project } from '../database.types'

// Note : le typage généré de @supabase/supabase-js n'infère pas correctement
// la forme de retour de `.select('*')` avec ce Database (bug connu de
// typegen selon les versions) — les `as Project[]` ci-dessous comblent
// l'écart. Les données runtime, elles, correspondent bien au type `Project`.

const LOCAL_IMAGE_PATHS: Record<string, string> = {
  '/images/projects/monela/sublimez-vous.png':
    '/images/projects/monela/Sublimez-vous.png',
  '/images/projects/monela/abonnez.png':
    '/images/projects/monela/Abonnez.png',
}

function normalizeProjectImageUrl(url: string): string {
  if (LOCAL_IMAGE_PATHS[url]) return LOCAL_IMAGE_PATHS[url]

  return url.replace(
    /^http:\/\/(?:www\.)?image-heberg\.fr\//i,
    'https://www.image-heberg.fr/'
  )
}

function normalizeProjectImages(project: Project): Project {
  return {
    ...project,
    featured_image: project.featured_image
      ? normalizeProjectImageUrl(project.featured_image)
      : null,
    images: project.images.map(normalizeProjectImageUrl),
  }
}

/**
 * Récupère tous les projets publiés
 */
export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return ((data as Project[] | null) || []).map(normalizeProjectImages)
}

/**
 * Récupère les projets filtrés par catégorie
 */
export async function getProjectsByCategory(category: Project['category']): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects by category:', error)
    return []
  }

  return ((data as Project[] | null) || []).map(normalizeProjectImages)
}

/**
 * Récupère un projet par son slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error) {
    console.error('Error fetching project:', error)
    return null
  }

  return data ? normalizeProjectImages(data as Project) : null
}

/**
 * Récupère les projets mis en avant
 */
export async function getFeaturedProjects(limit: number = 6): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('order_index', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured projects:', error)
    return []
  }

  return ((data as Project[] | null) || []).map(normalizeProjectImages)
}

/**
 * Récupère les projets adjacents (suivant/précédent) pour la navigation
 */
export async function getAdjacentProjects(
  currentSlug: string,
  category: Project['category']
): Promise<{ next: Project | null; prev: Project | null }> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .order('order_index', { ascending: true })

  const allProjects = (data as Project[] | null)?.map(normalizeProjectImages)

  if (!allProjects) return { next: null, prev: null }

  const currentIndex = allProjects.findIndex((p) => p.slug === currentSlug)

  if (currentIndex === -1) return { next: null, prev: null }

  return {
    next: allProjects[currentIndex + 1] || null,
    prev: allProjects[currentIndex - 1] || null,
  }
}
