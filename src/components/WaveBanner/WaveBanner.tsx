'use client';

import { useEffect, useRef } from 'react';
import { WaveScene } from '@/utils/threeScene';

export function WaveBanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<WaveScene | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    sceneRef.current = new WaveScene(canvasRef.current);

    return () => {
      if (sceneRef.current) {
        sceneRef.current.dispose();
      }
    };
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-45"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-[1]" />

      <div className="absolute inset-0 z-[2]">
        <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-purple-600/8 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[650px] h-[650px] bg-blue-500/7 rounded-full blur-[170px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-500/6 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
        <div className="max-w-7xl">
          <div className="mb-6 inline-block">
            <span className="px-4 py-1.5 bg-[#B8CF20]/10 border border-[#B8CF20]/20 rounded-full text-[#B8CF20] text-[10px] font-bold tracking-[0.3em] uppercase backdrop-blur-sm">
              Showcase Expertise
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-8">
            <span className="block text-white drop-shadow-2xl">
              Des compétences
            </span>
            <span className="block text-[#B8CF20] drop-shadow-[0_0_60px_rgba(184,207,32,0.6)]">
              multiples
            </span>
            <span className="block text-white drop-shadow-2xl">
              pour vos projets.
            </span>
          </h1>

          <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed font-light tracking-wide mb-12">
            Nous transformons vos visions complexes en expériences digitales
            <br />
            simples, puissantes et impactantes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group relative px-8 py-4 overflow-hidden rounded-lg transition-all duration-500 hover:scale-105 hover:shadow-[0_0_50px_rgba(184,207,32,0.4)]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#B8CF20] to-[#a3b81d]" />
              <span className="relative flex items-center gap-2 text-[#001829] font-bold text-sm tracking-wide">
                Découvrir nos services
                <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>

            <button className="group relative px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white font-semibold text-sm tracking-wide transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:border-white/20">
              Nos réalisations
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 opacity-30 hover:opacity-100 transition-opacity duration-300">
            <div className="w-[1px] h-8 bg-gradient-to-b from-transparent via-white to-transparent animate-pulse" />
            <span className="text-white text-[10px] font-light tracking-[0.2em] uppercase">Scroll</span>
          </div>
        </div>
      </div>
    </section>
  );
}
