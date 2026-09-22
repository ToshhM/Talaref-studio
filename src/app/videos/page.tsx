import type { Metadata } from "next";
import "@/styles/home.css";

import { SiteHeader } from "@/components/Home/site-header";
import { SiteFooter } from "@/components/Home/site-footer";
import { VideosGallery } from "@/components/Home/videos-gallery";

export const metadata: Metadata = {
  alternates: { canonical: "/videos" },
  title: "Nos vidéos | TALAREF STUDIO",
  description:
    "Récaps d'événement, interviews et concerts filmés par TALAREF : PSG Handball, Boléman, Impulstar, Flora Coquerel aux Africa Next Awards, et plus.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "TALAREF",
    url: "https://www.talaref.co/videos",
    title: "Nos vidéos | TALAREF",
    description: "Formats courts et immersifs — récaps, interviews, concerts.",
  },
};

export default function PageVideos() {
  return (
    <div className="tl-page">
      <SiteHeader />

      <main id="contenu">
        <section className="tl-bande">
          <div className="tl-rail">
            <div className="tl-tete">
              <p className="tl-sur-titre">Nos vidéos</p>
              <h2>Formats courts, montés pour être regardés jusqu&apos;au bout</h2>
            </div>

            <VideosGallery />

            <div style={{ marginTop: 26 }}>
              <a className="tl-btn tl-btn--lime" href="/#rdv">
                Parlons de votre vidéo
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
