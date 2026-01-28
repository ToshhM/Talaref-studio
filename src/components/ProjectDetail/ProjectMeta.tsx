'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ProjectMetaProps } from './types'
import styles from './ProjectDetail.module.css'

const ProjectMeta: React.FC<ProjectMetaProps> = ({ category, tags, client, date }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={styles.metaSection}
    >
      <div className={styles.metaGrid}>
        {/* Category */}
        <div className={styles.metaItem}>
          <div className={styles.metaLabel}>Catégorie</div>
          <div className={styles.metaValue}>{category}</div>
        </div>

        {/* Tags */}
        <div className={styles.metaItem}>
          <div className={styles.metaLabel}>Tags</div>
          <div className={styles.metaTags}>
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className={styles.metaTag}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Client */}
        {client && (
          <div className={styles.metaItem}>
            <div className={styles.metaLabel}>Client</div>
            <div className={styles.metaValue}>{client}</div>
          </div>
        )}

        {/* Date */}
        {date && (
          <div className={styles.metaItem}>
            <div className={styles.metaLabel}>Date</div>
            <div className={styles.metaValue}>
              {new Date(date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
              })}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  )
}

export default ProjectMeta
