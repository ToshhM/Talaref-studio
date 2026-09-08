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

export const BOOKING_DURATIONS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 14];
export const PODCAST_DURATIONS = [1, 2, 3, 4];
export const FORMATION_DURATIONS = [4, 8];

export const services: Service[] = [
  {
    id: "location-studio",
    title: "Location Du Studio",
    eyebrow: "Espace brut",
    durationText: "Tarification",
    baseDuration: 1,
    price: "Dès 40€",
    description:
      "Location horaire, demi-journée, journée, événements, workshop. Ouvert 24/7.",
    includes: ["Accès plateau", "Lumières de base", "Espace loge", "Wifi Haut Débit"],
  },
  {
    id: "prestation-photographe",
    title: "Prestation Avec Photographe",
    eyebrow: "Formules clé en main",
    durationText: "Selon formule",
    baseDuration: 0.5,
    price: "Dès 40€",
    description:
      "CV LinkedIn, Polas, Book, Anniversaire, Couple, Grossesse, Corporate... Choisissez votre formule, le prix s'ajuste automatiquement.",
    includes: ["Photographe pro", "Photos retouchées", "Formule adaptée à votre besoin", "Livraison rapide"],
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

// Service caché, jamais rendu dans ServiceSelector : accessible uniquement via le lien
// de test direct (voir ReservationPage). Sert à vérifier le tunnel de paiement/emails
// avec un montant réel minime.
export const HIDDEN_TEST_SERVICE: Service = {
  id: "test-paiement-talaref",
  title: "Test Paiement Talaref",
  eyebrow: "Test interne",
  durationText: "Tarif fixe",
  baseDuration: 1,
  price: "0,50€",
  description: "Service de test interne pour vérifier le tunnel de paiement. Ne pas réserver.",
  includes: [],
};

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
