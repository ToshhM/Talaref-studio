import Link from "next/link";

function IconInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconTikTok() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.43 0-2.59-1.16-2.59-2.59a2.59 2.59 0 0 1 2.59-2.59c.28 0 .55.04.8.13V9.73a5.62 5.62 0 0 0-.8-.06C6.73 9.67 4 12.4 4 15.72A6.14 6.14 0 0 0 9.86 21a5.86 5.86 0 0 0 5.86-5.86V9.01a7.33 7.33 0 0 0 4.28 1.38V7.3a4.28 4.28 0 0 1-3.4-1.48Z" />
    </svg>
  );
}

function IconMedia() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m22 8-6 4 6 4V8Z" /><rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="tl-pied">
      <div className="tl-rail">
        <div className="tl-pied__g">
          <div>
            <p className="tl-pied__slogan">
              La forge de vos idées.
              <br />
              Le feu de votre succès.
            </p>
            <div className="tl-pied__socials">
              <a href="https://instagram.com/talaref.agency" target="_blank" rel="noreferrer" aria-label="Instagram"><IconInstagram /></a>
              <a href="https://www.tiktok.com/@talarefff" target="_blank" rel="noreferrer" aria-label="TikTok"><IconTikTok /></a>
              <a href="https://www.talaref.media" target="_blank" rel="noreferrer" aria-label="TALAREF Média"><IconMedia /></a>
            </div>
          </div>

          <div>
            <h4>Photo &amp; vidéo</h4>
            <ul>
              <li><a href="#formats">Récap d&apos;événement</a></li>
              <li><a href="#formats">Interview</a></li>
              <li><a href="#formats">Campagne &amp; shooting</a></li>
              <li><Link href="/reservation">Réserver une séance</Link></li>
            </ul>
          </div>

          <div>
            <h4>Agence</h4>
            <ul>
              <li><a href="#cas">Réalisations</a></li>
              <li><a href="#methode">Méthode</a></li>
              <li><Link href="/portfolio?category=Web">Sites web</Link></li>
              <li><a href="#rdv">Demander un appel</a></li>
            </ul>
          </div>

          <div>
            <h4>Nos pages Instagram</h4>
            <ul>
              <li><a href="https://instagram.com/talaref.media" target="_blank" rel="noreferrer"><strong>Média</strong> <span className="tl-pied__handle">@talaref.media</span></a></li>
              <li><a href="https://instagram.com/talaref.agency" target="_blank" rel="noreferrer"><strong>Agence</strong> <span className="tl-pied__handle">@talaref.agency</span></a></li>
              <li><a href="https://instagram.com/talarefstudio" target="_blank" rel="noreferrer"><strong>Photo</strong> <span className="tl-pied__handle">@talarefstudio</span></a></li>
            </ul>
          </div>

          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href="tel:+33635217526">06 35 21 75 26</a></li>
              <li><a href="mailto:contact@talaref.co">contact@talaref.co</a></li>
              <li>5 rue Bellanger<br />92300 Levallois-Perret</li>
            </ul>
          </div>
        </div>

        <p className="tl-pied__bas">
          TALAREF — SASU · Studio ouvert 24h/24 · Production partout en France et à
          l&apos;international
        </p>
      </div>
    </footer>
  );
}

