"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const ContactForm: React.FC = () => {
    return (
        <section className="py-32 px-6 bg-background relative overflow-hidden" id="contact">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondaire/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-secondaire font-black tracking-[0.3em] uppercase text-xs"
                    >
                        Parlons de vous
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black mt-4 tracking-tighter"
                    >
                        Lançons votre <span className="text-secondaire">projet</span>.
                    </motion.h2>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="bg-principale/20 backdrop-blur-2xl border border-white/5 p-8 md:p-14 rounded-[3rem] shadow-2xl"
                >
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Nom Complet</label>
                            <input
                                type="text"
                                placeholder="Jean Dupont"
                                className="w-full bg-[#001829] border border-white/5 rounded-2xl px-6 py-5 outline-none focus:border-secondaire/50 focus:ring-4 focus:ring-secondaire/5 transition-all text-white placeholder:text-white/20"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Email Professionnel</label>
                            <input
                                type="email"
                                placeholder="jean@entreprise.com"
                                className="w-full bg-[#001829] border border-white/5 rounded-2xl px-6 py-5 outline-none focus:border-secondaire/50 focus:ring-4 focus:ring-secondaire/5 transition-all text-white placeholder:text-white/20"
                            />
                        </div>
                        <div className="md:col-span-2 space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Service Souhaité</label>
                            <select className="w-full bg-[#001829] border border-white/5 rounded-2xl px-6 py-5 outline-none focus:border-secondaire/50 focus:ring-4 focus:ring-secondaire/5 transition-all text-white appearance-none">
                                <option>Production Vidéo / Photo</option>
                                <option>Développement Web Performance</option>
                                <option>Identité Visuelle & Design</option>
                                <option>Accompagnement Stratégique</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">Votre Message</label>
                            <textarea
                                rows={5}
                                placeholder="Décrivez votre vision..."
                                className="w-full bg-[#001829] border border-white/5 rounded-2xl px-6 py-5 outline-none focus:border-secondaire/50 focus:ring-4 focus:ring-secondaire/5 transition-all text-white resize-none placeholder:text-white/20"
                            ></textarea>
                        </div>
                        <div className="md:col-span-2 pt-6">
                            <button className="w-full bg-secondaire hover:brightness-110 text-background font-black py-6 rounded-2xl shadow-xl shadow-secondaire/10 transition-all transform hover:scale-[1.01] active:scale-95 text-xl uppercase tracking-tighter">
                                Envoyer ma demande
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};
