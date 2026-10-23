// Stripe fallback records can predate the current booking metadata schema.
// Keep those records visible even when their dates are missing or malformed.
export function bookingDateInput(value: string | null | undefined): string {
  if (!value) return "";
  const match = /^(\d{4}-\d{2}-\d{2})(?:T.+)?$/.exec(value);
  if (!match) return "";
  const date = new Date(`${match[1]}T12:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== match[1]) return "";
  if (value !== match[1] && !Number.isFinite(new Date(value).getTime())) return "";
  return match[1];
}

export function formatBookingDate(value: string | null | undefined): string {
  if (!value) return "Date non renseignée";
  const isoDate = bookingDateInput(value);
  if (!isoDate) return "Date invalide";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeZone: "UTC" })
    .format(new Date(`${isoDate}T12:00:00Z`));
}

export function formatEmailDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "Date invalide";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}
