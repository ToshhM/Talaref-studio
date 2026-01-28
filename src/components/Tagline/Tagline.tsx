'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './Tagline.module.css';

const words = ['La', 'forge', 'de', 'vos', 'idées,', 'le', 'feu', 'de', 'votre', 'succès.'];

export default function Tagline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [50, 0, 0, -50]);

    return (
        <section ref={containerRef} className={styles.section}>
            <motion.div
                className={styles.container}
                style={{ opacity, y }}
            >
                <div className={styles.tagline}>
                    {words.map((word, index) => (
                        <motion.span
                            key={index}
                            className={`${styles.word} ${word === 'forge' || word === 'feu' || word === 'succès.'
                                    ? styles.accent
                                    : ''
                                }`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: index * 0.08,
                                duration: 0.5,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            {word}
                        </motion.span>
                    ))}
                </div>

                <motion.div
                    className={styles.cta}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    <a href="#contact" className={styles.ctaButton}>
                        Démarrer un projet
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>
                </motion.div>
            </motion.div>

            {/* Background Elements */}
            <div className={styles.bgPattern} />
        </section>
    );
}
