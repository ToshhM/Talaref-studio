"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { EXPERTISE_DATA } from '../constants';
import SkillCard from './SkillCard';

// Hook personnalisé pour les animations de carte mobile (évite les hooks dans la boucle)
const useMobileCardAnimations = (
    smoothProgress: MotionValue<number>,
    cardIndex: number
) => {
    const start = 0.15 + (cardIndex * 0.18);
    const end = start + 0.22;

    const mobY = useTransform(smoothProgress, [start, start + 0.08], [300, 0]);
    const mobOp = useTransform(smoothProgress, [start, start + 0.05, end - 0.05, end], [0, 1, 1, 0]);
    const mobScale = useTransform(smoothProgress, [start, start + 0.08], [0.85, 1]);
    const mobExitY = useTransform(smoothProgress, [end - 0.08, end], [0, -200]);

    return { mobY, mobOp, mobScale, mobExitY, zIndex: 50 - cardIndex };
};

// Composant pour carte mobile optimisé
const MobileSkillCard: React.FC<{
    item: typeof EXPERTISE_DATA[0];
    smoothProgress: MotionValue<number>;
    index: number;
}> = React.memo(({ item, smoothProgress, index }) => {
    const { mobY, mobOp, mobScale, mobExitY, zIndex } = useMobileCardAnimations(smoothProgress, index);

    return (
        <motion.div
            style={{
                y: mobY,
                translateY: mobExitY,
                opacity: mobOp,
                scale: mobScale,
                zIndex,
                willChange: 'transform, opacity',
            }}
            className="absolute w-full max-w-[320px] gpu-accelerate"
        >
            <SkillCard item={item} />
        </motion.div>
    );
});

MobileSkillCard.displayName = 'MobileSkillCard';

