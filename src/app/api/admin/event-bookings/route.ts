import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("event_bookings")
    .select("*")
    .order("event_date", { ascending: true })
    .order("slot", { ascending: true });

  if (error) {
    console.error("Admin bookings list error:", error);
    const message = error.code === "PGRST303"
      ? "Accès Supabase refusé : la clé serveur ou sa date de validité doit être vérifiée."
      : error.code === "PGRST205" || error.code === "42P01"
        ? "La table des réservations Congo doit être initialisée dans Supabase."
        : "Erreur lors du chargement des réservations Congo.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }

  return NextResponse.json({ bookings: data });
}
