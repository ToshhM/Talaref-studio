import { Project } from '@/lib/database.types'

export interface ProjectDetailLayoutProps {
  project: Project
  nextProject: Project | null
  prevProject: Project | null
}

export interface ProjectHeroProps {
  project: Project
}

export interface ImageGalleryProps {
  images: string[]
  title: string
}

export interface ProjectMetaProps {
  category: string
  tags: string[]
  client: string | null
  date: string | null
}

export interface TechStackProps {
  technologies: string[]
}

export interface ProjectNavigationProps {
  nextProject: Project | null
  prevProject: Project | null
}