export const ExpertiseDeployment: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const width = window.innerWidth;
            setWindowWidth(width);
            setIsMobile(width < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Spring avec paramètres optimisés pour mobile (plus réactif, moins de calculs)
    const springConfig = useMemo(() => ({
        stiffness: isMobile ? 100 : 70,
        damping: isMobile ? 20 : 30,
        restDelta: 0.001,
        mass: isMobile ? 0.5 : 1
    }), [isMobile]);

    const smoothProgress = useSpring(scrollYProgress, springConfig);

    // --- ANIMATIONS DESKTOP (Déploiement en éventail centré) ---
    const spreadMultiplier = windowWidth < 1280 ? 28 : 32;

    const x1 = useTransform(smoothProgress, [0.1, 0.6], ["0vw", `-${spreadMultiplier / 1}vw`]);
    const x2 = useTransform(smoothProgress, [0.2, 0.6], ["0vw", `-${spreadMultiplier / 3}vw`]);
    const x3 = useTransform(smoothProgress, [0.3, 0.6], ["0vw", `${spreadMultiplier / 3}vw`]);
    const x4 = useTransform(smoothProgress, [0.4, 0.6], ["0vw", `${spreadMultiplier / 1}vw`]);

    const r1 = useTransform(smoothProgress, [0.1, 0.6], [10, -3]);
    const r2 = useTransform(smoothProgress, [0.2, 0.6], [5, -1]);
    const r3 = useTransform(smoothProgress, [0.3, 0.6], [-5, 1]);
    const r4 = useTransform(smoothProgress, [0.4, 0.6], [-10, 3]);

    const op1 = useTransform(smoothProgress, [0.1, 0.3], [0, 1]);
    const op2 = useTransform(smoothProgress, [0.2, 0.4], [0, 1]);
    const op3 = useTransform(smoothProgress, [0.3, 0.5], [0, 1]);
    const op4 = useTransform(smoothProgress, [0.4, 0.6], [0, 1]);

    // Cover Card (La carte qui s'efface au début)
    const centralScale = useTransform(smoothProgress, [0, 0.2], [1, 0.3]);
    const centralOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);
    const centralY = useTransform(smoothProgress, [0, 0.2], [0, -250]);

    // Background Title
    const bgScale = useTransform(smoothProgress, [0, 1], [0.9, 1.1]);
    const bgOp = useTransform(smoothProgress, [0, 0.5], [0, 0.1]);

    return (
        <section
            id="expertise"
            ref={containerRef}
            className="relative h-[450vh] bg-background flex flex-col items-center"
        >
            {/* CSS pour accélération GPU */}
            <style jsx global>{`
                .gpu-accelerate {
                    transform: translateZ(0);
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                    perspective: 1000px;
                    -webkit-perspective: 1000px;
                }
                
                @media (max-width: 1023px) {
                    .expertise-card-container {
                        transform: translate3d(0, 0, 0);
                    }
                }
            `}</style>

            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

                {/* Titre en arrière-plan (centré) */}
                <motion.h2
                    style={{ opacity: bgOp, scale: bgScale, willChange: 'transform, opacity' }}
                    className="absolute text-[22vw] font-black text-white whitespace-nowrap select-none uppercase tracking-tighter z-0 pointer-events-none gpu-accelerate"
                >
                    EXPERTISE
                </motion.h2>

                {/* Carte de couverture (Initialement centrée) */}
                <motion.div
                    style={{
                        scale: centralScale,
                        opacity: centralOpacity,
                        y: centralY,
                        zIndex: 100,
                        willChange: 'transform, opacity'
                    }}
                    className="absolute flex flex-col items-center justify-center pointer-events-none gpu-accelerate"
                >
                    <div className="w-[300px] h-[450px] bg-white rounded-[3rem] shadow-[0_0_100px_rgba(184,206,32,0.2)] flex flex-col items-center justify-center p-8 border-[10px] border-secondaire">
                        <span className="text-background font-black text-sm mb-4 tracking-[0.5em] uppercase">Nos</span>
                        <h3 className="text-background font-black text-7xl tracking-tighter leading-none">SKILLS</h3>
                        <div className="mt-12 flex gap-3">
                            <div className="w-3 h-3 rounded-full bg-secondaire" />
                            <div className="w-3 h-3 rounded-full bg-principale" />
                            <div className="w-3 h-3 rounded-full bg-background" />
                        </div>
                    </div>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="mt-10 flex flex-col items-center gap-3"
                    >
                        <span className="text-secondaire font-black tracking-[0.3em] text-[10px] uppercase">Scrollez pour déployer</span>
                        <div className="w-px h-20 bg-gradient-to-b from-secondaire to-transparent" />
                    </motion.div>
                </motion.div>

                {/* Mise en page Desktop : Déploiement horizontal centré */}
                <div className="hidden lg:block relative w-full h-full">
                    <motion.div style={{ x: x1, opacity: op1, rotate: r1, willChange: 'transform, opacity' }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] xl:w-[320px] gpu-accelerate">
                        <SkillCard item={EXPERTISE_DATA[0]} />
                    </motion.div>
                    <motion.div style={{ x: x2, opacity: op2, rotate: r2, willChange: 'transform, opacity' }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] xl:w-[320px] gpu-accelerate">
                        <SkillCard item={EXPERTISE_DATA[1]} />
                    </motion.div>
                    <motion.div style={{ x: x3, opacity: op3, rotate: r3, willChange: 'transform, opacity' }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] xl:w-[320px] gpu-accelerate">
                        <SkillCard item={EXPERTISE_DATA[2]} />
                    </motion.div>
                    <motion.div style={{ x: x4, opacity: op4, rotate: r4, willChange: 'transform, opacity' }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] xl:w-[320px] gpu-accelerate">
                        <SkillCard item={EXPERTISE_DATA[3]} />
                    </motion.div>
                </div>

                {/* Mise en page Mobile : Les cartes à la suite (séquentiel) - OPTIMISÉ */}
                <div className="lg:hidden w-full h-full flex flex-col items-center justify-center relative px-8 expertise-card-container">
                    {EXPERTISE_DATA.map((item, idx) => (
                        <MobileSkillCard
                            key={item.id}
                            item={item}
                            smoothProgress={smoothProgress}
                            index={idx}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
