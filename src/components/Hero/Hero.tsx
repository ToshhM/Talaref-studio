'use client';

import { motion } from 'framer-motion';

export default function Hero() {
    return (
        <section className="pt-52 pb-24 px-6 max-w-7xl mx-auto text-center" id="hero">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
                <span className="inline-block px-5 py-2 rounded-full bg-principale/30 border border-white/10 text-secondaire text-[10px] font-black uppercase tracking-[0.4em] mb-10">
                    Showcase Expertise
                </span>
                <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black mb-12 leading-[0.85] tracking-tighter text-white">
                    Des compétences <br />
                    <span className="text-secondaire">multiples</span> <br />
                    pour vos projets.
                </h1>
                <p className="text-white/60 max-w-2xl mx-auto text-xl leading-relaxed font-medium">
                    Nous transformons vos visions complexes en expériences digitales simples, puissantes et impactantes.
                </p>
            </motion.div>
        </section>
    );
}
