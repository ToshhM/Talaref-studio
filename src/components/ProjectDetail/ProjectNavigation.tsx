'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ProjectNavigationProps } from './types'
import styles from './ProjectDetail.module.css'

const ProjectNavigation: React.FC<ProjectNavigationProps> = ({
  nextProject,
  prevProject,
}) => {
  const router = useRouter()

  return (
    <div className={styles.navigation}>
      {prevProject && (
        <motion.button
          onClick={() => router.push(`/portfolio/${prevProject.slug}`)}
          className={styles.navButton}
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className={styles.navArrow}>←</span>
          <div className={styles.navContent}>
            <span className={styles.navLabel}>Projet précédent</span>
            <span className={styles.navTitle}>{prevProject.title}</span>
          </div>
        </motion.button>
      )}

      <motion.button
        onClick={() => router.push('/portfolio')}
        className={styles.navButtonCenter}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Retour au Portfolio
      </motion.button>

      {nextProject && (
        <motion.button
          onClick={() => router.push(`/portfolio/${nextProject.slug}`)}
          className={styles.navButton}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className={styles.navContent}>
            <span className={styles.navLabel}>Projet suivant</span>
            <span className={styles.navTitle}>{nextProject.title}</span>
          </div>
          <span className={styles.navArrow}>→</span>
        </motion.button>
      )}
    </div>
  )
}

export default ProjectNavigation
