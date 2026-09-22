/** Pas de prix affichés : chaque projet est chiffré sur mesure. */
export function SurMesure() {
  return (
    <section className="tl-bande tl-bande--fil">
      <div className="tl-rail">
        <div className="tl-tete">
          <p className="tl-sur-titre">Tarifs</p>
          <h2>Chaque projet est chiffré sur mesure</h2>
          <p className="tl-lead">
            Un récap de soirée et une campagne de marque n&apos;ont ni la même équipe
            ni le même matériel. Plutôt qu&apos;un pack qui ne correspondrait à
            personne, on part de votre projet — et le devis arrive sous 48 h après
            l&apos;appel.
          </p>
        </div>

        <div className="tl-mesure">
          <div>
            <h3>Ce qui fait varier le prix</h3>
            <p>Nombre de jours de tournage, taille de l&apos;équipe, lieu, volume de livrables, délai souhaité.</p>
          </div>
          <div>
            <h3>Ce qui est toujours inclus</h3>
            <p>Direction artistique, matériel, montage, retouche, livraison classée et recommandations de diffusion.</p>
          </div>
          <div>
            <h3>Ce que vous recevez sous 48 h</h3>
            <p>Un périmètre écrit, un budget ferme et un calendrier. Rien n&apos;est engagé tant que vous ne signez pas.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

