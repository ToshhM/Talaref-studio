import Link from "next/link";

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
            <h4>Contact</h4>
            <ul>
              <li><a href="tel:+33635217526">06 35 21 75 26</a></li>
              <li><a href="mailto:contact@talaref.co">contact@talaref.co</a></li>
              <li>5 rue Bellanger<br />92300 Levallois-Perret</li>
              <li>
                <a href="https://instagram.com/talaref.agency" target="_blank" rel="noreferrer">
                  @talaref.agency
                </a>
              </li>
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

