import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const SLOT_PATTERN = /^([01]\d|2[0-3]):(00|20|40)$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  const updates: Record<string, unknown> = {};

  if (typeof body.bookingDate === "string") {
    if (!DATE_PATTERN.test(body.bookingDate)) {
      return NextResponse.json({ error: "Date invalide." }, { status: 400 });
    }
    updates.booking_date = body.bookingDate;
  }

  if (typeof body.slot === "string") {
    if (!SLOT_PATTERN.test(body.slot)) {
      return NextResponse.json({ error: "Créneau invalide." }, { status: 400 });
    }
    updates.slot = body.slot;
  }

  if (typeof body.message === "string") {
    updates.message = body.message.trim().slice(0, 1000) || null;
  }

  if (typeof body.status === "string") {
    if (!["confirmed", "cancelled"].includes(body.status)) {
      return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
    }
    updates.status = body.status;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Aucune modification fournie." }, { status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("studio_bookings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Admin studio booking update error:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
  }

  return NextResponse.json({ booking: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabaseAdmin.from("studio_bookings").delete().eq("id", id);

  if (error) {
    console.error("Admin studio booking delete error:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
