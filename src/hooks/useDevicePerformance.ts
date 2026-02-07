"use client";

import { useState, useEffect } from 'react';

interface DevicePerformance {
    isMobile: boolean;
    isLowPerformance: boolean;
    prefersReducedMotion: boolean;
    shouldReduceAnimations: boolean;
}

/**
 * Hook pour détecter les appareils mobiles et ajuster les performances
 * Utilisé pour simplifier les animations sur les appareils à faible puissance
 */
export function useDevicePerformance(): DevicePerformance {
    const [performance, setPerformance] = useState<DevicePerformance>({
        isMobile: false,
        isLowPerformance: false,
        prefersReducedMotion: false,
        shouldReduceAnimations: false,
    });

    useEffect(() => {
        // Détection mobile via User Agent et taille d'écran
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        ) || window.innerWidth < 768;

        // Détection des préférences utilisateur pour les animations réduites
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        // Détection approximative de la performance via le nombre de cores CPU
        const hardwareConcurrency = navigator.hardwareConcurrency || 4;
        const isLowPerformance = hardwareConcurrency <= 4 || isMobile;

        // Détection mémoire si disponible (Chrome uniquement)
        const deviceMemory = (navigator as any).deviceMemory;
        const hasLowMemory = deviceMemory !== undefined && deviceMemory < 4;

        const shouldReduceAnimations =
            isMobile ||
            isLowPerformance ||
            prefersReducedMotion ||
            hasLowMemory;

        setPerformance({
            isMobile,
            isLowPerformance: isLowPerformance || hasLowMemory,
            prefersReducedMotion,
            shouldReduceAnimations,
        });

        // Écouter les changements de taille d'écran
        const handleResize = () => {
            const nowMobile = window.innerWidth < 768;
            setPerformance(prev => ({
                ...prev,
                isMobile: nowMobile,
                shouldReduceAnimations: nowMobile || prev.isLowPerformance || prev.prefersReducedMotion,
            }));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return performance;
}

/**
 * Version statique pour utilisation hors React (Three.js)
 */
export function getDevicePerformance(): { isMobile: boolean; shouldReduceAnimations: boolean } {
    if (typeof window === 'undefined') {
        return { isMobile: false, shouldReduceAnimations: false };
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    ) || window.innerWidth < 768;

    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    const isLowPerformance = hardwareConcurrency <= 4;

    return {
        isMobile,
        shouldReduceAnimations: isMobile || isLowPerformance || prefersReducedMotion,
    };
}
