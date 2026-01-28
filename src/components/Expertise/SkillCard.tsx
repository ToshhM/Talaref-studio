"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExpertiseItem } from './types';
//import { useRouter } from 'next/router';

interface SkillCardProps {
  item: ExpertiseItem;
  className?: string;
  style?: any;
}

const SkillCard: React.FC<SkillCardProps> = ({ item, className, style }) => {
  //const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  // Effet de parallaxe au survol
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const degX = (y - centerY) / 20;
    const degY = (centerX - x) / 20;
    setRotateX(degX);
    setRotateY(degY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleClick = () => {
    // Redirection vers la page portfolio
    // Tu pourras personnaliser les routes plus tard (ex: /portfolio/web-dev)
    //router.push('/portfolio');
  };

  return (
    <motion.div
      className={`perspective-2000 w-full h-[450px] cursor-pointer ${className}`}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        ...style,
        rotateX: rotateX,
        rotateY: rotateY,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
      whileHover={{
        scale: 1.05,
        z: 50,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative w-full h-full transition-all duration-500 preserve-3d">
        {/* Card principale : Glassmorphism élégant */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#004269]/70 to-[#001829]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-start justify-between shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden group">

          {/* Overlay animé au hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-[#B8CE20]/10 to-transparent"
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.95
            }}
            transition={{ duration: 0.4 }}
          />

          {/* Effet de lumière qui suit la souris */}
          <motion.div
            className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(600px circle at ${rotateY * 20 + 50}% ${-rotateX * 20 + 50}%, rgba(184, 206, 32, 0.15), transparent 40%)`,
            }}
          />

          {/* Icône avec effet de flottement */}
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

          {/* Contenu */}
          <div className="flex-grow relative z-10">
            <h3 className="text-3xl font-black mb-4 text-white tracking-tighter uppercase leading-none">{item.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6 font-medium">
              {item.description}
            </p>
          </div>

          {/* Tags de compétences */}
          <div className="flex flex-wrap gap-2 relative z-10">
            {item.skills.slice(0, 4).map((skill, idx) => (
              <motion.span
                key={skill}
                className="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[9px] text-white/70 font-black uppercase tracking-widest"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: idx * 0.1 }
                }}
              >
                {skill}
              </motion.span>
            ))}
          </div>

          {/* CTA avec animation */}
          <motion.div
            className="mt-8 text-[10px] text-[#B8CE20] font-black uppercase tracking-[0.4em] flex items-center gap-4 relative z-10"
            animate={{
              gap: isHovered ? "1.5rem" : "1rem"
            }}
            transition={{ duration: 0.3 }}
          >
            Voir Projets
            <motion.span
              className="text-2xl leading-none"
              animate={{
                x: isHovered ? 5 : 0
              }}
              transition={{ duration: 0.3 }}
            >
              →
            </motion.span>
          </motion.div>

          {/* Badge de couleur en coin */}
          <div
            className="absolute top-4 right-4 w-12 h-12 rounded-full blur-xl opacity-50"
            style={{ backgroundColor: item.color }}
          />
        </div>
      </div>

      <style>{`
        .perspective-2000 { perspective: 2000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </motion.div>
  );
};

export default SkillCard;
