"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDurationHours } from "@/lib/duration";
import type { EventBooking, StudioBooking } from "@/lib/database.types";

type BookingType = "studio" | "congo";
type Filter = "all" | "confirmed" | "cancelled" | "studio" | "congo";
type UnifiedBooking = {
  id: string;
  type: BookingType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  slot: string;
  detail: string;
  message: string | null;
  status: "confirmed" | "cancelled";
  clientEmailSentAt: string | null;
  adminEmailSentAt: string | null;
  reviewEmailSentAt: string | null;
};

function toUnified(studio: StudioBooking[], congo: EventBooking[]): UnifiedBooking[] {
  const studioRows = studio.map((booking) => ({
    id: booking.id,
    type: "studio" as const,
    firstName: booking.first_name,
    lastName: booking.last_name,
    email: booking.email,
    phone: booking.phone || "—",
    date: booking.booking_date,
    slot: booking.slot,
    detail: `${booking.service} · ${formatDurationHours(Number(booking.duration))} · ${(booking.amount_paid_cents / 100).toFixed(2).replace(".", ",")} € ${booking.payment_mode === "deposit" ? "(acompte)" : ""}`.trim(),
    message: booking.message,
    status: booking.status,
    clientEmailSentAt: booking.client_email_sent_at,
    adminEmailSentAt: booking.admin_email_sent_at,
    reviewEmailSentAt: booking.review_email_sent_at,
  }));
  const eventRows = congo.map((booking) => ({
    id: booking.id,
    type: "congo" as const,
    firstName: booking.first_name,
    lastName: booking.last_name,
    email: booking.email,
    phone: booking.phone,
    date: booking.event_date,
    slot: booking.slot,
    detail: "Shooting Day Congolais · Gratuit",
    message: booking.message,
    status: booking.status,
    clientEmailSentAt: booking.client_email_sent_at,
    adminEmailSentAt: booking.admin_email_sent_at,
    reviewEmailSentAt: booking.review_email_sent_at,
  }));
  return [...studioRows, ...eventRows].sort((a, b) => `${a.date}${a.slot}`.localeCompare(`${b.date}${b.slot}`));
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function formatBookingDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(`${value}T12:00:00`));
}

