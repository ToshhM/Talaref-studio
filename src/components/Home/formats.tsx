

/**
 * Les trois formats pour lesquels on appelle Talaref le plus souvent.
 * Placés haut : le visiteur doit se reconnaître avant de lire une
 * liste de métiers.
 */
const FORMATS = [
  {
    pastille: "Le plus demandé",
    titre: "Récap d'événement",
    texte:
      "Lancement, soirée privée, convention, défilé. Une équipe sur place du début à la fin, et un film qui restitue la soirée telle qu'elle s'est passée — pas une suite de plans jolis sans récit.",
    detail: "Aftermovie · formats courts pour les réseaux · photos livrées en parallèle",
    alt: "Extrait d'un récap",
  },
  {
    pastille: "Prise de parole",
    titre: "Interview",
    texte:
      "Dirigeant, artiste, athlète, invité de panel. Deux caméras, son propre, et un montage qui garde le fond sans laisser traîner les silences. Au studio ou chez vous.",
    detail: "Multicam · sous-titres · déclinaison verticale incluse",
    alt: "Extrait d'interview",
  },
  {
    pastille: "Image de marque",
    titre: "Campagne & shooting",
    texte:
      "Produit, lookbook, portraits collaborateurs, culinaire. Direction artistique, lumière, retouche — et une banque d'images réutilisable toute l'année plutôt qu'un one-shot.",
    detail: "Studio 80 m² · déplacement multi-sites · livraison classée",
    alt: "Visuel de campagne",
  },
];

export function Formats() {
  return (
    <section className="tl-bande" id="formats">
      <div className="tl-rail" id="expertise">
        <div className="tl-tete">
          <p className="tl-sur-titre">Ce pour quoi on nous appelle</p>
          <h2>Des contenus pensés pour vos objectifs</h2>
          <p className="tl-lead">
            Le reste, on le fait aussi. Mais c&apos;est par là que la plupart des
            projets commencent.
          </p>
        </div>

        <div className="tl-formats">
          {FORMATS.map((f) => (
            <article className="tl-format" key={f.titre}>
              
              <div className="tl-format__txt">
                <span className="tl-format__pastille">{f.pastille}</span>
                <h3>{f.titre}</h3>
                <p>{f.texte}</p>
                <p className="tl-mini">{f.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
