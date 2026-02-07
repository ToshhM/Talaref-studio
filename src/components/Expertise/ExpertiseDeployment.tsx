"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { EXPERTISE_DATA } from '../constants';
import SkillCard from './SkillCard';
import { useDevicePerformance } from '@/hooks/useDevicePerformance';

export const ExpertiseDeployment: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    const { isMobile, shouldReduceAnimations } = useDevicePerformance();

    // État pour animation CSS mobile
    const [scrollProgress, setScrollProgress] = useState(0);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Scroll listener simplifié pour mobile (CSS animations)
    useEffect(() => {
        if (!shouldReduceAnimations || !containerRef.current) return;

        const handleScroll = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const sectionHeight = containerRef.current.offsetHeight;

            // Calcul du progress (0 à 1)
            const scrolled = -rect.top;
            const total = sectionHeight - viewportHeight;
            const progress = Math.max(0, Math.min(1, scrolled / total));

            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial call

        return () => window.removeEventListener('scroll', handleScroll);
    }, [shouldReduceAnimations]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 70,
        damping: 30,
        restDelta: 0.001
    });

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

    // Cover Card (Desktop uniquement avec Framer Motion)
    const centralScale = useTransform(smoothProgress, [0, 0.2], [1, 0.3]);
    const centralOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);
    const centralY = useTransform(smoothProgress, [0, 0.2], [0, -250]);

    // Background Title
    const bgScale = useTransform(smoothProgress, [0, 1], [0.9, 1.1]);
    const bgOp = useTransform(smoothProgress, [0, 0.5], [0, 0.1]);

    // Calculs CSS pour mobile (pure CSS transitions)
    const getCoverStyle = () => {
        const opacity = Math.max(0, 1 - scrollProgress * 6);
        const scale = 1 - scrollProgress * 2.5;
        const translateY = scrollProgress * -150;
        return {
            opacity,
            transform: `scale(${Math.max(0.3, scale)}) translateY(${translateY}px)`,
        };
    };

    const getCardStyle = (index: number) => {
        const start = 0.15 + (index * 0.18);
        const end = start + 0.22;

        // Calcul de la visibilité
        let opacity = 0;
        if (scrollProgress >= start && scrollProgress <= end) {
            const fadeIn = Math.min(1, (scrollProgress - start) / 0.05);
            const fadeOut = Math.min(1, (end - scrollProgress) / 0.05);
            opacity = Math.min(fadeIn, fadeOut);
        }

        // Calcul du scale
        const scaleProgress = Math.min(1, (scrollProgress - start) / 0.08);
        const scale = 0.8 + (scaleProgress * 0.2);

        // Calcul du Y
        const yIn = Math.max(0, 300 - (scrollProgress - start) * 3750);
        const yOut = scrollProgress > (end - 0.08) ? (scrollProgress - (end - 0.08)) * 2500 : 0;

        return {
            opacity,
            transform: `scale(${scale}) translateY(${yIn - yOut}px)`,
            zIndex: 50 - index,
        };
    };

    // ========== VERSION MOBILE PURE CSS ==========
    if (shouldReduceAnimations) {
        return (
            <section
                id="expertise"
                ref={containerRef}
                className="relative h-[450vh] bg-background flex flex-col items-center"
            >
                <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
                    {/* Carte de couverture - CSS Pure */}
                    <div
                        style={{
                            ...getCoverStyle(),
                            transition: 'none', // Pas de transition pour réactivité maximale
                            willChange: 'transform, opacity',
                        }}
                        className="absolute flex flex-col items-center justify-center pointer-events-none z-[100]"
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
                        <div className="mt-10 flex flex-col items-center gap-3">
                            <span className="text-secondaire font-black tracking-[0.3em] text-[10px] uppercase">Scrollez pour déployer</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-secondaire">
                                <path d="M12 4L12 20M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="w-px h-16 bg-gradient-to-b from-secondaire to-transparent" />
                        </div>
                    </div>

                    {/* Skill Cards - CSS Pure */}
                    <div className="w-full h-full flex flex-col items-center justify-center relative px-8">
                        {EXPERTISE_DATA.map((item, idx) => (
                            <div
                                key={item.id}
                                style={{
                                    ...getCardStyle(idx),
                                    transition: 'none',
                                    willChange: 'transform, opacity',
                                }}
                                className="absolute w-full max-w-[320px]"
                            >
                                <SkillCard item={item} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // ========== VERSION DESKTOP FRAMER MOTION ==========
    return (
        <section
            id="expertise"
            ref={containerRef}
            className="relative h-[450vh] bg-background flex flex-col items-center"
        >
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

                {/* Titre en arrière-plan (centré) */}
                <motion.h2
                    style={{ opacity: bgOp, scale: bgScale }}
                    className="absolute text-[22vw] font-black text-white whitespace-nowrap select-none uppercase tracking-tighter z-0 pointer-events-none"
                >
                    EXPERTISE
                </motion.h2>

                {/* Carte de couverture */}
                <motion.div
                    style={{
                        scale: centralScale,
                        opacity: centralOpacity,
                        y: centralY,
                        zIndex: 100
                    }}
                    className="absolute flex flex-col items-center justify-center pointer-events-none"
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
                        transition={{ duration: 2, repeat: Infinity }}
                        className="mt-10 flex flex-col items-center gap-3"
                    >
                        <span className="text-secondaire font-black tracking-[0.3em] text-[10px] uppercase">Scrollez pour déployer</span>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="flex flex-col items-center"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-secondaire">
                                <path d="M12 4L12 20M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </motion.div>
                        <div className="w-px h-16 bg-gradient-to-b from-secondaire to-transparent" />
                    </motion.div>
                </motion.div>

                {/* Mise en page Desktop : Déploiement horizontal centré */}
                <div className="hidden lg:block relative w-full h-full">
                    <motion.div style={{ x: x1, opacity: op1, rotate: r1 }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] xl:w-[320px]">
                        <SkillCard item={EXPERTISE_DATA[0]} />
                    </motion.div>
                    <motion.div style={{ x: x2, opacity: op2, rotate: r2 }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] xl:w-[320px]">
                        <SkillCard item={EXPERTISE_DATA[1]} />
                    </motion.div>
                    <motion.div style={{ x: x3, opacity: op3, rotate: r3 }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] xl:w-[320px]">
                        <SkillCard item={EXPERTISE_DATA[2]} />
                    </motion.div>
                    <motion.div style={{ x: x4, opacity: op4, rotate: r4 }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] xl:w-[320px]">
                        <SkillCard item={EXPERTISE_DATA[3]} />
                    </motion.div>
                </div>

                {/* Mobile - masqué car géré séparément */}
                <div className="lg:hidden" />
            </div>
        </section>
    );
};
