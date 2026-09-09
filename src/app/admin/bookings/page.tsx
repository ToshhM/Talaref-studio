"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDurationHours } from "@/lib/duration";
import type { EventBooking, StudioBooking } from "@/lib/database.types";

type BookingType = "studio" | "congo";

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
};

function toUnified(studio: StudioBooking[], congo: EventBooking[]): UnifiedBooking[] {
  const fromStudio: UnifiedBooking[] = studio.map((b) => ({
    id: b.id,
    type: "studio",
    firstName: b.first_name,
    lastName: b.last_name,
    email: b.email,
    phone: b.phone || "—",
    date: b.formatted_date || b.booking_date,
    slot: b.slot,
    detail: `${b.service} · ${formatDurationHours(Number(b.duration))} · ${(b.amount_paid_cents / 100)
      .toFixed(2)
      .replace(".", ",")} € ${b.payment_mode === "deposit" ? "(acompte)" : ""}`.trim(),
    message: b.message,
    status: b.status,
  }));

  const fromCongo: UnifiedBooking[] = congo.map((b) => ({
    id: b.id,
    type: "congo",
    firstName: b.first_name,
    lastName: b.last_name,
    email: b.email,
    phone: b.phone,
    date: b.event_date,
    slot: b.slot,
    detail: "Shooting Day Congolais · Gratuit",
    message: b.message,
    status: b.status,
  }));

  return [...fromStudio, ...fromCongo].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1;
    return a.slot < b.slot ? -1 : a.slot > b.slot ? 1 : 0;
  });
}

export default function AdminBookingsPage() {
  const router = useRouter();
  const [studioBookings, setStudioBookings] = useState<StudioBooking[]>([]);
  const [congoBookings, setCongoBookings] = useState<EventBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});
  const [pendingRowId, setPendingRowId] = useState<string | null>(null);

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

      // On affiche ce qui a pu être chargé plutôt que de tout bloquer si une
      // seule des deux sources échoue (ex: table studio_bookings pas encore créée).
      if (studioRes.ok) setStudioBookings(studioData?.bookings || []);
      if (congoRes.ok) setCongoBookings(congoData?.bookings || []);

      if (!studioRes.ok && !congoRes.ok) {
        setErrorMessage(
          studioData?.error || congoData?.error || "Erreur lors du chargement."
        );
      } else if (!studioRes.ok) {
        setErrorMessage(`Réservations studio non chargées : ${studioData?.error || "erreur inconnue"}`);
      } else if (!congoRes.ok) {
        setErrorMessage(`Réservations Congo non chargées : ${congoData?.error || "erreur inconnue"}`);
      }
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

  const bookings = useMemo(
    () => toUnified(studioBookings, congoBookings),
    [studioBookings, congoBookings]
  );

  const endpointFor = (type: BookingType, id: string) =>
    type === "studio" ? `/api/admin/studio-bookings/${id}` : `/api/admin/event-bookings/${id}`;

  const toggleStatus = async (row: UnifiedBooking) => {
    const nextStatus = row.status === "confirmed" ? "cancelled" : "confirmed";
    setPendingRowId(row.id);
    setRowErrors((prev) => ({ ...prev, [row.id]: "" }));

    try {
      const response = await fetch(endpointFor(row.type, row.id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setRowErrors((prev) => ({ ...prev, [row.id]: data?.error || "Erreur." }));
        return;
      }

      if (row.type === "studio") {
        setStudioBookings((prev) => prev.map((b) => (b.id === row.id ? data.booking : b)));
      } else {
        setCongoBookings((prev) => prev.map((b) => (b.id === row.id ? data.booking : b)));
      }
    } catch {
      setRowErrors((prev) => ({ ...prev, [row.id]: "Erreur de connexion." }));
    } finally {
      setPendingRowId(null);
    }
  };

  const deleteBooking = async (row: UnifiedBooking) => {
    if (!confirm("Supprimer définitivement cette réservation ?")) return;

    setPendingRowId(row.id);
    try {
      const response = await fetch(endpointFor(row.type, row.id), { method: "DELETE" });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setRowErrors((prev) => ({ ...prev, [row.id]: data?.error || "Erreur." }));
        return;
      }

      if (row.type === "studio") {
        setStudioBookings((prev) => prev.filter((b) => b.id !== row.id));
      } else {
        setCongoBookings((prev) => prev.filter((b) => b.id !== row.id));
      }
    } catch {
      setRowErrors((prev) => ({ ...prev, [row.id]: "Erreur de connexion." }));
    } finally {
      setPendingRowId(null);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  return (
    <main className="min-h-screen bg-background px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-secondaire">
              Admin · Talaref Studio
            </span>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight">
              Réservations
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-full border border-white/10 bg-white/[0.06] px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white/70 transition-colors hover:text-white"
          >
            Déconnexion
          </button>
        </div>

        {errorMessage && !isLoading && (
          <p className="mb-6 text-red-400">{errorMessage}</p>
        )}

        {isLoading ? (
          <p className="text-white/50">Chargement...</p>
        ) : bookings.length === 0 ? (
          <p className="text-white/50">Aucune réservation pour le moment.</p>
        ) : (
          <div className="overflow-x-auto rounded-[1.5rem] border border-white/10 bg-white/[0.03]">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-white/40">
                  <th className="px-5 py-4 font-black">Type</th>
                  <th className="px-5 py-4 font-black">Client</th>
                  <th className="px-5 py-4 font-black">Contact</th>
                  <th className="px-5 py-4 font-black">Date · Créneau</th>
                  <th className="px-5 py-4 font-black">Détail</th>
                  <th className="px-5 py-4 font-black">Statut</th>
                  <th className="px-5 py-4 font-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((row) => {
                  const isPending = pendingRowId === row.id;
                  const rowError = rowErrors[row.id];

                  return (
                    <tr key={`${row.type}-${row.id}`} className="border-b border-white/5 align-top last:border-0">
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${
                            row.type === "studio"
                              ? "border border-secondaire/40 bg-secondaire/15 text-secondaire"
                              : "border border-white/10 bg-white/[0.06] text-white/60"
                          }`}
                        >
                          {row.type === "studio" ? "Studio (payant)" : "Congo (gratuit)"}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold">
                        {row.firstName} {row.lastName}
                      </td>
                      <td className="px-5 py-4 text-white/60">
                        <div>{row.email}</div>
                        <div>{row.phone}</div>
                      </td>
                      <td className="px-5 py-4 text-white/80">
                        <div>{row.date}</div>
                        <div className="text-white/50">{row.slot}</div>
                      </td>
                      <td className="px-5 py-4 max-w-[240px] text-white/60">
                        <div>{row.detail}</div>
                        {row.message && (
                          <div className="mt-1 text-white/40">{row.message}</div>
                        )}
                        {rowError && <p className="mt-1 text-xs text-red-400">{rowError}</p>}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => toggleStatus(row)}
                          className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${
                            row.status === "confirmed"
                              ? "border border-secondaire/40 bg-secondaire/15 text-secondaire"
                              : "border border-white/10 bg-white/[0.06] text-white/40 line-through"
                          }`}
                        >
                          {row.status === "confirmed" ? "Confirmé" : "Annulé"}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => deleteBooking(row)}
                          className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
