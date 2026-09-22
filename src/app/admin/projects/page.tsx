"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/database.types";

const CATEGORIES = ["Photo", "Web", "Design", "Projects"] as const;

type ProjectForm = {
  title: string;
  slug: string;
  description: string;
  content: string;
  category: (typeof CATEGORIES)[number];
  tags: string;
  technologies: string;
  client: string;
  project_date: string;
  featured_image: string;
  images: string[];
  featured: boolean;
  published: boolean;
  order_index: number;
};

const EMPTY_FORM: ProjectForm = {
  title: "",
  slug: "",
  description: "",
  content: "",
  category: "Web",
  tags: "",
  technologies: "",
  client: "",
  project_date: "",
  featured_image: "",
  images: [],
  featured: false,
  published: false,
  order_index: 0,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function projectToForm(p: Project): ProjectForm {
  return {
    title: p.title,
    slug: p.slug,
    description: p.description,
    content: p.content || "",
    category: (CATEGORIES as readonly string[]).includes(p.category) ? p.category : "Web",
    tags: p.tags.join(", "),
    technologies: p.technologies.join(", "),
    client: p.client || "",
    project_date: p.project_date || "",
    featured_image: p.featured_image || "",
    images: p.images || [],
    featured: p.featured,
    published: p.published,
    order_index: p.order_index,
  };
}

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Project | "new" | null>(null);
  const [form, setForm] = useState<ProjectForm>(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/admin/projects");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json().catch(() => null);
      if (res.ok) setProjects(data?.projects || []);
      else setErrorMessage(data?.error || "Erreur lors du chargement.");
    } catch {
      setErrorMessage("Erreur de connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return projects.filter((p) => `${p.title} ${p.slug} ${p.client || ""} ${p.category}`.toLowerCase().includes(q));
  }, [projects, query]);

  const openNew = () => {
    setForm(EMPTY_FORM);
    setSlugTouched(false);
    setSaveError("");
    setEditing("new");
  };

  const openEdit = (p: Project) => {
    setForm(projectToForm(p));
    setSlugTouched(true);
    setSaveError("");
    setEditing(p);
  };

  const closeModal = () => {
    setEditing(null);
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/projects/upload", { method: "POST", body });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      setSaveError(data?.error || "Envoi de l'image impossible.");
      return null;
    }
    return data.url as string;
  };

  const handleFeaturedUpload = async (file: File) => {
    setUploadingFeatured(true);
    const url = await uploadFile(file);
    if (url) setForm((f) => ({ ...f, featured_image: url }));
    setUploadingFeatured(false);
  };

  const handleGalleryUpload = async (files: FileList) => {
    setUploadingGallery(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadFile(file);
      if (url) urls.push(url);
    }
    if (urls.length) setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    setUploadingGallery(false);
  };

  const removeGalleryImage = (url: string) => {
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }));
  };

  const save = async () => {
    if (!form.title.trim()) {
      setSaveError("Le titre est obligatoire.");
      return;
    }
    setIsSaving(true);
    setSaveError("");

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      description: form.description.trim(),
      content: form.content,
      category: form.category,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean),
      client: form.client.trim() || null,
      project_date: form.project_date || null,
      featured_image: form.featured_image || null,
      images: form.images,
      featured: form.featured,
      published: form.published,
      order_index: Number(form.order_index) || 0,
    };

    const isNew = editing === "new";
    const url = isNew ? "/api/admin/projects" : `/api/admin/projects/${(editing as Project).id}`;
    const method = isNew ? "POST" : "PATCH";

    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      setSaveError(data?.error || "Enregistrement impossible.");
      setIsSaving(false);
      return;
    }

    if (isNew) setProjects((items) => [...items, data.project]);
    else setProjects((items) => items.map((item) => (item.id === data.project.id ? data.project : item)));

    setIsSaving(false);
    setEditing(null);
  };

  const togglePublished = async (p: Project) => {
    setPendingId(p.id);
    const res = await fetch(`/api/admin/projects/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !p.published }),
    });
    const data = await res.json().catch(() => null);
    if (res.ok) setProjects((items) => items.map((item) => (item.id === p.id ? data.project : item)));
    setPendingId(null);
  };

  const remove = async (p: Project) => {
    if (!confirm(`Supprimer définitivement "${p.title}" ?`)) return;
    setPendingId(p.id);
    const res = await fetch(`/api/admin/projects/${p.id}`, { method: "DELETE" });
    if (res.ok) setProjects((items) => items.filter((item) => item.id !== p.id));
    setPendingId(null);
  };

  return (
    <main className="min-h-screen bg-background px-6 py-12 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-secondaire">Admin · Talaref Studio</p>
            <h1 className="mt-2 text-4xl font-black uppercase tracking-tight">Projets</h1>
            <p className="mt-2 text-sm text-white/50">Le portfolio affiché sur /portfolio.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => router.push("/admin/bookings")} className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black uppercase tracking-widest text-white/70">
              Réservations
            </button>
            <button onClick={openNew} className="rounded-full bg-secondaire px-4 py-2 text-xs font-black uppercase tracking-widest text-background">
              + Nouveau projet
            </button>
            <button
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" });
                router.push("/admin/login");
              }}
              className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black uppercase tracking-widest text-white/70"
            >
              Déconnexion
            </button>
          </div>
        </header>

        {errorMessage && <p className="mb-5 text-sm text-red-400">{errorMessage}</p>}

        <section className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-widest text-white/40">Total</p>
            <p className="mt-2 text-3xl font-black">{projects.length}</p>
          </div>
          <div className="rounded-2xl border border-secondaire/20 bg-secondaire/[0.06] p-5">
            <p className="text-xs uppercase tracking-widest text-white/40">Publiés</p>
            <p className="mt-2 text-3xl font-black text-secondaire">{projects.filter((p) => p.published).length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-widest text-white/40">Mis en avant</p>
            <p className="mt-2 text-3xl font-black">{projects.filter((p) => p.featured).length}</p>
          </div>
        </section>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un projet, un client..."
          className="mb-5 w-full max-w-md rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none placeholder:text-white/35"
        />

        {isLoading ? (
          <p className="text-white/50">Chargement...</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[11px] uppercase tracking-widest text-white/40">
                  <th className="px-5 py-4">Projet</th>
                  <th className="px-5 py-4">Catégorie</th>
                  <th className="px-5 py-4">Client</th>
                  <th className="px-5 py-4">Statut</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const pending = pendingId === p.id;
                  return (
                    <tr key={p.id} className="border-b border-white/5 align-top last:border-0">
                      <td className="px-5 py-5">
                        <div className="font-bold">{p.title}</div>
                        <div className="mt-1 text-xs text-white/45">/{p.slug}</div>
                        {p.featured && <span className="mt-2 inline-block rounded-full border border-secondaire/30 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-secondaire">Mis en avant</span>}
                      </td>
                      <td className="px-5 py-5 text-white/65">{p.category}</td>
                      <td className="px-5 py-5 text-white/65">{p.client || "—"}</td>
                      <td className="px-5 py-5">
                        <button
                          disabled={pending}
                          onClick={() => togglePublished(p)}
                          className={`rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-widest ${p.published ? "bg-secondaire/15 text-secondaire" : "bg-white/10 text-white/45"}`}
                        >
                          {p.published ? "Publié" : "Brouillon"}
                        </button>
                      </td>
                      <td className="px-5 py-5 text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button disabled={pending} onClick={() => openEdit(p)} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/70">
                            Modifier
                          </button>
                          <button disabled={pending} onClick={() => remove(p)} className="rounded-lg border border-red-500/30 px-3 py-2 text-xs text-red-400">
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!filtered.length && <p className="p-8 text-center text-white/45">Aucun projet ne correspond à ces critères.</p>}
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-5">
          <div className="my-8 w-full max-w-2xl rounded-2xl border border-white/10 bg-[#061c2b] p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-secondaire">{editing === "new" ? "Nouveau projet" : "Modifier le projet"}</p>
                <h2 className="mt-2 text-2xl font-black">{editing === "new" ? "Ajouter un projet" : form.title}</h2>
              </div>
              <button onClick={closeModal} className="text-2xl text-white/50">×</button>
            </div>

            {saveError && <p className="mt-4 text-sm text-red-400">{saveError}</p>}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50 sm:col-span-2">
                Titre
                <input
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
                  }}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3 text-white"
                />
              </label>

              <label className="text-xs font-bold uppercase tracking-widest text-white/50 sm:col-span-2">
                Slug (URL : /portfolio/…)
                <input
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setForm((f) => ({ ...f, slug: e.target.value }));
                  }}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3 text-white"
                />
              </label>

              <label className="text-xs font-bold uppercase tracking-widest text-white/50 sm:col-span-2">
                Description courte
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3 text-white"
                />
              </label>

              <label className="text-xs font-bold uppercase tracking-widest text-white/50 sm:col-span-2">
                Texte du projet (page détail — du HTML simple est accepté, sinon chaque ligne devient un paragraphe)
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  rows={6}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3 font-mono text-xs text-white"
                />
              </label>

              <label className="text-xs font-bold uppercase tracking-widest text-white/50">
                Catégorie
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ProjectForm["category"] }))}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3 text-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-[#061c2b]">
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-bold uppercase tracking-widest text-white/50">
                Client
                <input
                  value={form.client}
                  onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3 text-white"
                />
              </label>

              <label className="text-xs font-bold uppercase tracking-widest text-white/50">
                Date du projet
                <input
                  type="date"
                  value={form.project_date}
                  onChange={(e) => setForm((f) => ({ ...f, project_date: e.target.value }))}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3 text-white"
                />
              </label>

              <label className="text-xs font-bold uppercase tracking-widest text-white/50">
                Ordre d&apos;affichage
                <input
                  type="number"
                  value={form.order_index}
                  onChange={(e) => setForm((f) => ({ ...f, order_index: Number(e.target.value) }))}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3 text-white"
                />
              </label>

              <label className="text-xs font-bold uppercase tracking-widest text-white/50 sm:col-span-2">
                Tags (séparés par des virgules)
                <input
                  value={form.tags}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3 text-white"
                />
              </label>

              <label className="text-xs font-bold uppercase tracking-widest text-white/50 sm:col-span-2">
                Technologies (séparées par des virgules)
                <input
                  value={form.technologies}
                  onChange={(e) => setForm((f) => ({ ...f, technologies: e.target.value }))}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3 text-white"
                />
              </label>

              <div className="sm:col-span-2">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Photo de une</p>
                <div className="mt-2 flex items-center gap-4">
                  {form.featured_image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.featured_image} alt="" className="h-20 w-20 rounded-lg object-cover" />
                  )}
                  <label className="cursor-pointer rounded-lg border border-white/15 px-3 py-2 text-xs text-white/70">
                    {uploadingFeatured ? "Envoi..." : "Choisir une image"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFeaturedUpload(e.target.files[0])}
                    />
                  </label>
                  {form.featured_image && (
                    <button onClick={() => setForm((f) => ({ ...f, featured_image: "" }))} className="text-xs text-red-400">
                      Retirer
                    </button>
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Galerie</p>
                <div className="mt-2 flex flex-wrap gap-3">
                  {form.images.map((url) => (
                    <div key={url} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="h-20 w-20 rounded-lg object-cover" />
                      <button
                        onClick={() => removeGalleryImage(url)}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                        aria-label="Retirer cette image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border border-dashed border-white/20 text-center text-[10px] text-white/50">
                    {uploadingGallery ? "Envoi..." : "+ Ajouter"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && handleGalleryUpload(e.target.files)}
                    />
                  </label>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
                Mettre en avant
              </label>
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50">
                <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />
                Publié (visible sur le site)
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={closeModal} className="rounded-lg border border-white/10 px-4 py-3 text-sm text-white/60">
                Annuler
              </button>
              <button onClick={save} disabled={isSaving} className="rounded-lg bg-secondaire px-4 py-3 text-sm font-black text-background">
                {isSaving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
