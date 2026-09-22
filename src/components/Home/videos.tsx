import Link from "next/link";
import { VIDEOS } from "@/data/home-projects";
import { FacadeVideo } from "./facade-video";

export function Videos() {
  const videos = VIDEOS.filter((video) => (video.youtubeId || video.videoSrc) && video.accueil !== false);
  if (!videos.length) return null;
  return (
    <section className="tl-bande tl-bande--fil" id="videos">
      <div className="tl-rail">
        <div className="tl-tete">
          <p className="tl-sur-titre">Nos meilleurs contenus</p>
          <h2>Quelle que soit votre activité, il y a une histoire à raconter</h2>
        </div>

        <div className="tl-videos">
          {videos.map((v) => (
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

        <div style={{ marginTop: 26, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="tl-btn tl-btn--lime" href="/videos">
            Voir toutes les vidéos
          </Link>
          <a className="tl-btn tl-btn--fil" href="#rdv">
            Parlons de votre vidéo
          </a>
        </div>
      </div>
    </section>
  );
}

