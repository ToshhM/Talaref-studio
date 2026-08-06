"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buildCongoEventSlots } from "@/lib/eventDate";
import type { EventBooking } from "@/lib/database.types";

const slots = buildCongoEventSlots();

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<EventBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});
  const [pendingRowId, setPendingRowId] = useState<string | null>(null);

  const loadBookings = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/admin/event-bookings");
      const data = await response.json().catch(() => null);

      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        setErrorMessage(data?.error || "Erreur lors du chargement.");
        return;
      }

      setBookings(data?.bookings || []);
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

  const patchBooking = async (id: string, updates: Record<string, unknown>) => {
    setPendingRowId(id);
    setRowErrors((prev) => ({ ...prev, [id]: "" }));

    try {
      const response = await fetch(`/api/admin/event-bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setRowErrors((prev) => ({ ...prev, [id]: data?.error || "Erreur." }));
        return;
      }

      setBookings((prev) => prev.map((b) => (b.id === id ? data.booking : b)));
    } catch {
      setRowErrors((prev) => ({ ...prev, [id]: "Erreur de connexion." }));
    } finally {
      setPendingRowId(null);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Supprimer définitivement cette réservation ?")) return;

    setPendingRowId(id);
    try {
      const response = await fetch(`/api/admin/event-bookings/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setRowErrors((prev) => ({ ...prev, [id]: data?.error || "Erreur." }));
        return;
      }

      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch {
      setRowErrors((prev) => ({ ...prev, [id]: "Erreur de connexion." }));
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
              Admin · Shooting Day Congolais
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

        {isLoading ? (
          <p className="text-white/50">Chargement...</p>
        ) : errorMessage ? (
          <p className="text-red-400">{errorMessage}</p>
        ) : bookings.length === 0 ? (
          <p className="text-white/50">Aucune réservation pour le moment.</p>
        ) : (
          <div className="overflow-x-auto rounded-[1.5rem] border border-white/10 bg-white/[0.03]">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-white/40">
                  <th className="px-5 py-4 font-black">Client</th>
                  <th className="px-5 py-4 font-black">Contact</th>
                  <th className="px-5 py-4 font-black">Créneau</th>
                  <th className="px-5 py-4 font-black">Statut</th>
                  <th className="px-5 py-4 font-black">Message</th>
                  <th className="px-5 py-4 font-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const isPending = pendingRowId === booking.id;
                  const rowError = rowErrors[booking.id];

                  return (
                    <tr key={booking.id} className="border-b border-white/5 align-top last:border-0">
                      <td className="px-5 py-4 font-bold">
                        {booking.first_name} {booking.last_name}
                      </td>
                      <td className="px-5 py-4 text-white/60">
                        <div>{booking.email}</div>
                        <div>{booking.phone}</div>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={booking.slot}
                          disabled={isPending}
                          onChange={(e) => patchBooking(booking.id, { slot: e.target.value })}
                          className="rounded-xl border border-white/10 bg-background px-3 py-2 text-white outline-none focus:border-secondaire/60"
                        >
                          {slots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                        {rowError && (
                          <p className="mt-1 max-w-[180px] text-xs text-red-400">{rowError}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() =>
                            patchBooking(booking.id, {
                              status: booking.status === "confirmed" ? "cancelled" : "confirmed",
                            })
                          }
                          className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${
                            booking.status === "confirmed"
                              ? "border border-secondaire/40 bg-secondaire/15 text-secondaire"
                              : "border border-white/10 bg-white/[0.06] text-white/40 line-through"
                          }`}
                        >
                          {booking.status === "confirmed" ? "Confirmé" : "Annulé"}
                        </button>
                      </td>
                      <td className="px-5 py-4 max-w-[220px] text-white/50">
                        {booking.message || "—"}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => deleteBooking(booking.id)}
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
