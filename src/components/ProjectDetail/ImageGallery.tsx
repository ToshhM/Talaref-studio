'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { ImageGalleryProps } from './types'
import styles from './ProjectDetail.module.css'

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const triggerButtonRef = useRef<HTMLButtonElement>(null)
  const lightboxRef = useRef<HTMLDivElement>(null)
  const isLightboxOpen = selectedImage !== null

  useEffect(() => {
    if (!isLightboxOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedImage(null)
      } else if (event.key === 'ArrowRight') {
        setSelectedImage((current) =>
          current === null ? null : (current + 1) % images.length
        )
      } else if (event.key === 'ArrowLeft') {
        setSelectedImage((current) =>
          current === null ? null : (current - 1 + images.length) % images.length
        )
      } else if (event.key === 'Tab') {
        const buttons = lightboxRef.current?.querySelectorAll<HTMLButtonElement>(
          'button:not([disabled])'
        )
        if (!buttons?.length) return

        const first = buttons[0]
        const last = buttons[buttons.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      triggerButtonRef.current?.focus()
    }
  }, [images.length, isLightboxOpen])

  if (!images || images.length === 0) return null

  return (
    <>
      <div className={styles.galleryGrid}>
        {images.map((image, index) => (
          <motion.div
            key={image}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={styles.galleryItem}
          >
            <button
              type="button"
              className={styles.galleryButton}
              aria-label={`Agrandir l’image ${index + 1} du projet ${title}`}
              onClick={(event) => {
                triggerButtonRef.current = event.currentTarget
                setSelectedImage(index)
              }}
            >
              <Image
                src={image}
                alt={`${title} - Image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={styles.galleryImage}
              />
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            ref={lightboxRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Galerie d’images du projet ${title}`}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedImage(null)
            }}
            className={styles.lightbox}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className={styles.lightboxContent}
            >
              <button
                ref={closeButtonRef}
                type="button"
                className={styles.lightboxClose}
                aria-label="Fermer la galerie"
                onClick={() => setSelectedImage(null)}
              >
                <X aria-hidden="true" />
              </button>
              <Image
                src={images[selectedImage]}
                alt={`${title} - Image ${selectedImage + 1}`}
                fill
                sizes="100vw"
                className={styles.lightboxImage}
              />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className={`${styles.lightboxControl} ${styles.lightboxPrevious}`}
                    aria-label="Image précédente"
                    onClick={() =>
                      setSelectedImage((selectedImage - 1 + images.length) % images.length)
                    }
                  >
                    <ChevronLeft aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className={`${styles.lightboxControl} ${styles.lightboxNext}`}
                    aria-label="Image suivante"
                    onClick={() => setSelectedImage((selectedImage + 1) % images.length)}
                  >
                    <ChevronRight aria-hidden="true" />
                  </button>
                </>
              )}
              <p className={styles.lightboxCounter} aria-live="polite">
                Image {selectedImage + 1} sur {images.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ImageGallery
