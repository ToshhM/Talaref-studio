/**
 * Formate une durée en heures (ex: 0.5, 1.5) en libellé court : "30 min", "1h", "1h30".
 */
export function formatDurationHours(duration: number): string {
  if (duration < 1) {
    return `${Math.round(duration * 60)} min`;
  }

  const wholeHours = Math.floor(duration);
  const minutes = Math.round((duration - wholeHours) * 60);

  return minutes === 0 ? `${wholeHours}h` : `${wholeHours}h${String(minutes).padStart(2, "0")}`;
}
