import type { Metadata } from "next";
import "@/styles/home.css";

import { SiteHeader } from "@/components/Home/site-header";
import { Hero } from "@/components/Home/hero";
import { LogoMarquee } from "@/components/Home/logo-marquee";
import { Formats } from "@/components/Home/formats";
import { Realisations } from "@/components/Home/realisations";
import { Videos } from "@/components/Home/videos";
import { Methode } from "@/components/Home/methode";
import { AppelMilieu } from "@/components/Home/appel-milieu";
import { Secteurs } from "@/components/Home/secteurs";
import { SurMesure } from "@/components/Home/sur-mesure";
import { RenvoiWeb } from "@/components/Home/renvoi-web";
import { Faq } from "@/components/Home/faq";
import { AppelFinal } from "@/components/Home/appel-final";
import { SiteFooter } from "@/components/Home/site-footer";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: "TALAREF — Agence photo & vidéo à Levallois-Perret",
  description:
    "Récaps d'événement, interviews et campagnes. Vingt-neuf personnes, un studio ouvert 24h/24, une équipe accréditée PSG et Fashion Week — et les chiffres après la livraison.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "TALAREF",
    url: "https://www.talaref.co",
    images: [{ url: "/images/home/monela-campagne.jpg", width: 1280, height: 853, alt: "Campagne Monela Hair par TALAREF" }],
    title: "TALAREF — Agence photo & vidéo",
    description:
      "Votre événement mérite mieux qu'un résumé flou. On tourne, on monte, on livre — puis on mesure.",
  },
};

export default function PageAccueil() {
  return (
    <div className="tl-page">
      <SiteHeader />

      <main id="contenu">
        <Hero />
        <LogoMarquee />
        <Formats />
        <Realisations />
        <Videos />
        <Methode />
        <AppelMilieu />
        <Secteurs />
        <SurMesure />
        <RenvoiWeb />
        <Faq />
        <AppelFinal />
      </main>

      <SiteFooter />
    </div>
  );
}
