import Link from "next/link";

/** Passerelle vers l'autre page : l'activité sites web. */
export function RenvoiWeb() {
  return (
    <section className="tl-bande">
      <div className="tl-rail">
        <div className="tl-renvoi">
          <div>
            <p className="tl-sur-titre">Autre métier</p>
            <h2 style={{ fontSize: "2rem", marginTop: 10 }}>
              Vous cherchez plutôt un site web ?
            </h2>
            <p className="tl-lead" style={{ marginTop: 12 }}>
              Vitrines, refontes, e-commerce et plateformes sur mesure — c&apos;est une
              expertise à découvrir dans notre portfolio.
            </p>
          </div>
          <Link className="tl-btn tl-btn--lime" href="/portfolio?category=Web">
            Voir nos projets web →
          </Link>
        </div>
      </div>
    </section>
  );
}

