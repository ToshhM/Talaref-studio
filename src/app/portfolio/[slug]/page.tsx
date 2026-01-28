import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjectBySlug, getAdjacentProjects } from '@/lib/api/projects'
import { ProjectDetailLayout } from '@/components/ProjectDetail'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    return {
      title: 'Projet Introuvable | TALAREF STUDIO',
    }
  }

  return {
    title: `${project.title} | TALAREF STUDIO`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.featured_image ? [project.featured_image] : [],
    },
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const { next, prev } = await getAdjacentProjects(slug, project.category)

  return (
    <div className="min-h-screen bg-background text-white selection:bg-secondaire selection:text-background">
      <Header />
      <main className="pt-20">
        <ProjectDetailLayout
          project={project}
          nextProject={next}
          prevProject={prev}
        />
      </main>
      <Footer />
    </div>
  )
}
