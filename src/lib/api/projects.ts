// import { supabase } from '../supabase'
import { Project } from '../database.types'
import { PROJECTS_DATA } from '@/data/projects-data'

/**
 * TEMPORAIRE: Utilise des données statiques pendant la maintenance Supabase
 *
 * Pour basculer vers Supabase une fois disponible:
 * 1. Décommentez les imports supabase
 * 2. Remplacez les fonctions ci-dessous par celles commentées en bas de fichier
 */

/**
 * Récupère tous les projets publiés
 */
export async function getAllProjects(): Promise<Project[]> {
  // Simule un délai réseau pour le réalisme
  await new Promise(resolve => setTimeout(resolve, 100))

  return PROJECTS_DATA
    .filter(p => p.published)
    .sort((a, b) => a.order_index - b.order_index)
}

/**
 * Récupère les projets filtrés par catégorie
 */
export async function getProjectsByCategory(category: string): Promise<Project[]> {
  await new Promise(resolve => setTimeout(resolve, 100))

  return PROJECTS_DATA
    .filter(p => p.published && p.category === category)
    .sort((a, b) => a.order_index - b.order_index)
}

/**
 * Récupère un projet par son slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  await new Promise(resolve => setTimeout(resolve, 100))

  const project = PROJECTS_DATA.find(p => p.slug === slug && p.published)
  return project || null
}

/**
 * Récupère les projets mis en avant
 */
export async function getFeaturedProjects(limit: number = 6): Promise<Project[]> {
  await new Promise(resolve => setTimeout(resolve, 100))

  return PROJECTS_DATA
    .filter(p => p.published && p.featured)
    .sort((a, b) => a.order_index - b.order_index)
    .slice(0, limit)
}

/**
 * Récupère les projets adjacents (suivant/précédent) pour la navigation
 */
export async function getAdjacentProjects(
  currentSlug: string,
  category: string
): Promise<{ next: Project | null; prev: Project | null }> {
  await new Promise(resolve => setTimeout(resolve, 100))

  const allProjects = PROJECTS_DATA
    .filter(p => p.published && p.category === category)
    .sort((a, b) => a.order_index - b.order_index)

  const currentIndex = allProjects.findIndex(p => p.slug === currentSlug)

  if (currentIndex === -1) return { next: null, prev: null }

  return {
    next: allProjects[currentIndex + 1] || null,
    prev: allProjects[currentIndex - 1] || null,
  }
}

/*
==========================================================================
FONCTIONS SUPABASE (À UTILISER QUAND SUPABASE SERA DISPONIBLE)
==========================================================================

Décommentez ces fonctions et commentez celles au-dessus pour passer à Supabase:

import { supabase } from '../supabase'

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

  return data || []
}

export async function getProjectsByCategory(category: string): Promise<Project[]> {
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

  return data || []
}

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

  return data
}

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

  return data || []
}

export async function getAdjacentProjects(
  currentSlug: string,
  category: string
): Promise<{ next: Project | null; prev: Project | null }> {
  const { data: allProjects } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .eq('category', category)
    .order('order_index', { ascending: true })

  if (!allProjects) return { next: null, prev: null }

  const currentIndex = allProjects.findIndex(p => p.slug === currentSlug)

  if (currentIndex === -1) return { next: null, prev: null }

  return {
    next: allProjects[currentIndex + 1] || null,
    prev: allProjects[currentIndex - 1] || null,
  }
}

*/
