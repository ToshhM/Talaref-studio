import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
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
      <head>
        <meta name="p:domain_verify" content="e54310e50c66cc71d795e63f9df4ba4e" />
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KZVCQJG3');
          `}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KZVCQJG3"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
        <Analytics />
        {/* Google Tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-CR32KVXPS9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CR32KVXPS9');
          `}
        </Script>
      </body>
    </html>
  );
}
