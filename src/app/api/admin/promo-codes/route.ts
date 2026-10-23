import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, isValidAdminSessionToken } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { parsePromoCodeInput, PromoCodeError } from "@/lib/promoCodes";

async function authorized() {
  return isValidAdminSessionToken((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
}

export async function GET() {
  if (!await authorized()) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  const { data, error } = await supabaseAdmin.from("creator_promo_codes").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Promo codes list:", error.code);
    return NextResponse.json({ error: "Impossible de charger les codes promo. Vérifiez que la migration creator-promo-codes.sql a été appliquée." }, { status: 503 });
  }
  // Paginate to avoid Supabase's default row cap silently truncating statistics.
  const stats: Record<string, { bookings: number; paid_cents: number }> = {};
  for (let offset = 0; ; offset += 1000) {
    const result = await supabaseAdmin.from("studio_bookings").select("id,promo_code_id,amount_paid_cents").not("promo_code_id", "is", null).eq("status", "confirmed").order("id").range(offset, offset + 999);
    if (result.error) return NextResponse.json({ error: "Impossible de charger les statistiques des codes promo." }, { status: 503 });
    for (const booking of result.data) {
      const stat = stats[booking.promo_code_id!] ??= { bookings: 0, paid_cents: 0 };
      stat.bookings++;
      stat.paid_cents += booking.amount_paid_cents;
    }
    if (result.data.length < 1000) break;
  }
  return NextResponse.json({ codes: data.map((code) => ({ ...code, stats: stats[code.id] ?? { bookings: 0, paid_cents: 0 } })) }, { headers: { "Cache-Control": "no-store" } });
}

async function save(req: Request, updating: boolean) {
  if (!await authorized()) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  try {
    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new PromoCodeError("Formulaire invalide.");
    const input = parsePromoCodeInput(body);
    if (updating && (typeof body.id !== "string" || !/^[0-9a-f-]{36}$/i.test(body.id))) throw new PromoCodeError("Identifiant invalide.");
    // Codes cannot be renamed/reused: keep attribution stable for existing links.
    const query = updating
      ? supabaseAdmin.from("creator_promo_codes").update({ ...input, updated_at: new Date().toISOString() }).eq("id", body.id).eq("code", input.code)
      : supabaseAdmin.from("creator_promo_codes").insert(input);
    const { data, error } = await query.select().maybeSingle();
    if (error?.code === "23505") return NextResponse.json({ error: "Ce code existe déjà. Choisissez un autre code." }, { status: 409 });
    if (error) {
      console.error("Promo code save:", error.code);
      return NextResponse.json({ error: "Impossible d’enregistrer ce code promo." }, { status: 503 });
    }
    if (!data) return NextResponse.json({ error: "Code introuvable ou renommage interdit." }, { status: 404 });
    return NextResponse.json({ code: data }, { status: updating ? 200 : 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof PromoCodeError ? error.message : "Formulaire invalide." }, { status: 400 });
  }
}

export async function POST(req: Request) { return save(req, false); }
export async function PATCH(req: Request) { return save(req, true); }
