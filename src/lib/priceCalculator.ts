import { findFormulaTierPrice } from "./photographerFormulas";

export const NIGHT_SURCHARGE = 20;

/**
 * Fonction utilitaire pour calculer le nombre d'heures de nuit (23h - 9h)
 * dans un créneau donné.
 */
export function calculateNightHours(startTimeStr: string, duration: number): number {
  const [hours, minutes] = startTimeStr.split(':').map(Number);
  // On convertit l'heure en décimal (ex: 14:30 -> 14.5) pour la précision
  const startHour = hours + (minutes / 60);
  let nightHours = 0;

  for (let i = 0; i < duration; i++) {
    // On vérifie l'heure courante (modulo 24 pour gérer minuit)
    const currentHour = (startHour + i) % 24;

    // La nuit chez Talaref, c'est de 23h (inclus) à 9h (exclu)
    if (currentHour >= 23 || currentHour < 9) {
      nightHours++;
    }
  }

  return nightHours;
}

/**
 * Cerveau de la tarification dynamique de TALAREF
 */
export function calculateBookingPrice(
  serviceTitle: string,
  duration: number,
  slot: string,
  isEnterprise: boolean = false
): number {
  const hasNightHours = calculateNightHours(slot, duration) > 0;

  // Formules avec photographe (CV LinkedIn, Polas, Book, Anniversaire, Corporate...) :
  // Grille de prix fixe par formule + durée, avec un forfait nuit unique de 20€.
  const formulaPrice = findFormulaTierPrice(serviceTitle, duration);
  if (formulaPrice !== null) {
    return hasNightHours ? formulaPrice + NIGHT_SURCHARGE : formulaPrice;
  }

  let basePrice = 0;

  switch (serviceTitle) {
    case "Test Paiement Talaref":
      // Service caché servant uniquement à tester le tunnel de paiement/emails.
      return 0.5;

    case "Location Du Studio": {
      // Grille tarifaire fixe (tarif Jour)
      const dayRates: Record<number, number> = {
        1: 40, 2: 80, 3: 100, 4: 130, 5: 160, 6: 190, 8: 250, 10: 310, 12: 340, 14: 380,
      };
      basePrice = dayRates[duration] ?? duration * 40;

      if (hasNightHours) basePrice += NIGHT_SURCHARGE;
      break;
    }

    case "Podcasts": {
      // Forfait fixe : on check si c'est format long (> 2h) et si ça démarre de nuit
      const isLongFormat = duration > 2;

      basePrice = isLongFormat ? 790 : 490;
      if (hasNightHours) basePrice += NIGHT_SURCHARGE;
      break;
    }

    case "Formations Créatives": {
      // Forfait fixe : Demi-journée (<= 4h) ou Journée (> 4h)
      const isFullDay = duration > 4;

      if (isEnterprise) {
        basePrice = isFullDay ? 800 : 400; // Tarifs Entreprise
      } else {
        basePrice = isFullDay ? 500 : 250; // Tarifs Particulier
      }
      break;
    }

    default:
      // Sécurité anti-crash au cas où le nom du service n'est pas reconnu
      basePrice = duration * 75;
  }

  return basePrice;
}