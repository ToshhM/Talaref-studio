'use client'

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { PortfolioGridProps } from './types'
import ProjectCard from './ProjectCard'
import CategoryFilter from './CategoryFilter'

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({
  initialProjects,
  initialCategory
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null)

  const filteredProjects = useMemo(() => {
    if (!selectedCategory) return initialProjects
    return initialProjects.filter(p => p.category === selectedCategory)
  }, [initialProjects, selectedCategory])

  return (
    <section className="py-20 px-6 bg-background relative overflow-hidden min-h-screen">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-principale/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-secondaire/5 blur-[150px] rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <span className="text-secondaire font-black tracking-[0.3em] uppercase text-xs">
            Nos Réalisations
          </span>
          <h1 className="text-5xl md:text-8xl font-black mt-6 tracking-tighter uppercase">
            Portfolio
          </h1>
        </motion.div>

        {/* Category Filter */}
        <CategoryFilter
          currentCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16"
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <p className="text-white/40 text-lg font-black uppercase tracking-widest">
              Aucun projet dans cette catégorie
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
