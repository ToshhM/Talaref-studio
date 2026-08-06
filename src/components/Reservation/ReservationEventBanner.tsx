"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { buildCongoEventSlots, getCongoEventDate } from "@/lib/eventDate";

export function ReservationEventBanner() {
  const eventDate = useMemo(() => getCongoEventDate(), []);
  const slots = useMemo(() => buildCongoEventSlots(), []);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [takenSlots, setTakenSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchTakenSlots = async () => {
    setIsLoadingSlots(true);
    try {
      const response = await fetch("/api/event-booking");
      const data = await response.json().catch(() => null);
      if (response.ok) {
        setTakenSlots(data?.takenSlots || []);
      }
    } catch {
      // Silent: worst case the slot grid just isn't pre-filtered.
    } finally {
      setIsLoadingSlots(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchTakenSlots();
  }, [isOpen]);

  const isSubmitDisabled =
    isSending ||
    isSuccess ||
    !selectedSlot ||
    !firstName.trim() ||
    !lastName.trim() ||
    !email.trim() ||
    !phone.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    setIsSending(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/event-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          slot: selectedSlot,
          eventDate: eventDate.label,
          message,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setErrorMessage(data?.error || "Erreur lors de l'envoi de votre réservation.");
        if (response.status === 409) {
          setSelectedSlot("");
          fetchTakenSlots();
        }
      }
    } catch {
      setErrorMessage("Une erreur de connexion est survenue.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mb-10 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl"
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-[#009543] via-[#FBDE4A] to-[#DC241F]" />

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full flex-col gap-5 p-6 text-left sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondaire/20 text-2xl">
            🇨🇬
          </span>
          <div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-secondaire">
              {eventDate.label} · Shooting Day
            </span>
            <h2 className="mt-1 text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
              Spécial Congolais — Congo Brazzaville
            </h2>
            <p className="mt-1 text-sm text-white/60">
              Une journée dédiée à votre culture, votre identité et votre fierté.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black uppercase tracking-widest text-white/80">
            De 9h à 22h
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black uppercase tracking-widest text-white/80">
            Créneaux de 20 min
          </span>
          <span className="rounded-full border border-secondaire/40 bg-secondaire/15 px-4 py-2 text-xs font-black uppercase tracking-widest text-secondaire">
            Gratuit
          </span>
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/60 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/10"
          >
            {isSuccess ? (
              <div className="p-6 text-center sm:p-8">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-lg font-black text-secondaire mb-2">
                  Créneau réservé !
                </h3>
                <p className="text-white/60 text-sm">
                  Votre créneau du {eventDate.label} à {selectedSlot} est enregistré. Vous recevrez une confirmation par email ou téléphone.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                <div className="space-y-3">
                  <span className="ml-1 text-xs font-black uppercase tracking-widest text-white/40">
                    Choisissez votre créneau ({eventDate.label}){isLoadingSlots ? " · chargement..." : ""}
                  </span>
                  <div className="grid grid-cols-3 gap-2 max-h-[220px] overflow-y-auto rounded-2xl border border-white/10 bg-[#121212] p-3 sm:grid-cols-5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10">
                    {slots.map((slot) => {
                      const isTaken = takenSlots.includes(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isTaken}
                          onClick={() => setSelectedSlot(slot)}
                          className={`rounded-xl px-3 py-2.5 text-sm font-bold transition-all ${
                            isTaken
                              ? "cursor-not-allowed text-white/15 line-through"
                              : selectedSlot === slot
                                ? "bg-secondaire text-background"
                                : "text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-3">
                    <span className="ml-1 text-xs font-black uppercase tracking-widest text-white/40">
                      Prénom
                    </span>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jean"
                      className="w-full rounded-2xl border border-white/10 bg-background px-5 py-4 text-white outline-none transition-all placeholder:text-white/25 focus:border-secondaire/60 focus:ring-4 focus:ring-secondaire/10"
                    />
                  </label>
                  <label className="block space-y-3">
                    <span className="ml-1 text-xs font-black uppercase tracking-widest text-white/40">
                      Nom
                    </span>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Dupont"
                      className="w-full rounded-2xl border border-white/10 bg-background px-5 py-4 text-white outline-none transition-all placeholder:text-white/25 focus:border-secondaire/60 focus:ring-4 focus:ring-secondaire/10"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block space-y-3">
                    <span className="ml-1 text-xs font-black uppercase tracking-widest text-white/40">
                      Email
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vous@domaine.com"
                      className="w-full rounded-2xl border border-white/10 bg-background px-5 py-4 text-white outline-none transition-all placeholder:text-white/25 focus:border-secondaire/60 focus:ring-4 focus:ring-secondaire/10"
                    />
                  </label>
                  <label className="block space-y-3">
                    <span className="ml-1 text-xs font-black uppercase tracking-widest text-white/40">
                      Téléphone
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="06 12 34 56 78"
                      className="w-full rounded-2xl border border-white/10 bg-background px-5 py-4 text-white outline-none transition-all placeholder:text-white/25 focus:border-secondaire/60 focus:ring-4 focus:ring-secondaire/10"
                    />
                  </label>
                </div>

                <label className="block space-y-3">
                  <span className="ml-1 text-xs font-black uppercase tracking-widest text-white/40">
                    Message (optionnel)
                  </span>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Votre lien avec le Congo, une précision..."
                    className="w-full resize-none rounded-2xl border border-white/10 bg-background px-5 py-4 text-white outline-none transition-all placeholder:text-white/25 focus:border-secondaire/60 focus:ring-4 focus:ring-secondaire/10"
                  />
                </label>

                {errorMessage && (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-center text-sm text-red-400">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className={`w-full rounded-2xl px-6 py-5 text-base font-black uppercase tracking-widest transition-all shadow-xl ${
                    isSubmitDisabled
                      ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                      : "bg-secondaire text-background shadow-secondaire/10 hover:brightness-110 active:scale-[0.98]"
                  }`}
                >
                  {isSending ? "Envoi en cours..." : "Réserver mon créneau gratuit"}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
