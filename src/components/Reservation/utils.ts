export function formatPrice(value: number) {
  return Number.isInteger(value)
    ? value.toString()
    : value.toFixed(2).replace(".", ",");
}

export function getDurationLabel(duration: number) {
  return `${duration} ${duration > 1 ? "heures" : "heure"}`;
}

export function formatDateSummary(date: Date | null) {
  if (!date) return null;

  const formatted = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  return formatted.replace(/(^|\s)1(\s)/, "$11er$2");
}

export function buildStrictDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isSameDay(dateA: Date | null, dateB: Date) {
  if (!dateA) return false;

  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export function isPastDay(date: Date) {
  return date.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
}
