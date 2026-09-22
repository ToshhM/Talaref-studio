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

/** Liste tous les projets (publiés ou non) pour l'admin. */
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin projects list error:", error);
    return NextResponse.json({ error: "Erreur lors du chargement." }, { status: 500 });
  }

  return NextResponse.json({ projects: data });
}

/** Crée un nouveau projet. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "Le titre est obligatoire." }, { status: 400 });
  }

  const category = CATEGORIES.includes(body.category) ? body.category : "Web";
  const slug = typeof body.slug === "string" && body.slug.trim() ? slugify(body.slug) : slugify(body.title);

  if (!slug) {
    return NextResponse.json({ error: "Slug invalide." }, { status: 400 });
  }

  const { data: existing } = await supabaseAdmin.from("projects").select("id").eq("slug", slug).maybeSingle();
  if (existing) {
    return NextResponse.json({ error: "Ce slug existe déjà, choisis-en un autre." }, { status: 409 });
  }

  const { data, error } = await supabaseAdmin
    .from("projects")
    .insert({
      title: body.title.trim(),
      slug,
      description: typeof body.description === "string" ? body.description.trim() : "",
      content: typeof body.content === "string" ? formatProjectContent(body.content) || null : null,
      category,
      tags: Array.isArray(body.tags) ? body.tags : [],
      technologies: Array.isArray(body.technologies) ? body.technologies : [],
      client: typeof body.client === "string" ? body.client.trim() || null : null,
      project_date: typeof body.project_date === "string" ? body.project_date || null : null,
      featured_image: typeof body.featured_image === "string" ? body.featured_image || null : null,
      images: Array.isArray(body.images) ? body.images : [],
      featured: Boolean(body.featured),
      published: Boolean(body.published),
      order_index: Number.isFinite(body.order_index) ? body.order_index : 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Admin project create error:", error);
    return NextResponse.json({ error: "Erreur lors de la création." }, { status: 500 });
  }

  return NextResponse.json({ project: data });
}