export default function AdminBookingsPage() {
  const router = useRouter();
  const [studioBookings, setStudioBookings] = useState<StudioBooking[]>([]);
  const [congoBookings, setCongoBookings] = useState<EventBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});
  const [pendingRowId, setPendingRowId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<UnifiedBooking | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editSlot, setEditSlot] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testMessage, setTestMessage] = useState("");

  const loadBookings = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const [studioRes, congoRes] = await Promise.all([
        fetch("/api/admin/studio-bookings"),
        fetch("/api/admin/event-bookings"),
      ]);
      if (studioRes.status === 401 || congoRes.status === 401) {
        router.push("/admin/login");
        return;
      }
      const studioData = await studioRes.json().catch(() => null);
      const congoData = await congoRes.json().catch(() => null);
      if (studioRes.ok) setStudioBookings(studioData?.bookings || []);
      if (congoRes.ok) setCongoBookings(congoData?.bookings || []);
      if (!studioRes.ok || !congoRes.ok) setErrorMessage(studioData?.error || congoData?.error || "Erreur lors du chargement.");
    } catch {
      setErrorMessage("Erreur de connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bookings = useMemo(() => toUnified(studioBookings, congoBookings), [studioBookings, congoBookings]);
  const filteredBookings = useMemo(() => bookings.filter((booking) => {
    const matchesFilter = filter === "all" || filter === booking.status || filter === booking.type;
    const haystack = `${booking.firstName} ${booking.lastName} ${booking.email} ${booking.detail}`.toLowerCase();
    return matchesFilter && haystack.includes(query.toLowerCase());
  }), [bookings, filter, query]);

  const endpointFor = (booking: UnifiedBooking) => booking.type === "studio"
    ? `/api/admin/studio-bookings/${booking.id}`
    : `/api/admin/event-bookings/${booking.id}`;

  const replaceBooking = (updated: StudioBooking | EventBooking) => {
    if ("service" in updated) setStudioBookings((items) => items.map((item) => item.id === updated.id ? updated : item));
    else setCongoBookings((items) => items.map((item) => item.id === updated.id ? updated : item));
  };

  const updateStatus = async (booking: UnifiedBooking) => {
    setPendingRowId(booking.id);
    const response = await fetch(endpointFor(booking), { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: booking.status === "confirmed" ? "cancelled" : "confirmed" }) });
    const data = await response.json().catch(() => null);
    if (response.ok) replaceBooking(data.booking);
    else setRowErrors((errors) => ({ ...errors, [booking.id]: data?.error || "Mise à jour impossible." }));
    setPendingRowId(null);
  };

  const saveEdit = async () => {
    if (!editing) return;
    setPendingRowId(editing.id);
    const body = editing.type === "studio" ? { bookingDate: editDate, slot: editSlot, message: editMessage } : { eventDate: editDate, slot: editSlot, message: editMessage };
    const response = await fetch(endpointFor(editing), { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await response.json().catch(() => null);
    if (response.ok) { replaceBooking(data.booking); setEditing(null); }
    else setRowErrors((errors) => ({ ...errors, [editing.id]: data?.error || "Modification impossible." }));
    setPendingRowId(null);
  };

  const deleteBooking = async (booking: UnifiedBooking) => {
    if (!confirm("Supprimer définitivement cette réservation ?")) return;
    setPendingRowId(booking.id);
    const response = await fetch(endpointFor(booking), { method: "DELETE" });
    if (response.ok) {
      if (booking.type === "studio") setStudioBookings((items) => items.filter((item) => item.id !== booking.id));
      else setCongoBookings((items) => items.filter((item) => item.id !== booking.id));
    } else {
      const data = await response.json().catch(() => null);
      setRowErrors((errors) => ({ ...errors, [booking.id]: data?.error || "Suppression impossible." }));
    }
    setPendingRowId(null);
  };

  const resendEmails = async (booking: UnifiedBooking) => {
    setPendingRowId(booking.id);
    const response = await fetch("/api/admin/bookings/resend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: booking.type, id: booking.id }) });
    const data = await response.json().catch(() => null);
    if (response.ok) await loadBookings();
    else setRowErrors((errors) => ({ ...errors, [booking.id]: data?.error || "Envoi impossible." }));
    setPendingRowId(null);
  };

  const sendReviewEmail = async (booking: UnifiedBooking) => {
    if (booking.reviewEmailSentAt && !confirm("Un mail d’avis a déjà été envoyé. Le renvoyer ?")) return;
    setPendingRowId(booking.id);
    const response = await fetch("/api/admin/bookings/review-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: booking.type, id: booking.id }) });
    const data = await response.json().catch(() => null);
    if (response.ok) await loadBookings();
    else setRowErrors((errors) => ({ ...errors, [booking.id]: data?.error || "Envoi impossible." }));
    setPendingRowId(null);
  };

  const openEdit = (booking: UnifiedBooking) => {
    setEditing(booking);
    setEditDate(booking.date);
    setEditSlot(booking.slot);
    setEditMessage(booking.message || "");
  };

  const sendTestEmail = async () => {
    setIsSendingTest(true);
    const response = await fetch("/api/admin/email-test", { method: "POST" });
    const data = await response.json().catch(() => null);
    setTestMessage(response.ok ? `Mail de test envoyé à ${data?.recipient || "ADMIN_EMAIL"}.` : data?.error || "Envoi impossible.");
    setIsSendingTest(false);
  };

  const confirmedCount = bookings.filter((booking) => booking.status === "confirmed").length;
  const pendingEmails = bookings.filter((booking) => !booking.clientEmailSentAt || !booking.adminEmailSentAt).length;
  const filters: Filter[] = ["all", "confirmed", "cancelled", "studio", "congo"];

  return (
    <main className="min-h-screen bg-background px-6 py-12 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div><p className="text-xs font-black uppercase tracking-[0.3em] text-secondaire">Admin · Talaref Studio</p><h1 className="mt-2 text-4xl font-black uppercase tracking-tight">Réservations</h1><p className="mt-2 text-sm text-white/50">Le suivi opérationnel de vos clients, créneaux et confirmations.</p></div>
          <div className="flex gap-3"><button onClick={() => router.push("/admin/projects")} className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black uppercase tracking-widest text-white/70">Projets</button><button onClick={sendTestEmail} disabled={isSendingTest} className="rounded-full border border-secondaire/40 bg-secondaire/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-secondaire">{isSendingTest ? "Envoi..." : "Tester Mailjet"}</button><button onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); router.push("/admin/login"); }} className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black uppercase tracking-widest text-white/70">Déconnexion</button></div>
        </header>
        {testMessage && <p className="mb-5 text-sm text-secondaire">{testMessage}</p>}
        {errorMessage && <p className="mb-5 text-sm text-red-400">{errorMessage}</p>}
        <section className="mb-6 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-widest text-white/40">Total</p><p className="mt-2 text-3xl font-black">{bookings.length}</p></div><div className="rounded-2xl border border-secondaire/20 bg-secondaire/[0.06] p-5"><p className="text-xs uppercase tracking-widest text-white/40">Confirmées</p><p className="mt-2 text-3xl font-black text-secondaire">{confirmedCount}</p></div><div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"><p className="text-xs uppercase tracking-widest text-white/40">Mails à vérifier</p><p className="mt-2 text-3xl font-black">{pendingEmails}</p></div></section>
        <section className="mb-5 flex flex-wrap gap-3"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un client, un email..." className="min-w-[260px] flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none placeholder:text-white/35" />{filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-xl border px-4 py-3 text-xs font-black uppercase tracking-widest ${filter === item ? "border-secondaire/50 bg-secondaire/10 text-secondaire" : "border-white/10 text-white/50"}`}>{item === "all" ? "Toutes" : item === "confirmed" ? "Confirmées" : item === "cancelled" ? "Annulées" : item === "studio" ? "Studio" : "Congo"}</button>)}</section>
        {isLoading ? <p className="text-white/50">Chargement...</p> : <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]"><table className="w-full min-w-[1260px] text-left text-sm"><thead><tr className="border-b border-white/10 text-[11px] uppercase tracking-widest text-white/40"><th className="px-5 py-4">Réservation</th><th className="px-5 py-4">Client</th><th className="px-5 py-4">Contact</th><th className="px-5 py-4">Emails</th><th className="px-5 py-4">Statut</th><th className="px-5 py-4 text-right">Actions</th></tr></thead><tbody>{filteredBookings.map((booking) => { const pending = pendingRowId === booking.id; return <tr key={`${booking.type}-${booking.id}`} className="border-b border-white/5 align-top last:border-0"><td className="px-5 py-5"><div className="font-bold">{formatBookingDate(booking.date)} · {booking.slot}</div><div className="mt-1 text-xs text-white/50">{booking.detail}</div><span className="mt-3 inline-block rounded-full border border-white/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-white/50">{booking.type === "studio" ? "Studio" : "Congo"}</span></td><td className="px-5 py-5"><div className="font-bold">{booking.firstName} {booking.lastName}</div>{booking.message && <div className="mt-2 max-w-[220px] text-xs text-white/45">{booking.message}</div>}</td><td className="px-5 py-5 text-white/65"><div>{booking.email}</div><div className="mt-1">{booking.phone}</div></td><td className="px-5 py-5 text-xs"><div className={booking.clientEmailSentAt ? "text-secondaire" : "text-red-300"}>Client : {formatDate(booking.clientEmailSentAt)}</div><div className={`mt-2 ${booking.adminEmailSentAt ? "text-secondaire" : "text-red-300"}`}>Admin : {formatDate(booking.adminEmailSentAt)}</div><div className={`mt-2 ${booking.reviewEmailSentAt ? "text-secondaire" : "text-white/35"}`}>Avis : {formatDate(booking.reviewEmailSentAt)}</div></td><td className="px-5 py-5"><button disabled={pending} onClick={() => updateStatus(booking)} className={`rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-widest ${booking.status === "confirmed" ? "bg-secondaire/15 text-secondaire" : "bg-white/10 text-white/45 line-through"}`}>{booking.status === "confirmed" ? "Confirmée" : "Annulée"}</button>{rowErrors[booking.id] && <p className="mt-2 max-w-[180px] text-xs text-red-400">{rowErrors[booking.id]}</p>}</td><td className="px-5 py-5 text-right"><div className="flex flex-wrap justify-end gap-2"><button disabled={pending} onClick={() => openEdit(booking)} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-white/70">Modifier</button><button disabled={pending} onClick={() => resendEmails(booking)} className="rounded-lg border border-secondaire/30 bg-secondaire/10 px-3 py-2 text-xs text-secondaire">Renvoyer</button><button disabled={pending} onClick={() => sendReviewEmail(booking)} className="rounded-lg border border-sky-400/30 bg-sky-400/10 px-3 py-2 text-xs text-sky-200">{booking.reviewEmailSentAt ? "Renvoyer avis" : "Demander un avis"}</button><button disabled={pending} onClick={() => deleteBooking(booking)} className="rounded-lg border border-red-500/30 px-3 py-2 text-xs text-red-400">Supprimer</button></div></td></tr>; })}</tbody></table>{!filteredBookings.length && <p className="p-8 text-center text-white/45">Aucune réservation ne correspond à ces critères.</p>}</div>}
      </div>
      {editing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5"><div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#061c2b] p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-black uppercase tracking-widest text-secondaire">Modifier la réservation</p><h2 className="mt-2 text-2xl font-black">{editing.firstName} {editing.lastName}</h2></div><button onClick={() => setEditing(null)} className="text-2xl text-white/50">×</button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold uppercase tracking-widest text-white/50">Date<input type="date" value={editDate} onChange={(event) => setEditDate(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3 text-white" /></label><label className="text-xs font-bold uppercase tracking-widest text-white/50">Créneau<input type="time" step="1200" value={editSlot} onChange={(event) => setEditSlot(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3 text-white" /></label></div><label className="mt-4 block text-xs font-bold uppercase tracking-widest text-white/50">Note<textarea value={editMessage} onChange={(event) => setEditMessage(event.target.value)} rows={4} className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3 text-white" /></label><div className="mt-6 flex justify-end gap-3"><button onClick={() => setEditing(null)} className="rounded-lg border border-white/10 px-4 py-3 text-sm text-white/60">Annuler</button><button onClick={saveEdit} disabled={pendingRowId === editing.id} className="rounded-lg bg-secondaire px-4 py-3 text-sm font-black text-background">Enregistrer</button></div></div></div>}
    </main>
  );
}
