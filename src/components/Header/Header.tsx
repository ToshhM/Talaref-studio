'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
    { label: 'Notre Agence', href: '/#hero' },
    { label: 'Expertise', href: '/#expertise' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Contact', href: '/#contact' },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-[100] px-8 py-6 flex justify-between items-center transition-all duration-300 ${isScrolled ? 'backdrop-blur-xl bg-background/80 border-b border-white/5 py-4' : 'backdrop-blur-xl bg-background/50 border-b border-white/5'}`}>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondaire rounded-xl flex items-center justify-center font-black text-background text-lg shadow-lg shadow-secondaire/20">T</div>
                <span className="font-black tracking-tighter text-2xl uppercase text-white">Talaref.</span>
            </div>

            <nav className="hidden md:flex items-center gap-10">
                {navItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        className="text-xs font-black uppercase tracking-widest text-white/50 hover:text-secondaire transition-colors"
                    >
                        {item.label}
                    </a>
                ))}
            </nav>

            <div className="hidden md:block">
                <a href="/#contact" className="bg-white/10 hover:bg-secondaire hover:text-background text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all transform hover:scale-105 active:scale-95 border border-white/10 hover:border-secondaire">
                    Start Project
                </a>
            </div>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
            >
                <div className={`w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <div className={`w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                <div className={`w-6 h-0.5 bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        className="absolute top-full left-0 right-0 bg-background border-b border-white/10 p-6 md:hidden flex flex-col gap-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="text-sm font-bold uppercase text-white/70 hover:text-secondaire"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.label}
                            </a>
                        ))}
                        <a href="/#contact" className="bg-secondaire text-background px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest mt-4 block text-center" onClick={() => setIsMobileMenuOpen(false)}>
                            Start Project
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
