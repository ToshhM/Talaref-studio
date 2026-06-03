export type Service = {
  id: string;
  title: string;
  eyebrow: string;
  durationText: string;
  baseDuration: number;
  price: string;
  description: string;
  includes: string[];
};

export const BOOKING_DURATIONS = [1, 2, 3, 4, 5, 6, 8, 10];
export const PODCAST_DURATIONS = [1, 2, 3, 4];
export const FORMATION_DURATIONS = [4, 8];

export const services: Service[] = [
  {
    id: "shooting-corporate",
    title: "Shooting Corporate",
    eyebrow: "Pro / Entreprise",
    durationText: "Tarification",
    baseDuration: 1,
    price: "Dès 200€",
    description:
      "Séance de shooting corporate professionnel. 15 photos retouchées incluant retouches couleurs et édition premium.",
    includes: [
      "Direction de pose",
      "15 photos retouchées",
      "Édition premium",
      "Livraison rapide",
    ],
  },
  {
    id: "location-studio",
    title: "Location Du Studio",
    eyebrow: "Espace brut",
    durationText: "Tarification",
    baseDuration: 1,
    price: "Dès 75€",
    description:
      "Location horaire, demi-journée, journée, événements, workshop. Ouvert 24/7.",
    includes: ["Accès plateau", "Lumières de base", "Espace loge", "Wifi Haut Débit"],
  },
  {
    id: "prestation-photographe",
    title: "Prestation Avec Photographe",
    eyebrow: "Sur mesure",
    durationText: "Tarification",
    baseDuration: 1,
    price: "Dès 200€",
    description:
      "Shooting photo, tournage vidéo, événement, corporate, social media.",
    includes: ["Photographe pro", "Matériel inclus", "Direction artistique", "Galerie privée"],
  },
  {
    id: "podcasts",
    title: "Podcasts",
    eyebrow: "Clé en main",
    durationText: "Au forfait",
    baseDuration: 1,
    price: "Forfait dès 490€",
    description:
      "Enregistrement 4K, setup complet, opérateur, montage et nettoyage audio inclus.",
    includes: ["Studio + Opérateur", "Enregistrement 4K", "Montage inclus", "Nettoyage Audio"],
  },
  {
    id: "formations",
    title: "Formations Créatives",
    eyebrow: "Apprentissage",
    durationText: "Forfaits fixes",
    baseDuration: 4,
    price: "Dès 250€",
    description:
      "Photo, vidéo, IA pour entrepreneurs, création de contenu, business créatif.",
    includes: ["Support de cours", "Pratique en studio", "Suivi personnalisé", "Réseautage"],
  },
];

export const publicEmailDomains = [
  "gmail.com",
  "yahoo.com",
  "yahoo.fr",
  "outlook.com",
  "outlook.fr",
  "hotmail.com",
  "hotmail.fr",
  "orange.fr",
  "free.fr",
  "sfr.fr",
  "bbox.fr",
  "icloud.com",
  "me.com",
  "mac.com",
  "live.com",
  "live.fr",
  "protonmail.com",
  "proton.me",
  "wanadoo.fr",
];

export const weekDays = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

export const monthNames = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export const currentYear = new Date().getFullYear();
export const yearsList = Array.from({ length: 12 }, (_, i) => currentYear + i);
