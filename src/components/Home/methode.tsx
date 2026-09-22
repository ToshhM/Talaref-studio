const ETAPES = [
  {
    titre: "On identifie",
    texte:
      "Un appel pour comprendre l'activité, la cible et l'objectif. On repart avec un angle, pas avec un brief vague.",
  },
  {
    titre: "On produit",
    texte:
      "Tournage et shooting, au studio ou sur place, partout en France et à l'international, avec l'équipe et le matériel adaptés.",
  },
  {
    titre: "On diffuse",
    texte:
      "Montage, formats pensés pour chaque plateforme, et activation de notre réseau d'ambassadeurs quand le projet s'y prête.",
  },
  {
    titre: "On mesure",
    texte:
      "Vues, trafic, retombées. Vous recevez les chiffres et un plan d'actions pour la suite.",
  },
];

export function Methode() {
  return (
    <section className="tl-bande tl-bande--fil" id="methode">
      <div className="tl-rail">
        <div className="tl-tete">
          <p className="tl-sur-titre">Du premier appel à la livraison</p>
          <h2>Une idée entre. Un résultat mesuré sort.</h2>
        </div>
        <div className="tl-etapes">
          {ETAPES.map((e, i) => (
            <article className="tl-etape" key={e.titre}>
              <p className="tl-etape__n">ÉTAPE {i + 1}</p>
              <h3>{e.titre}</h3>
              <p>{e.texte}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

