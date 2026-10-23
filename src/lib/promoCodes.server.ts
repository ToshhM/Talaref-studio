import { supabaseAdmin } from "./supabaseAdmin";
import { assertPromoEligible, calculatePromoAmounts, normalizePromoCode, PromoCodeError } from "./promoCodes";
import type { PaymentMode } from "./bookingSecurity";

export async function resolvePromoCode(rawCode: unknown, service: string, baseAmount: number, paymentMode: PaymentMode) {
  const code = normalizePromoCode(rawCode);
  const { data, error } = await supabaseAdmin.from("creator_promo_codes").select("*").eq("code", code).maybeSingle();
  if (error) {
    console.error("Promo code lookup failed:", error.code);
    throw new Error("Les codes promo sont momentanément indisponibles. Réessayez plus tard.");
  }
  if (!data) throw new PromoCodeError("Code promo introuvable.");
  assertPromoEligible(data, service);
  return { promo: data, amounts: calculatePromoAmounts(baseAmount, data, paymentMode) };
}
