"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ExpertiseItem } from './types';

interface SkillCardProps {
  item: ExpertiseItem;
  className?: string;
  style?: any;
}

const SkillCard: React.FC<SkillCardProps> = ({ item, className, style }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Détection mobile pour désactiver les animations lourdes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Parallax via CSS custom properties — zero React re-renders
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const degX = (y - centerY) / 20;
    const degY = (centerX - x) / 20;

    cardRef.current.style.setProperty('--rx', `${degX}deg`);
    cardRef.current.style.setProperty('--ry', `${degY}deg`);
    cardRef.current.style.setProperty('--light-x', `${degY * 20 + 50}%`);
    cardRef.current.style.setProperty('--light-y', `${-degX * 20 + 50}%`);
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.setProperty('--rx', '0deg');
      cardRef.current.style.setProperty('--ry', '0deg');
    }
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!isMobile) {
      setIsHovered(true);
    }
  }, [isMobile]);

  const handleClick = useCallback(() => {
    router.push(`/portfolio?category=${item.category}`);
  }, [router, item.category]);

  // Configuration simplifiée pour mobile
  const cardMotionProps = isMobile ? {
    whileTap: { scale: 0.98 }
  } : {
    transition: { type: "spring" as const, stiffness: 400, damping: 40 },
    whileHover: {
      scale: 1.05,
      z: 50,
      transition: { duration: 0.3 }
    },
    whileTap: { scale: 0.98 }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`perspective-2000 w-full h-[450px] cursor-pointer gpu-accelerate ${className}`}
      onClick={handleClick}
      onMouseMove={!isMobile ? handleMouseMove : undefined}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        ...style,
        // Use CSS custom properties for zero-rerender parallax
        rotateX: isMobile ? 0 : 'var(--rx, 0deg)',
        rotateY: isMobile ? 0 : 'var(--ry, 0deg)',
        willChange: isMobile ? 'auto' : 'transform',
        '--rx': '0deg',
        '--ry': '0deg',
        '--light-x': '50%',
        '--light-y': '50%',
      } as React.CSSProperties}
      {...cardMotionProps}
    >
      <div className="relative w-full h-full preserve-3d">
        {/* Card principale : Glassmorphism élégant */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#004269]/70 to-[#001829]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-start justify-between shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden group">

          {/* Overlay animé au hover - simplifié sur mobile */}
          {!isMobile && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-[#B8CE20]/10 to-transparent"
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.95
              }}
              transition={{ duration: 0.4 }}
            />
          )}

          {/* Effet de lumière qui suit la souris via CSS vars — no re-render */}
          {!isMobile && (
            <div
              className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(600px circle at var(--light-x, 50%) var(--light-y, 50%), rgba(184, 206, 32, 0.15), transparent 40%)`,
              }}
            />
          )}

          {/* Icône - animations simplifiées sur mobile */}
          {isMobile ? (
            <div className="w-16 h-16 bg-[#001829] border border-white/10 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-inner relative z-10">
              {item.icon}
            </div>
          ) : (
            <motion.div
              className="w-16 h-16 bg-[#001829] border border-white/10 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-inner relative z-10"
              animate={{
                y: isHovered ? -10 : 0,
                scale: isHovered ? 1.1 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {item.icon}
            </motion.div>
          )}

          {/* Contenu */}
          <div className="flex-grow relative z-10">
            <h3 className="text-3xl font-black mb-4 text-white tracking-tighter uppercase leading-none">{item.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6 font-medium">
              {item.description}
            </p>
          </div>

          {/* Tags de compétences */}
          <div className="flex flex-wrap gap-2 relative z-10">
            {item.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[9px] text-white/70 font-black uppercase tracking-widest"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 text-[10px] text-[#B8CE20] font-black uppercase tracking-[0.4em] flex items-center gap-4 relative z-10">
            Voir Projets
            <span className="text-2xl leading-none">→</span>
          </div>

          {/* Badge de couleur en coin */}
          <div
            className="absolute top-4 right-4 w-12 h-12 rounded-full blur-xl opacity-50"
            style={{ backgroundColor: item.color }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(SkillCard);
