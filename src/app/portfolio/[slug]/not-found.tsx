'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-8xl md:text-9xl font-black mb-6 text-secondaire">
          404
        </h1>
        <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tight">
          Projet introuvable
        </h2>
        <p className="text-white/60 mb-12 text-lg leading-relaxed">
          Ce projet n&apos;existe pas ou a été supprimé. Retournez au portfolio pour
          découvrir tous nos projets.
        </p>
        <Link
          href="/portfolio"
          className="inline-block bg-secondaire text-background px-8 py-4 rounded-full font-black uppercase tracking-widest text-sm hover:brightness-110 transition-all hover:scale-105 active:scale-95"
        >
          Retour au Portfolio
        </Link>
      </motion.div>
    </div>
  )
}
