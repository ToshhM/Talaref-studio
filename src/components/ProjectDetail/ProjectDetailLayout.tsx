import React from 'react'
import { ProjectDetailLayoutProps } from './types'
import ProjectHero from './ProjectHero'
import ImageGallery from './ImageGallery'
import ProjectMeta from './ProjectMeta'
import TechStack from './TechStack'
import ProjectNavigation from './ProjectNavigation'

export const ProjectDetailLayout: React.FC<ProjectDetailLayoutProps> = ({
  project,
  nextProject,
  prevProject,
}) => {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <ProjectHero project={project} />

      {/* Image Gallery */}
      {project.images && project.images.length > 0 && (
        <ImageGallery images={project.images} title={project.title} />
      )}

      {/* Project Meta */}
      <ProjectMeta
        category={project.category}
        tags={project.tags}
        client={project.client}
        date={project.project_date}
      />

      {/* Content Section (if exists) */}
      {project.content && (
        <section className="py-16 px-6 max-w-4xl mx-auto">
          <div
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: project.content }}
          />
        </section>
      )}

      {/* Technologies Used */}
      {project.technologies && project.technologies.length > 0 && (
        <TechStack technologies={project.technologies} />
      )}

      {/* Navigation */}
      <ProjectNavigation nextProject={nextProject} prevProject={prevProject} />
    </div>
  )
}
