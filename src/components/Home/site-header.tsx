'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="tl-entete" onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); }}>
      <div className="tl-rail tl-entete__in">
        <Link className="tl-marque" href="/" aria-label="TALAREF, accueil"><span className="tl-marque__t">T</span><span className="tl-marque__n">TALAREF<i>.</i></span></Link>
        <nav id="home-navigation" className={`tl-nav ${open ? 'tl-nav--ouverte' : ''}`} aria-label="Navigation principale" onClick={() => setOpen(false)}>
          <a href="#formats">Nos formats</a>
          <a href="#cas">Réalisations</a>
          <Link href="/videos">Vidéos</Link>
          <a href="#methode">Méthode</a>
          <Link href="/portfolio?category=Web">Sites web</Link>
          <Link href="/reservation">Réserver une séance</Link>
        </nav>
        <a className="tl-btn tl-btn--lime tl-btn--sm" href="#rdv" onClick={() => setOpen(false)}>Parlons de votre projet</a>
        <button className="tl-menu" type="button" aria-controls="home-navigation" aria-expanded={open} aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} title={open ? 'Fermer le menu' : 'Ouvrir le menu'} onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
    </header>
  );
}
