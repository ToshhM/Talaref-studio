import { Metadata } from 'next'
import { getAllProjects } from '@/lib/api/projects'
import { PortfolioGrid } from '@/components/Portfolio'
import { SiteHeader } from '@/components/Home/site-header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  alternates: { canonical: '/portfolio' },
  title: 'Nos clients | TALAREF STUDIO',
  description: 'Découvrez nos clients et études de cas : description détaillée des projets, résultats et données clés.',
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
      <SiteHeader />
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
