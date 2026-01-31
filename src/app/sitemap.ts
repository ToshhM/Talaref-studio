import { MetadataRoute } from 'next'
import { PROJECTS_DATA } from '@/data/projects-data'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.talaref.co'

    // Pages statiques
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
        {
            url: `${baseUrl}/portfolio`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
    ]

    // Pages de projets dynamiques
    const projectPages: MetadataRoute.Sitemap = PROJECTS_DATA
        .filter(project => project.published)
        .map((project) => ({
            url: `${baseUrl}/portfolio/${project.slug}`,
            lastModified: new Date(project.updated_at),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }))

    return [...staticPages, ...projectPages]
}
