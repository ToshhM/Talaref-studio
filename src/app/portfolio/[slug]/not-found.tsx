'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { SiteHeader } from '@/components/Home/site-header'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-white">
      <SiteHeader />
      <main className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6">
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
            Retour aux clients
          </Link>
        </motion.div>
      </main>
    </div>
  )
}
