const SECTEURS = [
  "Mode & beauté", "Sport", "Musique", "Corporate",
  "Restaurants", "Automobile", "Institutions", "Talents & influence",
];

export function Secteurs() {
  return (
    <section className="tl-bande">
      <div className="tl-rail">
        <div className="tl-tete">
          <p className="tl-sur-titre">Votre terrain</p>
          <h2>On connaît déjà votre secteur</h2>
        </div>
        <nav className="tl-secteurs">
          {SECTEURS.map((s) => (
            <a key={s} href="#rdv">{s}</a>
          ))}
        </nav>
      </div>
    </section>
  );
}

