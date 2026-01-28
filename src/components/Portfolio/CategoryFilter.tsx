'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { CategoryFilterProps, CATEGORIES } from './types'
import styles from './Portfolio.module.css'

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  currentCategory,
  onCategoryChange,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryClick = (category: string | null) => {
    onCategoryChange(category)

    // Update URL with category filter
    const params = new URLSearchParams(searchParams.toString())
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    router.push(`/portfolio?${params.toString()}`, { scroll: false })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={styles.filterContainer}
    >
      {CATEGORIES.map((cat) => (
        <motion.button
          key={cat.label}
          onClick={() => handleCategoryClick(cat.value)}
          className={`${styles.filterButton} ${
            currentCategory === cat.value ? styles.filterButtonActive : ''
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {cat.label}
        </motion.button>
      ))}
    </motion.div>
  )
}

export default CategoryFilter
