import { Project } from '@/lib/database.types'

export interface PortfolioGridProps {
  initialProjects: Project[]
  initialCategory?: string | null
}

export interface ProjectCardProps {
  project: Project
  index: number
}

export interface CategoryFilterProps {
  currentCategory: string | null
  onCategoryChange: (category: string | null) => void
}

export type CategoryType = 'Photo' | 'Web' | 'Design' | 'Projects' | null

export const CATEGORIES: { value: CategoryType; label: string }[] = [
  { value: null, label: 'Tous' },
  { value: 'Photo', label: 'Photo' },
  { value: 'Web', label: 'Web' },
  { value: 'Design', label: 'Design' },
  { value: 'Projects', label: 'Projets' },
]
