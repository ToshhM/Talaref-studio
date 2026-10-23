import { NextResponse } from "next/server";
import { resolvePromoCode } from "@/lib/promoCodes.server";
import { getPromoServiceId, PromoCodeError } from "@/lib/promoCodes";
import { calculateBookingPrice } from "@/lib/priceCalculator";
import { photographerFormulas } from "@/lib/photographerFormulas";
import type { PodcastEditingPackage } from "@/lib/podcastOptions";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { service, duration, slot, paymentMode, podcastCameraCount, podcastEditingPackage } = body;
    if (typeof service !== "string" || !getPromoServiceId(service) || typeof duration !== "number" || !Number.isFinite(duration) || duration <= 0 || duration > 14 || duration * 2 !== Math.round(duration * 2) || typeof slot !== "string" || !/^([01]\d|2[0-3]):(00|30)$/.test(slot) || (paymentMode !== "full" && paymentMode !== "deposit")) throw new PromoCodeError("Paramètres de réservation invalides.");
    const formula = photographerFormulas.find((item) => item.title === service);
    if (formula && !formula.tiers.some((tier) => tier.duration === duration)) throw new PromoCodeError("Durée de formule invalide.");
    if (service === "Podcasts" && ((podcastCameraCount !== 1 && podcastCameraCount !== 2) || !["none", "30min", "45-60min"].includes(podcastEditingPackage))) throw new PromoCodeError("Options podcast invalides.");
    const baseAmount = calculateBookingPrice(service, duration, slot, body.isEnterprise === true, service === "Podcasts" ? { cameraCount: podcastCameraCount, editingPackage: podcastEditingPackage as PodcastEditingPackage } : undefined);
    const { promo, amounts } = await resolvePromoCode(body.code, service, baseAmount, paymentMode);
    // Public response contains only the applied reduction, never creator/admin data.
    return NextResponse.json({ code: promo.code, ...amounts }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof PromoCodeError ? error.message : "Impossible de vérifier ce code promo pour le moment." }, { status: error instanceof PromoCodeError ? 400 : 503 });
  }
}
