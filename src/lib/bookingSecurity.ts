import { calculateBookingPrice } from "./priceCalculator";

export type PaymentMode = "full" | "deposit";

export type BookingInput = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  siret: string;
  date: string;
  formattedDate: string;
  slot: string;
  duration: number;
  paymentMode: PaymentMode;
  service: string;
  message: string;
};

const VALID_PAYMENT_MODES = new Set<PaymentMode>(["full", "deposit"]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SLOT_PATTERN = /^([01]\d|2[0-3]):(00|30)$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const PHONE_PATTERN = /^[+()0-9\s.-]{6,30}$/;
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function getString(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";

  return value.replace(CONTROL_CHARS, "").trim().slice(0, maxLength);
}

function assertValidDate(value: string, allowPastDate = false) {
  if (!DATE_PATTERN.test(value)) {
    throw new Error("Date de reservation invalide.");
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  if (
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month - 1 ||
    parsedDate.getUTCDate() !== day
  ) {
    throw new Error("Date de reservation invalide.");
  }

  const today = new Date();
  const todayUtc = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  );

  if (!allowPastDate && parsedDate.getTime() < todayUtc) {
    throw new Error("La date de reservation est deja passee.");
  }
}

export function parseBookingInput(
  body: Record<string, unknown>,
  options: { allowPastDate?: boolean } = {}
): BookingInput {
  const email = getString(body.email, 254).toLowerCase();
  const firstName = getString(body.firstName, 80);
  const lastName = getString(body.lastName, 80);
  const phone = getString(body.phone, 30);
  const rawSiret = getString(body.siret, 20);
  const date = getString(body.date, 10);
  const formattedDate = getString(body.formattedDate, 120);
  const slot = getString(body.slot, 5);
  const service = getString(body.service, 80);
  const message = getString(body.message, 1000);
  const duration = Number(body.duration);
  const paymentMode = body.paymentMode;
  const siret = rawSiret.replace(/\s/g, "");

  if (!email || !firstName || !lastName || !phone || !date || !slot || !service) {
    throw new Error("Informations de reservation incompletes.");
  }

  if (!EMAIL_PATTERN.test(email)) {
    throw new Error("Adresse email invalide.");
  }

  if (!PHONE_PATTERN.test(phone)) {
    throw new Error("Numero de telephone invalide.");
  }

  if (siret && !/^\d{14}$/.test(siret)) {
    throw new Error("Numero de SIRET invalide.");
  }

  assertValidDate(date, options.allowPastDate);

  if (!SLOT_PATTERN.test(slot)) {
    throw new Error("Creneau de reservation invalide.");
  }

  if (!Number.isInteger(duration) || duration <= 0) {
    throw new Error("Duree de reservation invalide.");
  }

  if (!VALID_PAYMENT_MODES.has(paymentMode as PaymentMode)) {
    throw new Error("Mode de paiement invalide.");
  }

  return {
    email,
    firstName,
    lastName,
    phone,
    siret,
    date,
    formattedDate,
    slot,
    duration,
    paymentMode: paymentMode as PaymentMode,
    service,
    message,
  };
}

export function parseBookingMetadata(
  metadata: Record<string, string> | null | undefined
): BookingInput {
  return parseBookingInput(
    {
      email: metadata?.email,
      firstName: metadata?.firstName,
      lastName: metadata?.lastName,
      phone: metadata?.phone,
      siret: metadata?.siret,
      date: metadata?.date,
      formattedDate: metadata?.formattedDate,
      slot: metadata?.slot,
      duration: metadata?.duration,
      paymentMode: metadata?.paymentMode,
      service: metadata?.service,
      message: metadata?.message,
    },
    { allowPastDate: true }
  );
}

export function calculateExpectedPaymentAmount(input: BookingInput) {
  const baseAmount = calculateBookingPrice(
    input.service,
    input.duration,
    input.slot,
    Boolean(input.siret)
  );

  const paidAmount = input.paymentMode === "deposit" ? baseAmount * 0.3 : baseAmount;

  return {
    baseAmount,
    paidAmount,
    amountInCents: Math.round(paidAmount * 100),
  };
}

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function safeHttpsUrl(value: string, fallback = "#") {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : fallback;
  } catch {
    return fallback;
  }
}

export function getConfiguredSiteUrl(requestOrigin: string | null) {
  const configuredUrl =
    process.env.SITE_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl) {
    const parsed = new URL(configuredUrl);

    if (parsed.protocol !== "https:" && parsed.hostname !== "localhost") {
      throw new Error("SITE_URL doit utiliser HTTPS en production.");
    }

    return parsed.origin;
  }

  if (requestOrigin) {
    const parsed = new URL(requestOrigin);
    return parsed.origin;
  }

  throw new Error("SITE_URL manquant. Configurez l'URL publique du site.");
}
