/**
 * Fonction utilitaire pour calculer le nombre d'heures de nuit (22h - 9h)
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

    // La nuit chez Talaref, c'est de 22h (inclus) à 9h (exclu)
    if (currentHour >= 22 || currentHour < 9) {
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
  const nightHours = calculateNightHours(slot, duration);

  // Pour les forfaits fixes (Podcast), on regarde juste si ça COMMENCE de nuit
  const startHour = Number(slot.split(':')[0]);
  const isNightStart = startHour >= 22 || startHour < 9;

  let basePrice = 0;

  switch (serviceTitle) {
    case "Location Du Studio": {
      // Paliers dégressifs : 1h=75€, 2h=70€/h, 4h=60€/h, 10h=52€/h
      let hourlyRate = 75;
      if (duration >= 10) hourlyRate = 52;
      else if (duration >= 4) hourlyRate = 60;
      else if (duration >= 2) hourlyRate = 70;

      basePrice = duration * hourlyRate;

      // Majoration nuit : +100€ par heure passée entre 22h et 9h
      basePrice += (nightHours * 100);
      break;
    }

    case "Prestation Avec Photographe":
    case "Shooting Corporate": { // Je l'ai groupé avec la prestation photo
      // Paliers dégressifs : 1h=200€, 2h=190€/h, 4h=170€/h, 10h=130€/h
      let hourlyRate = 200;
      if (duration >= 10) hourlyRate = 130;
      else if (duration >= 4) hourlyRate = 170;
      else if (duration >= 2) hourlyRate = 190;

      basePrice = duration * hourlyRate;

      // Majoration nuit : +100€ par heure passée entre 22h et 9h
      basePrice += (nightHours * 100);
      break;
    }

    case "Podcasts": {
      // Forfait fixe : on check si c'est format long (> 2h) et si ça démarre de nuit
      const isLongFormat = duration > 2;

      if (isNightStart) {
        basePrice = isLongFormat ? 1090 : 600;
      } else {
        basePrice = isLongFormat ? 790 : 490;
      }
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