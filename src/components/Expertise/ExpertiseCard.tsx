'use client';

import { motion } from 'framer-motion';
import styles from './Expertise.module.css';

interface ExpertiseCardProps {
    id: number;
    icon: string;
    title: string;
    description: string;
    features: string[];
}

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 50,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] as const,
        },
    },
};


export default function ExpertiseCard({ icon, title, description, features }: ExpertiseCardProps) {
    return (
        <motion.article
            className={styles.card}
            variants={cardVariants}
            whileHover={{
                y: -10,
                transition: { duration: 0.3 },
            }}
        >
            {/* Icon */}
            <div className={styles.cardIcon}>
                <span>{icon}</span>
            </div>

            {/* Content */}
            <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardDescription}>{description}</p>
            </div>

            {/* Features Tags */}
            <div className={styles.cardFeatures}>
                {features.map((feature) => (
                    <span key={feature} className={styles.featureTag}>
                        {feature}
                    </span>
                ))}
            </div>

            {/* Hover Glow Effect */}
            <div className={styles.cardGlow} />

            {/* Border Gradient */}
            <div className={styles.cardBorder} />
        </motion.article>
    );
}
