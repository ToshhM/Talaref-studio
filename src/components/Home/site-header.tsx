'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import styles from './SiteHeader.module.css';

function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconTikTok() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.43 0-2.59-1.16-2.59-2.59a2.59 2.59 0 0 1 2.59-2.59c.28 0 .55.04.8.13V9.73a5.62 5.62 0 0 0-.8-.06C6.73 9.67 4 12.4 4 15.72A6.14 6.14 0 0 0 9.86 21a5.86 5.86 0 0 0 5.86-5.86V9.01a7.33 7.33 0 0 0 4.28 1.38V7.3a4.28 4.28 0 0 1-3.4-1.48Z" />
    </svg>
  );
}

function IconMedia() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m22 8-6 4 6 4V8Z" /><rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isClientsPage = pathname.startsWith('/portfolio');
  const homeHref = (section: string) => `/#${section}`;

  return (
    <header className={styles.header} onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); }}>
      <div className={styles.inner}>
        <Link className={styles.brand} href="/" aria-label="TALAREF, accueil"><span className={styles.brandMark}>T</span><span className={styles.brandName}>TALAREF<i>.</i></span></Link>
        <nav id="home-navigation" className={`${styles.nav} ${open ? styles.navOpen : ''}`} aria-label="Navigation principale" onClick={() => setOpen(false)}>
          <div className={styles.navLinks}>
            <Link href={homeHref('formats')}>Nos formats</Link>
            <Link href={homeHref('cas')}>Réalisations</Link>
            <Link href="/videos">Vidéos</Link>
            <Link href={homeHref('methode')}>Méthode</Link>
            <Link href="/portfolio" aria-current={isClientsPage ? 'page' : undefined}>Nos clients</Link>
            <Link href="/reservation">Réserver une séance</Link>
          </div>
          <div className={styles.menuActions}>
            <div className={styles.socials}>
              <a href="https://instagram.com/talaref.agency" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialIcon}><IconInstagram /></a>
              <a href="https://www.tiktok.com/@talarefff" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className={styles.socialIcon}><IconTikTok /></a>
              <a href="https://www.talaref.media" target="_blank" rel="noopener noreferrer" aria-label="TALAREF Média" className={`${styles.socialIcon} ${styles.socialMedia}`}><IconMedia /></a>
            </div>
            <Link className={styles.contactButton} href={homeHref('rdv')}>Parlons de votre projet</Link>
          </div>
        </nav>

        <button className={styles.menu} type="button" aria-controls="home-navigation" aria-expanded={open} aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} title={open ? 'Fermer le menu' : 'Ouvrir le menu'} onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
    </header>
  );
}
