export type FormulaTier = {
  label?: string;
  duration: number;
  price: number;
  photos: number;
  details?: string[];
};

export type PhotographerFormula = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tiers: FormulaTier[];
};

export const photographerFormulas: PhotographerFormula[] = [
  {
    id: "cv-linkedin",
    title: "CV LinkedIn",
    subtitle: "Séance 30 minutes",
    description: "Un portrait professionnel soigné pour votre CV, LinkedIn et vos profils professionnels.",
    tiers: [{ duration: 0.5, price: 40, photos: 10 }],
  },
  {
    id: "polas",
    title: "Polas",
    subtitle: "30 min · 1h · 1h30",
    description: "Des photos naturelles de mannequin pour présenter votre profil aux agences et aux marques. La formule Médium ajoute les mensurations, deux tenues et une mise en page ; la Maxi comprend aussi trois tenues et la mise en page de votre site portfolio.",
    tiers: [
      { label: "Standard", duration: 0.5, price: 50, photos: 15, details: ["Shooting de 30 min avec un photographe"] },
      { label: "Médium", duration: 1, price: 70, photos: 20, details: ["Prise de mensurations", "2 tenues", "Mise en page"] },
      { label: "Maxi", duration: 1.5, price: 135, photos: 25, details: ["Prise de mensurations", "3 tenues", "Mise en page du site portfolio"] },
    ],
  },
  {
    id: "book",
    title: "Book",
    subtitle: "30 min · 1h · 1h30",
    description: "Créez ou enrichissez votre book avec une séance photo guidée et une sélection de portraits retouchés.",
    tiers: [
      { duration: 0.5, price: 120, photos: 25 },
      { duration: 1, price: 180, photos: 35 },
      { duration: 1.5, price: 270, photos: 55 },
    ],
  },
  {
    id: "anniversaire",
    title: "Anniversaire",
    subtitle: "1h · 2h · 3h",
    description: "Immortalisez votre anniversaire en studio avec une séance photo adaptée à votre événement.",
    tiers: [
      { duration: 1, price: 140, photos: 25 },
      { duration: 2, price: 210, photos: 35 },
      { duration: 3, price: 315, photos: 55 },
    ],
  },
  {
    id: "baby-shower",
    title: "Baby shower",
    subtitle: "1h · 2h · 3h",
    description: "Gardez des souvenirs de votre baby shower avec une séance photo conviviale au studio.",
    tiers: [
      { duration: 1, price: 145, photos: 25 },
      { duration: 2, price: 220, photos: 35 },
      { duration: 3, price: 325, photos: 55 },
    ],
  },
  {
    id: "famille",
    title: "Famille",
    subtitle: "1h · 2h · 3h",
    description: "Réunissez votre famille devant l’objectif pour des portraits naturels et intemporels.",
    tiers: [
      { duration: 1, price: 150, photos: 25 },
      { duration: 2, price: 225, photos: 35 },
      { duration: 3, price: 340, photos: 55 },
    ],
  },
  {
    id: "couple",
    title: "Couple",
    subtitle: "1h · 2h · 3h",
    description: "Une séance photo à deux, pensée pour capturer votre complicité dans une ambiance détendue.",
    tiers: [
      { duration: 1, price: 160, photos: 25 },
      { duration: 2, price: 240, photos: 35 },
      { duration: 3, price: 360, photos: 55 },
    ],
  },
  {
    id: "grossesse",
    title: "Grossesse",
    subtitle: "1h · 2h · 3h",
    description: "Mettez en lumière votre grossesse avec des portraits réalisés à votre rythme.",
    tiers: [
      { duration: 1, price: 160, photos: 25 },
      { duration: 2, price: 240, photos: 35 },
      { duration: 3, price: 360, photos: 55 },
    ],
  },
  {
    id: "portrait",
    title: "Portrait / Shooting personnalisé",
    subtitle: "1h · 2h · 3h",
    description: "Un shooting construit autour de votre idée, de votre style et de l’usage souhaité pour les images, avec des portraits individuels ou corporate pour vos équipes et votre communication.",
    tiers: [
      { duration: 1, price: 165, photos: 25 },
      { duration: 2, price: 250, photos: 35 },
      { duration: 3, price: 370, photos: 55 },
    ],
  },
  {
    id: "marques",
    title: "Marques",
    subtitle: "Sur devis",
    description: "Présentez votre marque et votre besoin dans le formulaire pour recevoir une proposition adaptée.",
    tiers: [],
  },
  {
    id: "media-day",
    title: "Média day équipe sportive",
    subtitle: "Sur devis",
    description: "Une journée de portraits et de contenus d’équipe conçue selon vos effectifs et vos besoins médias.",
    tiers: [],
  },
];

export function findFormulaByTitle(title: string): PhotographerFormula | undefined {
  return photographerFormulas.find((formula) => formula.title === title);
}

export function findFormulaTierPrice(title: string, duration: number): number | null {
  const formula = findFormulaByTitle(title);
  if (!formula) return null;

  const tier = formula.tiers.find((t) => t.duration === duration);
  return tier ? tier.price : null;
}
