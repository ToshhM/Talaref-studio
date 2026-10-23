import { photographerFormulas } from "./photographerFormulas";
import type { PaymentMode } from "./bookingSecurity";

export const PROMO_SERVICES = [
  { id: "location-studio", title: "Location du studio" },
  { id: "prestation-photographe", title: "Prestations avec photographe" },
  { id: "podcasts", title: "Podcasts" },
  { id: "formations", title: "Formations créatives" },
] as const;

export type PromoCode = {
  id: string;
  code: string;
  creator_name: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  service_ids: string[];
  expires_at: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};
export type PromoCodeInput = Omit<PromoCode, "id" | "created_at" | "updated_at">;

export class PromoCodeError extends Error {}

export function normalizePromoCode(value: unknown) {
  const code = typeof value === "string" ? value.trim().toUpperCase() : "";
  if (!/^[A-Z0-9_-]{3,40}$/.test(code)) {
    throw new PromoCodeError("Le code doit contenir 3 à 40 lettres, chiffres, tirets ou underscores.");
  }
  return code;
}

export function parsePromoCodeInput(body: Record<string, unknown>): PromoCodeInput {
  const code = normalizePromoCode(body.code);
  const creatorName = typeof body.creator_name === "string" ? body.creator_name.trim() : "";
  const value = Number(body.discount_value);
  if (!creatorName || creatorName.length > 100) throw new PromoCodeError("Indiquez un nom de créateur (100 caractères maximum).");
  if (body.discount_type !== "percentage" && body.discount_type !== "fixed") throw new PromoCodeError("Type de réduction invalide.");
  if (!Number.isFinite(value) || value <= 0 || value > 100000 || Math.abs(value * 100 - Math.round(value * 100)) > 0.00001 || (body.discount_type === "percentage" && value >= 100)) {
    throw new PromoCodeError("La réduction doit être positive, avec deux décimales maximum, et inférieure à 100 %.");
  }
  if (!Array.isArray(body.service_ids) || !body.service_ids.length || body.service_ids.some((id) => !PROMO_SERVICES.some((service) => service.id === id))) {
    throw new PromoCodeError("Sélectionnez au moins une prestation valide.");
  }
  if (typeof body.active !== "boolean") throw new PromoCodeError("Statut du code invalide.");
  let expiresAt: string | null = null;
  if (body.expires_at !== null && body.expires_at !== "" && body.expires_at !== undefined) {
    if (typeof body.expires_at !== "string" || !Number.isFinite(Date.parse(body.expires_at))) throw new PromoCodeError("Date d’expiration invalide.");
    expiresAt = new Date(body.expires_at).toISOString();
  }
  return { code, creator_name: creatorName, discount_type: body.discount_type, discount_value: value, service_ids: [...new Set(body.service_ids as string[])], expires_at: expiresAt, active: body.active };
}

export function getPromoServiceId(service: string): string | null {
  if (service === "Location Du Studio") return "location-studio";
  if (service === "Podcasts") return "podcasts";
  if (service === "Formations Créatives") return "formations";
  if (photographerFormulas.some((formula) => formula.title === service && formula.tiers.length)) return "prestation-photographe";
  return null;
}

export function assertPromoEligible(promo: PromoCode, service: string, now = Date.now()) {
  if (!promo.active || (promo.expires_at && Date.parse(promo.expires_at) <= now)) throw new PromoCodeError("Ce code promo est expiré ou désactivé.");
  const serviceId = getPromoServiceId(service);
  if (!serviceId || !promo.service_ids.includes(serviceId)) throw new PromoCodeError("Ce code promo ne s’applique pas à cette prestation.");
}

// All calculations use cents; the discount is applied to the whole booking,
// then the deposit is rounded once and the balance is obtained by subtraction.
export function calculatePromoAmounts(baseAmount: number, promo: Pick<PromoCode, "discount_type" | "discount_value">, paymentMode: PaymentMode) {
  const originalCents = Math.round(baseAmount * 100);
  const value = Number(promo.discount_value);
  if (!Number.isSafeInteger(originalCents) || originalCents <= 0 || !Number.isFinite(value) || value <= 0 || (promo.discount_type !== "fixed" && promo.discount_type !== "percentage") || (promo.discount_type === "percentage" && value >= 100)) throw new PromoCodeError("Réduction invalide.");
  const discountCents = promo.discount_type === "percentage" ? Math.round(originalCents * value / 100) : Math.round(value * 100);
  const totalCents = originalCents - discountCents;
  const paidCents = paymentMode === "deposit" ? Math.round(totalCents * 0.3) : totalCents;
  if (discountCents <= 0 || paidCents < 50) throw new PromoCodeError("Cette réduction est trop élevée pour ce montant ou cet acompte (paiement minimum : 0,50 €).");
  return { originalCents, discountCents, totalCents, paidCents, remainingCents: totalCents - paidCents };
}

// Stripe metadata is a snapshot of the conditions at checkout creation. A later
// edit/expiration of the code must not invalidate an already paid reservation.
export function readPromoSnapshot(metadata: Record<string, string>, paymentMode: PaymentMode) {
  if (!metadata.promoCodeId) {
    if (metadata.promoCode) throw new PromoCodeError("Métadonnées promo incomplètes.");
    return null;
  }
  if (!/^[0-9a-f-]{36}$/i.test(metadata.promoCodeId) || !metadata.promoCreator) throw new PromoCodeError("Métadonnées promo invalides.");
  normalizePromoCode(metadata.promoCode);
  const originalCents = Number(metadata.originalAmountCents);
  if (!Number.isSafeInteger(originalCents) || originalCents <= 0) throw new PromoCodeError("Montant initial invalide.");
  const amounts = calculatePromoAmounts(originalCents / 100, { discount_type: metadata.promoDiscountType as PromoCode["discount_type"], discount_value: Number(metadata.promoDiscountValue) }, paymentMode);
  if (!Number.isFinite(Number(metadata.baseAmount)) || Number(metadata.discountAmountCents) !== amounts.discountCents || Math.abs(Number(metadata.baseAmount) * 100 - amounts.totalCents) > 0.00001 || Math.round(Number(metadata.paidAmount) * 100) !== amounts.paidCents) throw new PromoCodeError("Montants promo incohérents.");
  return amounts;
}
