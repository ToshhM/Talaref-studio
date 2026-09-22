"use client";

import { useState } from "react";
import { IconePlay, Media } from "./media";

/**
 * Façade vidéo.
 *
 * Une iframe YouTube (ou une vidéo mp4 en HD) pèse lourd au
 * chargement de la page. Ici, seule la vignette s'affiche ; le
 * lecteur n'est inséré qu'au clic. C'est la différence entre une
 * page qui s'ouvre vite et une qui traîne.
 *
 * Deux sources possibles :
 * - `youtubeId` → façade + iframe YouTube.
 * - `videoSrc` → façade + balise <video> native (mp4 hébergé dans /public),
 *   pour les clips qui ne sont pas passés par YouTube.
 */
export function FacadeVideo({
  youtubeId,
  videoSrc,
  poster,
  libelle,
  sous,
}: {
  youtubeId?: string;
  videoSrc?: string;
  poster?: string;
  libelle: string;
  sous: string;
}) {
  const [actif, setActif] = useState(false);
  // Les Shorts verticaux n'ont pas toujours de vignette maxresdefault ;
  // on retombe sur hqdefault (toujours généré par YouTube) si elle manque.
  const [vignetteHD, setVignetteHD] = useState(true);

  if (!youtubeId && !videoSrc) {
    return (
      <div>
        <Media ratio="916" alt="Vertical 9:16">
          <IconePlay />
        </Media>
        <p className="tl-video-carte__lib">{libelle}</p>
        <p className="tl-video-carte__sub">{sous}</p>
      </div>
    );
  }

  return (
    <div>
      {actif ? (
        <div className="tl-media tl-media--916" style={{ padding: 0 }}>
          {videoSrc ? (
            <video
              src={videoSrc}
              poster={poster}
              controls
              autoPlay
              playsInline
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
              title={libelle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            />
          )}
        </div>
      ) : (
        <button
          type="button"
          className="tl-video-carte"
          onClick={() => setActif(true)}
          aria-label={`Lire la vidéo : ${libelle}`}
          style={{
            background: "none",
            border: 0,
            padding: 0,
            margin: 0,
            font: "inherit",
            color: "inherit",
            textAlign: "left",
            cursor: "pointer",
            display: "block",
            width: "100%",
          }}
        >
          <Media
            ratio="916"
            src={poster ?? `https://i.ytimg.com/vi/${youtubeId}/${vignetteHD ? "maxresdefault" : "hqdefault"}.jpg`}
            alt={libelle}
            onError={() => setVignetteHD(false)}
          >
            <IconePlay />
          </Media>
        </button>
      )}
      <p className="tl-video-carte__lib">{libelle}</p>
      <p className="tl-video-carte__sub">{sous}</p>
    </div>
  );
}

