'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TechStackProps } from './types'
import styles from './ProjectDetail.module.css'

const TechStack: React.FC<TechStackProps> = ({ technologies }) => {
  if (!technologies || technologies.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={styles.techSection}
    >
      <h2 className={styles.techTitle}>Technologies Utilisées</h2>
      <div className={styles.techGrid}>
        {technologies.map((tech, index) => (
          <motion.div
            key={tech}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={styles.techItem}
          >
            <div className={styles.techName}>{tech}</div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

export default TechStack
