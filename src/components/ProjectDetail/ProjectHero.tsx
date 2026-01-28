'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ProjectHeroProps } from './types'
import styles from './ProjectDetail.module.css'

const ProjectHero: React.FC<ProjectHeroProps> = ({ project }) => {
  return (
    <section className={styles.hero}>
      {/* Background Image */}
      {project.featured_image && (
        <div className={styles.heroBackground}>
          <Image
            src={project.featured_image}
            alt={project.title}
            fill
            className={styles.heroImage}
            priority
          />
          <div className={styles.heroOverlay} />
        </div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={styles.heroContent}
      >
        <div className={styles.heroCategory}>{project.category}</div>
        <h1 className={styles.heroTitle}>{project.title}</h1>
        <p className={styles.heroDescription}>{project.description}</p>
      </motion.div>
    </section>
  )
}

export default ProjectHero
