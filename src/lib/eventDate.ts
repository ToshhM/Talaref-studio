export function getCongoEventDate() {
  const now = new Date();
  const thisYearEvent = new Date(now.getFullYear(), 7, 15);
  const year = now > thisYearEvent ? now.getFullYear() + 1 : now.getFullYear();

  return {
    year,
    iso: `${year}-08-15`,
    label: `15 août ${year}`,
  };
}

export function buildCongoEventSlots() {
  const slots: string[] = [];
  let minutes = 9 * 60;
  const end = 22 * 60;

  while (minutes < end) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    slots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    minutes += 20;
  }

  return slots;
}
