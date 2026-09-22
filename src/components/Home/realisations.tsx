"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PROJETS } from "@/data/home-projects";
import { IconePlay, Media } from "./media";

/**
 * Réalisations en onglets.
 *
 * Un clic — ou les flèches du clavier — change le projet affiché :
 * le texte, les chiffres et le carrousel de photos suivent ensemble.
 * Le carrousel se fait glisser au doigt, à la molette, ou avec les
 * deux boutons ronds.
 */
export function Realisations() {
  const [actif, setActif] = useState(PROJETS.findIndex((p) => p.id === "monela"));
  const [videoOuverte, setVideoOuverte] = useState<number | null>(null);
  const piste = useRef<HTMLDivElement>(null);
  const onglets = useRef<(HTMLButtonElement | null)[]>([]);

  const projet = PROJETS[actif];

  function changerOnglet(i: number) {
    setActif(i);
    setVideoOuverte(null);
  }

  function auClavier(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const pas = e.key === "ArrowRight" ? 1 : -1;
    const suivant = (actif + pas + PROJETS.length) % PROJETS.length;
    changerOnglet(suivant);
    onglets.current[suivant]?.focus();
  }

  function glisser(sens: 1 | -1) {
    const el = piste.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.55 * sens, behavior: "smooth" });
  }

  return (
    <section className="tl-bande tl-bande--fil" id="cas">
      <div className="tl-rail">
        <div className="tl-tete">
          <p className="tl-sur-titre">Réalisations</p>
          <h2>Ce qu&apos;on a fait, et ce que ça a donné</h2>
        </div>

        <div className="tl-onglets" role="tablist" aria-label="Projets" onKeyDown={auClavier}>
          {PROJETS.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              id={`onglet-${p.id}`}
              aria-selected={i === actif}
              aria-controls="panneau-cas"
              tabIndex={i === actif ? 0 : -1}
              ref={(el) => {
                onglets.current[i] = el;
              }}
              className="tl-onglet"
              onClick={() => changerOnglet(i)}
            >
              {p.onglet}
            </button>
          ))}
        </div>

        <div
          className={`tl-cas ${projet.photos.some((photo) => photo.src) ? "" : "tl-cas--texte"}`}
          id="panneau-cas"
          role="tabpanel"
          aria-labelledby={`onglet-${projet.id}`}
          tabIndex={0}
        >
          <div className="tl-cas__txt">
            <p className="tl-sur-titre">{projet.secteur}</p>
            <h3>{projet.titre}</h3>
            <p className="tl-lead">{projet.texte}</p>
            <div className="tl-cas__kpi">
              {projet.kpis.map((k) => (
                <div className="tl-kpi" key={k.valeur}>
                  <b>{k.valeur}</b>
                  <span>{k.libelle}</span>
                </div>
              ))}
            </div>
          </div>

          {projet.photos.some((photo) => photo.src) && <div>
            <div className="tl-carrousel">
              {/* key sur la piste : changer de projet remet le carrousel au début */}
              <div className={`tl-carrousel__piste ${projet.photos.filter((photo) => photo.src).length === 1 ? 'tl-carrousel__piste--unique' : ''}`} ref={piste} key={projet.id}>
                {projet.photos.filter((photo) => photo.src).map((photo, i) =>
                  photo.video ? (
                    videoOuverte === i ? (
                      <div key={i} className="tl-media tl-media--43" style={{ padding: 0 }}>
                        <video
                          src={photo.video}
                          poster={photo.src}
                          controls
                          autoPlay
                          playsInline
                          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    ) : (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setVideoOuverte(i)}
                        aria-label={`Lire la vidéo : ${photo.alt}`}
                        style={{ background: "none", border: 0, padding: 0, margin: 0, cursor: "pointer", display: "block" }}
                      >
                        <Media ratio="43" src={photo.src} alt={photo.alt}>
                          <IconePlay />
                        </Media>
                      </button>
                    )
                  ) : (
                    <Media key={i} ratio="43" src={photo.src} alt={photo.alt} />
                  )
                )}
              </div>

              {projet.photos.filter((photo) => photo.src).length > 1 && <div className="tl-carrousel__nav">
                <button
                  type="button"
                  className="tl-rond"
                  aria-label="Photo précédente"
                  title="Photo précédente"
                  onClick={() => glisser(-1)}
                >
                  <ArrowLeft size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="tl-rond"
                  aria-label="Photo suivante"
                  title="Photo suivante"
                  onClick={() => glisser(1)}
                >
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>}
            </div>
          </div>}
        </div>
      </div>
    </section>
  );
}
