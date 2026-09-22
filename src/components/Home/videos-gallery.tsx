"use client";

import { useMemo, useState } from "react";
import { VIDEOS } from "@/data/home-projects";
import { FacadeVideo } from "./facade-video";

/**
 * Galerie vidéo filtrable par catégorie (Mode, Sport, Musique, Interview…).
 * Reprend le style des onglets de la section Réalisations, pour rester
 * cohérent visuellement.
 */
export function VideosGallery() {
  const videos = useMemo(() => VIDEOS.filter((v) => v.youtubeId || v.videoSrc), []);
  const categories = useMemo(
    () => Array.from(new Set(videos.map((v) => v.categorie).filter(Boolean))) as string[],
    [videos]
  );
  const [filtre, setFiltre] = useState<string | null>(null);

  const affichees = filtre ? videos.filter((v) => v.categorie === filtre) : videos;

  return (
    <>
      <div className="tl-onglets" role="tablist" aria-label="Filtrer les vidéos par catégorie">
        <button
          type="button"
          role="tab"
          aria-selected={filtre === null}
          className="tl-onglet"
          onClick={() => setFiltre(null)}
        >
          Tout
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={filtre === cat}
            className="tl-onglet"
            onClick={() => setFiltre(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {affichees.length > 0 ? (
        <div className="tl-videos">
          {affichees.map((v) => (
            <FacadeVideo
              key={v.libelle}
              youtubeId={v.youtubeId}
              videoSrc={v.videoSrc}
              poster={v.poster}
              libelle={v.libelle}
              sous={v.sous}
            />
          ))}
        </div>
      ) : (
        <p className="tl-lead">Aucune vidéo dans cette catégorie pour l&apos;instant.</p>
      )}
    </>
  );
}
