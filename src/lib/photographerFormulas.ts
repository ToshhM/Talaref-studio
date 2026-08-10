export type FormulaTier = {
  duration: number;
  price: number;
  photos: number;
};

export type PhotographerFormula = {
  id: string;
  title: string;
  subtitle: string;
  tiers: FormulaTier[];
};

export const photographerFormulas: PhotographerFormula[] = [
  {
    id: "cv-linkedin",
    title: "CV LinkedIn",
    subtitle: "Séance 30 minutes",
    tiers: [{ duration: 0.5, price: 40, photos: 10 }],
  },
  {
    id: "polas",
    title: "Polas",
    subtitle: "30 min · 1h · 1h30",
    tiers: [
      { duration: 0.5, price: 80, photos: 15 },
      { duration: 1, price: 120, photos: 25 },
      { duration: 1.5, price: 180, photos: 45 },
    ],
  },
  {
    id: "book",
    title: "Book",
    subtitle: "30 min · 1h · 1h30",
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
    tiers: [
      { duration: 1, price: 165, photos: 25 },
      { duration: 2, price: 250, photos: 35 },
      { duration: 3, price: 370, photos: 55 },
    ],
  },
  {
    id: "corporate",
    title: "Corporate",
    subtitle: "1h · 2h · 3h",
    tiers: [
      { duration: 1, price: 220, photos: 20 },
      { duration: 2, price: 330, photos: 30 },
      { duration: 3, price: 495, photos: 50 },
    ],
  },
  {
    id: "marques",
    title: "Marques",
    subtitle: "Sur devis",
    tiers: [],
  },
  {
    id: "media-day",
    title: "Média day équipe sportive",
    subtitle: "Sur devis",
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
