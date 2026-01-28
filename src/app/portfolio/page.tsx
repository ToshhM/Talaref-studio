import { Metadata } from 'next'
import { getAllProjects } from '@/lib/api/projects'
import { PortfolioGrid } from '@/components/Portfolio'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Portfolio | TALAREF STUDIO',
  description: 'Découvrez nos projets en photographie, développement web, design et gestion de projet.',
}

export const revalidate = 3600 // Revalidate every hour

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const initialProjects = await getAllProjects()

  return (
    <div className="min-h-screen bg-background text-white selection:bg-secondaire selection:text-background">
      <Header />
      <main className="pt-32">
        <PortfolioGrid
          initialProjects={initialProjects}
          initialCategory={params.category || null}
        />
      </main>
      <Footer />
    </div>
  )
}
