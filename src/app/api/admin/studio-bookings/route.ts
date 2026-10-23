import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  return new Stripe(secretKey, { apiVersion: "2026-04-22.dahlia" });
}

async function getStripeBookings() {
  const stripe = getStripeClient();
  const sessions: Stripe.Checkout.Session[] = [];

  for await (const session of stripe.checkout.sessions.list({ limit: 100 })) {
    sessions.push(session);
  }

  return sessions
    .filter((session) => session.payment_status === "paid" && session.metadata)
    .map((session) => {
      const metadata = session.metadata!;
      return {
        id: session.id,
        stripe_session_id: session.id,
        first_name: metadata.firstName || "",
        last_name: metadata.lastName || "",
        email: metadata.email || session.customer_details?.email || "",
        phone: metadata.phone || null,
        siret: metadata.siret || null,
        company_name: metadata.companyName || null,
        service: metadata.service || "Réservation Stripe",
        booking_date: metadata.date || "",
        formatted_date: metadata.formattedDate || metadata.date || null,
        slot: metadata.slot || "",
        duration: Number(metadata.duration) || 1,
        payment_mode: metadata.paymentMode === "deposit" ? "deposit" : "full",
        amount_paid_cents: session.amount_total || 0,
        message: metadata.message || null,
        promo_code_id: metadata.promoCodeId || null,
        promo_code: metadata.promoCode || null,
        promo_creator_name: metadata.promoCreator || null,
        original_amount_cents: metadata.originalAmountCents ? Number(metadata.originalAmountCents) : null,
        discount_amount_cents: metadata.discountAmountCents ? Number(metadata.discountAmountCents) : null,
        total_amount_cents: metadata.promoCodeId ? Math.round(Number(metadata.baseAmount) * 100) : null,
        client_email_sent_at: null,
        admin_email_sent_at: null,
        review_email_sent_at: null,
        status: "confirmed" as const,
        created_at: new Date(session.created * 1000).toISOString(),
        updated_at: new Date(session.created * 1000).toISOString(),
      };
    })
    .sort((first, second) => `${first.booking_date}${first.slot}`.localeCompare(`${second.booking_date}${second.slot}`));
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("studio_bookings")
    .select("*")
    .order("booking_date", { ascending: true })
    .order("slot", { ascending: true });

  if (error) {
    console.error("Admin studio bookings list error:", error);
    try {
      return NextResponse.json({
        bookings: await getStripeBookings(),
        source: "stripe",
        warning: "Affichage de secours depuis Stripe : la base des réservations est indisponible. Les modifications et le suivi des emails nécessitent son rétablissement.",
      });
    } catch (stripeError) {
      console.error("Admin Stripe bookings fallback error:", stripeError);
      return NextResponse.json(
        { error: "Impossible de charger les réservations Supabase ou Stripe." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ bookings: data });
}
