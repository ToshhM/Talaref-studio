"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Copy, Pencil, Plus, Tag, Users } from "lucide-react";
import { PROMO_SERVICES, type PromoCode, type PromoCodeInput } from "@/lib/promoCodes";

type CodeWithStats = PromoCode & { stats: { bookings: number; paid_cents: number } };
const emptyForm = (): PromoCodeInput => ({ code: "", creator_name: "", discount_type: "percentage", discount_value: 10, service_ids: PROMO_SERVICES.map((service) => service.id), expires_at: null, active: true });
const money = (cents: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
const fieldClass = "w-full rounded-xl border border-white/15 bg-[#151515] px-4 py-3 text-sm text-white outline-none focus:border-secondaire disabled:opacity-50";

function toLocalDateTime(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

export default function AdminPromoCodesPage() {
  const router = useRouter();
  const [codes, setCodes] = useState<CodeWithStats[]>([]);
  const [form, setForm] = useState<PromoCodeInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/promo-codes", { cache: "no-store" });
      if (response.status === 401) { router.push("/admin/login"); return; }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Chargement impossible.");
      setCodes(data.codes);
      setError("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erreur de connexion.");
    } finally { setLoading(false); }
  }, [router]);

  useEffect(() => { void load(); }, [load]);

  const reset = () => { setForm(emptyForm()); setEditingId(null); setFormError(""); };
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true); setFormError(""); setNotice("");
    try {
      const response = await fetch("/api/admin/promo-codes", { method: editingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, id: editingId }) });
      if (response.status === 401) { router.push("/admin/login"); return; }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Enregistrement impossible.");
      reset(); setNotice(editingId ? "Code promo mis à jour." : "Code promo créé.");
      await load();
    } catch (error) { setFormError(error instanceof Error ? error.message : "Erreur de connexion."); }
    finally { setSaving(false); }
  };

  const toggle = async (code: CodeWithStats) => {
    setPendingId(code.id); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin/promo-codes", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...code, active: !code.active }) });
      if (response.status === 401) { router.push("/admin/login"); return; }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Modification impossible.");
      setCodes((items) => items.map((item) => item.id === code.id ? { ...data.code, stats: item.stats } : item));
      if (editingId === code.id) setForm((current) => ({ ...current, active: data.code.active }));
      setNotice(data.code.active ? "Code activé." : "Code désactivé.");
    } catch (error) { setError(error instanceof Error ? error.message : "Erreur de connexion."); }
    finally { setPendingId(null); }
  };

  const visibleCodes = codes.filter((code) => `${code.code} ${code.creator_name}`.toLowerCase().includes(query.toLowerCase()));
  const activeCount = codes.filter((code) => code.active && (!code.expires_at || new Date(code.expires_at).getTime() > Date.now())).length;
  const bookings = codes.reduce((sum, code) => sum + code.stats.bookings, 0);
  const paid = codes.reduce((sum, code) => sum + code.stats.paid_cents, 0);

  return (
    <main className="min-h-screen bg-background px-5 py-10 text-white sm:px-8 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <Link href="/admin" className="inline-flex items-center gap-2 text-xs font-bold text-white/50 hover:text-white"><ArrowLeft size={14} /> Console admin</Link>
        <header className="mt-7 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-secondaire">Admin · Talaref Studio</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Codes promo créateurs</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">Créez une réduction pour chaque créateur et retrouvez les réservations associées à son code.</p>
          </div>
          <Link href="/admin/bookings" className="rounded-full border border-white/15 px-5 py-3 text-xs font-bold transition hover:border-secondaire/50">Voir les réservations →</Link>
        </header>

        <div className="my-8 grid gap-3 sm:grid-cols-3">
          {[
            { icon: Tag, label: "Codes actifs", value: activeCount },
            { icon: Users, label: "Réservations confirmées", value: bookings },
            { icon: Check, label: "Encaissé via les codes", value: money(paid) },
          ].map(({ icon: Icon, label, value }) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><div className="flex items-center gap-2 text-xs text-white/50"><Icon size={15} className="text-secondaire" />{label}</div><p className="mt-3 text-2xl font-black">{loading || error ? "—" : value}</p></div>)}
        </div>

        {error && <div role="alert" className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">{error} <button onClick={load} className="ml-2 underline">Réessayer</button></div>}
        {notice && <p role="status" className="mb-5 rounded-xl border border-secondaire/20 bg-secondaire/5 p-4 text-sm text-secondaire">{notice}</p>}

        <div className="grid items-start gap-7 lg:grid-cols-[360px_minmax(0,1fr)]">
          <section id="promo-editor" className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="flex items-center gap-2 text-lg font-black"><Plus size={18} className="text-secondaire" />{editingId ? "Modifier le code" : "Nouveau code"}</h2>
            <form onSubmit={save} className="mt-6 space-y-5">
              <fieldset disabled={saving || Boolean(pendingId)} className="space-y-5 disabled:opacity-60">
                <label className="block space-y-2"><span className="text-xs font-bold text-white/60">Nom du créateur</span><input required maxLength={100} value={form.creator_name} onChange={(e) => setForm({ ...form, creator_name: e.target.value })} placeholder="Nom ou pseudo" className={fieldClass} /></label>
                <label className="block space-y-2"><span className="text-xs font-bold text-white/60">Code à partager</span><input required minLength={3} maxLength={40} pattern="[A-Za-z0-9_-]{3,40}" disabled={Boolean(editingId)} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="CREATEUR10" className={`${fieldClass} font-mono uppercase`} />{editingId && <span className="block text-xs text-white/40">Le code reste identique pour conserver son suivi.</span>}</label>
                <div className="grid grid-cols-[1fr_100px] gap-3">
                  <label className="block space-y-2"><span className="text-xs font-bold text-white/60">Réduction</span><select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value as PromoCode["discount_type"] })} className={fieldClass}><option value="percentage">Pourcentage (%)</option><option value="fixed">Montant (€)</option></select></label>
                  <label className="block space-y-2"><span className="text-xs font-bold text-white/60">Valeur</span><input type="number" required min="0.01" max={form.discount_type === "percentage" ? "99.99" : "100000"} step="0.01" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })} className={fieldClass} /></label>
                </div>
                <fieldset className="space-y-3"><legend className="mb-3 text-xs font-bold text-white/60">Prestations concernées</legend>{PROMO_SERVICES.map((service) => <label key={service.id} className="flex items-center gap-3 text-sm text-white/75"><input type="checkbox" checked={form.service_ids.includes(service.id)} onChange={(e) => setForm({ ...form, service_ids: e.target.checked ? [...form.service_ids, service.id] : form.service_ids.filter((id) => id !== service.id) })} className="h-4 w-4 accent-secondaire" />{service.title}</label>)}</fieldset>
                <label className="block space-y-2"><span className="text-xs font-bold text-white/60">Expiration (facultative, heure locale)</span><input type="datetime-local" value={toLocalDateTime(form.expires_at)} onChange={(e) => setForm({ ...form, expires_at: e.target.value ? new Date(e.target.value).toISOString() : null })} className={`${fieldClass} [color-scheme:dark]`} /></label>
                <label className="flex items-center gap-3 text-sm text-white/75"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 accent-secondaire" />Code actif</label>
              </fieldset>
              <p className="text-xs leading-5 text-white/40">Un seul code par réservation. La réduction porte sur le total, options et forfait de nuit inclus, avant l’acompte. Les prestations sur devis sont exclues.</p>
              {formError && <p role="alert" className="text-sm text-red-300">{formError}</p>}
              <button type="submit" disabled={saving || Boolean(pendingId) || !form.service_ids.length} className="w-full rounded-xl bg-secondaire px-5 py-3.5 text-sm font-black text-background disabled:opacity-40">{saving ? "Enregistrement…" : editingId ? "Enregistrer les modifications" : "Créer le code promo"}</button>
              {editingId && <button type="button" onClick={reset} disabled={saving} className="w-full text-sm text-white/50 underline">Annuler la modification</button>}
            </form>
          </section>

          <section aria-label="Liste des codes promo" className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-black">Vos codes <span className="ml-1 text-sm font-normal text-white/40">({codes.length})</span></h2><input type="search" aria-label="Rechercher un code ou un créateur" placeholder="Rechercher un créateur, un code…" value={query} onChange={(e) => setQuery(e.target.value)} className={`${fieldClass} sm:max-w-xs`} /></div>
            {loading ? <p className="py-14 text-center text-sm text-white/40">Chargement des codes…</p> : !visibleCodes.length && !error ? <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center"><Tag size={26} className="mx-auto text-secondaire" /><p className="mt-4 font-bold">{query ? "Aucun résultat" : "Votre premier partenariat commence ici"}</p><p className="mt-2 text-sm leading-6 text-white/45">{query ? "Essayez un autre nom ou un autre code." : "Créez un code, puis partagez-le avec votre créateur."}</p></div> : <div className="space-y-4">{visibleCodes.map((code) => {
              const expired = Boolean(code.expires_at && new Date(code.expires_at).getTime() <= Date.now());
              return <article key={code.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs text-white/45">{code.creator_name}</p><p className="mt-1 break-all font-mono text-xl font-black tracking-wide">{code.code}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${!code.active ? "bg-white/5 text-white/40" : expired ? "bg-orange-400/10 text-orange-300" : "bg-secondaire/10 text-secondaire"}`}>{!code.active ? "Désactivé" : expired ? "Expiré" : "Actif"}</span></div>
                <p className="mt-5 text-2xl font-black text-secondaire">−{Number(code.discount_value).toLocaleString("fr-FR")}{code.discount_type === "percentage" ? " %" : " €"}</p>
                <p className="mt-2 text-xs leading-5 text-white/50">{code.service_ids.map((id) => PROMO_SERVICES.find((service) => service.id === id)?.title).join(" · ")}</p>
                <p className="mt-2 text-xs text-white/40">{code.expires_at ? `Expire le ${new Date(code.expires_at).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}` : "Sans date d’expiration"}</p>
                <div className="mt-5 flex flex-wrap justify-between gap-4 border-t border-white/10 pt-4"><div className="text-xs leading-6 text-white/50"><strong className="text-white">{code.stats.bookings}</strong> réservation{code.stats.bookings > 1 ? "s" : ""} confirmée{code.stats.bookings > 1 ? "s" : ""}<br /><strong className="text-white">{money(code.stats.paid_cents)}</strong> encaissés</div><div className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(code.code); setCopiedId(code.id); } catch { setError("Copie impossible. Sélectionnez le code pour le copier."); } }} className="rounded-lg border border-white/10 p-2.5 text-white/60 hover:text-white" aria-label={`Copier ${code.code}`}>{copiedId === code.id ? <Check size={15} /> : <Copy size={15} />}</button>
                  <button type="button" disabled={saving || Boolean(pendingId)} onClick={() => { setEditingId(code.id); setForm({ code: code.code, creator_name: code.creator_name, discount_type: code.discount_type, discount_value: code.discount_value, service_ids: [...code.service_ids], expires_at: code.expires_at, active: code.active }); setFormError(""); setNotice(""); document.getElementById("promo-editor")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-xs font-bold text-white/70 disabled:opacity-40"><Pencil size={13} />Modifier</button>
                  <button type="button" disabled={Boolean(pendingId) || saving} onClick={() => toggle(code)} className="rounded-lg border border-white/10 px-3 py-2.5 text-xs font-bold text-white/70 disabled:opacity-40">{pendingId === code.id ? "…" : code.active ? "Désactiver" : "Activer"}</button>
                </div></div>
              </article>;
            })}</div>}
            <p className="mt-5 text-xs leading-5 text-white/35">Le suivi inclut les paiements initiaux des réservations confirmées (acompte ou totalité). Les réservations annulées sont exclues. Il ne déduit pas les remboursements Stripe.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
