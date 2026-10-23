'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ProjectCardProps } from './types'
import styles from './Portfolio.module.css'

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={styles.projectCard}
    >
      <Link
        href={`/portfolio/${project.slug}`}
        className={styles.projectCardLink}
        aria-label={`Voir le projet ${project.title}`}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
      >
        <div className={styles.imageContainer}>
          {project.featured_image ? (
            <Image
              src={project.featured_image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={styles.image}
            />
          ) : (
            <div className={styles.imagePlaceholder} aria-hidden="true" />
          )}

          <div className={styles.imageOverlay} />

          <div className={styles.categoryBadge}>
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">
              {project.category}
            </span>
          </div>
        </div>

        <div className={styles.cardContent}>
          <h3 className={styles.cardTitle}>{project.title}</h3>
          <p className={styles.cardDescription}>{project.description}</p>

          <div className={styles.keyDataContainer}>
            {project.client && (
              <div className={styles.keyDataItem}>
                <div className={styles.keyDataLabel}>Client</div>
                <div className={styles.keyDataValue}>{project.client}</div>
              </div>
            )}

            {project.project_date && (
              <div className={styles.keyDataItem}>
                <div className={styles.keyDataLabel}>Date</div>
                <div className={styles.keyDataValue}>{new Date(project.project_date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</div>
              </div>
            )}

            {project.tags && project.tags.length > 0 && (
              <div className={styles.keyDataItem}>
                <div className={styles.keyDataLabel}>Focus</div>
                <div className={styles.keyDataValue}>{project.tags[0]}</div>
              </div>
            )}
          </div>

          {project.tags.length > 0 && (
            <div className={styles.tagsContainer}>
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <motion.div
            className={styles.cardCta}
            animate={{ gap: isHovered ? '1.5rem' : '1rem' }}
          >
            <span>Voir le projet</span>
            <motion.span
              animate={{ x: isHovered ? 5 : 0 }}
              className="text-2xl"
              aria-hidden="true"
            >
              →
            </motion.span>
          </motion.div>
        </div>
      </Link>
    </motion.article>
  )
}

export default ProjectCard
