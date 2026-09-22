import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { formatProjectContent } from "@/lib/formatProjectContent";

const CATEGORIES = ["Photo", "Web", "Design", "Projects"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  const updates: Record<string, unknown> = {};

  if (typeof body.title === "string") {
    if (!body.title.trim()) {
      return NextResponse.json({ error: "Le titre ne peut pas être vide." }, { status: 400 });
    }
    updates.title = body.title.trim();
  }

  if (typeof body.slug === "string") {
    const slug = slugify(body.slug);
    if (!slug) {
      return NextResponse.json({ error: "Slug invalide." }, { status: 400 });
    }
    const { data: existing } = await supabaseAdmin
      .from("projects")
      .select("id")
      .eq("slug", slug)
      .neq("id", id)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ error: "Ce slug existe déjà, choisis-en un autre." }, { status: 409 });
    }
    updates.slug = slug;
  }

  if (typeof body.description === "string") updates.description = body.description.trim();
  if (typeof body.content === "string") updates.content = formatProjectContent(body.content) || null;
  else if (body.content === null) updates.content = null;
  if (typeof body.category === "string") {
    if (!CATEGORIES.includes(body.category)) {
      return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });
    }
    updates.category = body.category;
  }
  if (Array.isArray(body.tags)) updates.tags = body.tags;
  if (Array.isArray(body.technologies)) updates.technologies = body.technologies;
  if (typeof body.client === "string" || body.client === null) updates.client = body.client || null;
  if (typeof body.project_date === "string" || body.project_date === null) updates.project_date = body.project_date || null;
  if (typeof body.featured_image === "string" || body.featured_image === null) updates.featured_image = body.featured_image || null;
  if (Array.isArray(body.images)) updates.images = body.images;
  if (typeof body.featured === "boolean") updates.featured = body.featured;
  if (typeof body.published === "boolean") updates.published = body.published;
  if (Number.isFinite(body.order_index)) updates.order_index = body.order_index;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Aucune modification fournie." }, { status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Admin project update error:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour." }, { status: 500 });
  }

  return NextResponse.json({ project: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabaseAdmin.from("projects").delete().eq("id", id);

  if (error) {
    console.error("Admin project delete error:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
