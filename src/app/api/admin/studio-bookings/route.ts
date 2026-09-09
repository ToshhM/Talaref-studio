import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("studio_bookings")
    .select("*")
    .order("booking_date", { ascending: true })
    .order("slot", { ascending: true });

  if (error) {
    console.error("Admin studio bookings list error:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des réservations." },
      { status: 500 }
    );
  }

  return NextResponse.json({ bookings: data });
}
