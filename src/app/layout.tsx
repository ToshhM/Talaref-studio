import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TALAREF STUDIO | La forge de vos idées",
  description: "Ingénieur digital & Créateur de contenu - Photo, Vidéo, Sites Web, Design et Gestion de Projet. Basé à Paris.",
  keywords: ["TALAREF", "Toshiro MPIKA", "Photo", "Vidéo", "Site Web", "Design", "Paris", "Freelance", "Drone"],
  authors: [{ name: "Toshiro MPIKA" }],
  openGraph: {
    title: "TALAREF STUDIO | La forge de vos idées",
    description: "Ingénieur digital & Créateur de contenu - Photo, Vidéo, Sites Web, Design et Gestion de Projet.",
    url: "https://toshh.fr",
    siteName: "TALAREF STUDIO",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TALAREF STUDIO",
    description: "La forge de vos idées, le feu de votre succès.",
    creator: "@Toshh_M",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}
