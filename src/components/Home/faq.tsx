const QUESTIONS = [
  {
    q: "Combien coûte un récap d'événement ?",
    r: "Cela dépend de la durée de l'événement, du nombre de caméras et du délai. Un devis ferme vous parvient sous 48 h après l'appel, et il ne bouge plus. Nous préférons chiffrer juste plutôt qu'afficher un pack qui ne correspondrait à personne.",
  },
  {
    q: "Sous quel délai reçoit-on les livrables ?",
    r: "Le délai est annoncé à la signature et figure au devis. Sur un aftermovie, les formats courts partent généralement en premier pour profiter de l'actualité de l'événement, le film complet suit.",
  },
  {
    q: "Vous déplacez-vous, ou faut-il venir au studio ?",
    r: "Les deux. Notre studio de 80 m² à Levallois-Perret est ouvert 24h/24, et nous produisons sur site partout en France et à l'international, avec l'ensemble du matériel.",
  },
  {
    q: "Qu'est-ce qui vous distingue d'un vidéaste indépendant ?",
    r: "Un indépendant livre des images. Nous mobilisons vingt-neuf personnes — photo, vidéo, montage, direction artistique — et nous restons après la livraison pour mesurer ce que la production a rapporté. Sur un projet simple, un indépendant suffit et nous vous le dirons.",
  },
  {
    q: "Que contient le plan d'actions ?",
    r: "Les retombées chiffrées de ce qui a été produit, puis nos recommandations pour le cycle suivant. C'est ce qui transforme une production ponctuelle en présence qui se construit.",
  },
];

export function Faq() {
  return (
    <section className="tl-bande tl-bande--fil">
      <div className="tl-rail">
        <div className="tl-tete">
          <p className="tl-sur-titre">Questions fréquentes</p>
          <h2>Ce qu&apos;on nous demande avant de signer</h2>
        </div>
        <div className="tl-faq">
          {QUESTIONS.map((item, i) => (
            <details key={item.q} open={i === 0}>
              <summary>{item.q}</summary>
              <p>{item.r}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

