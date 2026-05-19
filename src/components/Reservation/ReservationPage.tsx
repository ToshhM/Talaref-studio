"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Turnstile } from '@marsidev/react-turnstile';
// Ajuste le chemin si besoin (ex: "../lib/priceCalculator" si tu n'utilises pas l'alias "@")
import { calculateBookingPrice } from "@/lib/priceCalculator";

type Service = {
  id: string;
  title: string;
  eyebrow: string;
  durationText: string;
  baseDuration: number;
  price: string;
  description: string;
  includes: string[];
};

const services: Service[] = [
  {
    id: "shooting-corporate",
    title: "Shooting Corporate",
    eyebrow: "Pro / Entreprise",
    durationText: "Sur mesure",
    baseDuration: 1,
    price: "À partir de 130€/h",
    description: "Séance de shooting corporate professionnel. 15 photos retouchées incluant retouches couleurs et édition premium.",
    includes: ["Direction de pose", "15 photos retouchées", "Édition premium", "Livraison rapide"],
  },
  {
    id: "location-studio",
    title: "Location Du Studio",
    eyebrow: "Espace brut",
    durationText: "Sur mesure",
    baseDuration: 1,
    price: "À partir de 52€/h",
    description: "Location horaire, demi-journée, journée, événements, workshop. Ouvert 24/7.",
    includes: ["Accès plateau", "Lumières de base", "Espace loge", "Wifi Haut Débit"],
  },
  {
    id: "prestation-photographe",
    title: "Prestation Avec Photographe",
    eyebrow: "Sur mesure",
    durationText: "Sur mesure",
    baseDuration: 1,
    price: "À partir de 130€/h",
    description: "Shooting photo, tournage vidéo, événement, corporate, social media.",
    includes: ["Photographe pro", "Matériel inclus", "Direction artistique", "Galerie privée"],
  },
  {
    id: "podcasts",
    title: "Podcasts",
    eyebrow: "Clé en main",
    durationText: "Au forfait",
    baseDuration: 1,
    price: "Forfait dès 490€",
    description: "Enregistrement 4K, setup complet, opérateur, montage et nettoyage audio inclus.",
    includes: ["Studio + Opérateur", "Enregistrement 4K", "Montage inclus", "Nettoyage Audio"],
  },
  {
    id: "formations",
    title: "Formations Créatives",
    eyebrow: "Apprentissage",
    durationText: "Forfaits fixes",
    baseDuration: 4,
    price: "À partir de 250€",
    description: "Photo, vidéo, IA pour entrepreneurs, création de contenu, business créatif.",
    includes: ["Support de cours", "Pratique en studio", "Suivi personnalisé", "Réseautage"],
  },
];

const publicEmailDomains = [
  'gmail.com', 'yahoo.com', 'yahoo.fr', 'outlook.com', 'outlook.fr',
  'hotmail.com', 'hotmail.fr', 'orange.fr', 'free.fr', 'sfr.fr',
  'bbox.fr', 'icloud.com', 'me.com', 'mac.com', 'live.com', 'live.fr',
  'protonmail.com', 'proton.me', 'wanadoo.fr'
];

const weekDays = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];
const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const currentYear = new Date().getFullYear();
const yearsList = Array.from({ length: 12 }, (_, i) => currentYear + i);

export function ReservationPage() {
  const [selectedServiceId, setSelectedServiceId] = useState(services[0].id);
  const [selectedDuration, setSelectedDuration] = useState<number>(services[0].baseDuration);
  const [paymentMode, setPaymentMode] = useState<"full" | "deposit">("full");

  const [bookingDate, setBookingDate] = useState<Date | null>(null);
  const [dateInputValue, setDateInputValue] = useState("");
  const [dateErrorMessage, setDateErrorMessage] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [isDurationOpen, setIsDurationOpen] = useState(false);

  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<"days" | "months" | "years">("days");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userSiret, setUserSiret] = useState("");
  const [userMessage, setUserMessage] = useState("");

  // États pour la logique d'entreprise
  const [isProEmail, setIsProEmail] = useState(false);
  const [isBypassProEmail, setIsBypassProEmail] = useState(false);

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) ?? services[0],
    [selectedServiceId]
  );

  // Fonction appelée uniquement quand l'utilisateur quitte le champ email (onBlur)
  const checkEmailDomain = (email: string) => {
    if (!email || !email.includes('@')) {
      setIsProEmail(false);
      setIsBypassProEmail(false);
      setUserSiret("");
      return;
    }

    const parts = email.split('@');
    if (parts.length !== 2) return;

    const domain = parts[1].toLowerCase();

    // On vérifie s'il y a bien un point et une extension valide
    const domainParts = domain.split('.');
    if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
      setIsProEmail(false);
      setIsBypassProEmail(false);
      setUserSiret("");
      return;
    }

    // Si le domaine n'est pas dans la liste publique -> c'est un pro
    const nextIsProEmail = !publicEmailDomains.includes(domain);
    setIsProEmail(nextIsProEmail);
    if (!nextIsProEmail) {
      setIsBypassProEmail(false);
      setUserSiret("");
    }
  };

  // Options de durées adaptatives
  const durationOptions = useMemo(() => {
    if (selectedServiceId === "formations") return [4, 8];
    if (selectedServiceId === "podcasts") return [1, 2, 3, 4];
    return Array.from({length: 10}, (_, i) => i + 1);
  }, [selectedServiceId]);

  // Recalcul du prix en live via le cerveau backend
  const totalBasePrice = useMemo(() => {
    const isEnterprise = isProEmail && !isBypassProEmail;
    return calculateBookingPrice(
      selectedService.title,
      selectedDuration,
      selectedSlot || "09:00",
      isEnterprise
    );
  }, [selectedService.title, selectedDuration, selectedSlot, isProEmail, isBypassProEmail]);

  const dynamicPrice = useMemo(() => {
    let price = totalBasePrice;
    if (paymentMode === "deposit") price = totalBasePrice * 0.3;
    return Number.isInteger(price) ? price.toString() : price.toFixed(2).replace('.', ',');
  }, [totalBasePrice, paymentMode]);

  // Génération des créneaux 24/7 (00:00 à 23:30)
  const availableTimeSlots = useMemo(() => {
    if (!bookingDate) return [];
    const slots = [];
    for (let h = 0; h < 24; h++) {
      slots.push(`${h.toString().padStart(2, "0")}:00`);
      slots.push(`${h.toString().padStart(2, "0")}:30`);
    }
    return slots;
  }, [bookingDate]);

  const daysInMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const nextMonth = () => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDateErrorMessage("");

    if (val.length < dateInputValue.length) {
      setDateInputValue(val);
      setBookingDate(null);
      setSelectedSlot("");
      return;
    }

    const raw = val.replace(/\D/g, '');
    let day = raw.substring(0, 2);
    let month = raw.substring(2, 4);
    let year = raw.substring(4, 8);

    if (day.length === 1 && parseInt(day) > 3) day = `0${day}`;
    if (day.length === 2 && parseInt(day) > 31) day = day.substring(0, 1);
    if (day.length === 2 && day === '00') day = '01';

    if (month.length === 1 && parseInt(month) > 1) month = `0${month}`;
    if (month.length === 2 && parseInt(month) > 12) month = month.substring(0, 1);
    if (month.length === 2 && month === '00') month = '01';

    if (year.length > 0) {
      const yearPrefix = currentYear.toString().substring(0, year.length);
      if (year < yearPrefix) year = year.substring(0, year.length - 1);
    }

    let finalStr = day;
    if (raw.length >= 3) finalStr += '/' + month;
    if (raw.length >= 5) finalStr += '/' + year;

    setDateInputValue(finalStr);

    if (finalStr.length === 10) {
      const y = parseInt(year, 10);
      const m = parseInt(month, 10) - 1;
      const d = parseInt(day, 10);

      const parsedDate = new Date(y, m, d);
      const isValidDate = parsedDate.getFullYear() === y && parsedDate.getMonth() === m && parsedDate.getDate() === d;
      const isNotPast = parsedDate.setHours(0,0,0,0) >= new Date().setHours(0,0,0,0);

      if (isValidDate && y >= currentYear && isNotPast) {
        setBookingDate(parsedDate);
        setCurrentMonthDate(parsedDate);
        setSelectedSlot("");
      } else {
        setBookingDate(null);
        setSelectedSlot("");
        setDateErrorMessage("Date incorrecte ou passée.");
      }
    } else {
      setBookingDate(null);
      setSelectedSlot("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
        setCalendarView("days");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDateSummary = (date: Date | null) => {
    if (!date) return null;
    const formatted = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    return formatted.replace(/(^|\s)1(\s)/, '$11er$2');
  };

  const isSiretRequired = isProEmail && !isBypassProEmail;
  // Ajout de !userPhone dans la vérification de la soumission
  const isSubmitDisabled = isSending || !captchaToken || isSuccess || !bookingDate || !selectedSlot || !userPhone || (isSiretRequired && !userSiret);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitDisabled) {
      alert("Veuillez remplir tous les champs obligatoires et valider le captcha.");
      return;
    }

    setIsSending(true);

    try {
      const year = bookingDate.getFullYear();
      const month = String(bookingDate.getMonth() + 1).padStart(2, '0');
      const day = String(bookingDate.getDate()).padStart(2, '0');
      const strictDate = `${year}-${month}-${day}`;
      const prettyDate = formatDateSummary(bookingDate);

      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: userEmail,
          phone: userPhone, // Envoi du numéro au backend
          siret: isSiretRequired ? userSiret : undefined,
          service: selectedService.title,
          date: strictDate,
          formattedDate: prettyDate,
          slot: selectedSlot,
          duration: selectedDuration,
          paymentMode: paymentMode,
          message: userMessage,
          captchaToken: captchaToken
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsSuccess(true);
        if (data.url) window.location.href = data.url;
      } else {
        alert("Erreur lors de la préparation de la réservation. Vérifiez vos informations et réessayez.");
        setIsSending(false);
      }
    } catch (error) {
      console.error("Erreur booking:", error);
      alert("Une erreur de connexion est survenue.");
      setIsSending(false);
    }
  };

  const viewVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  };

  return (
    <section className="min-h-screen bg-background px-6 pb-24 pt-36 text-white relative overflow-hidden">
      <div className="absolute left-1/2 top-0 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-principale/20 blur-[150px]" />
      <div className="absolute bottom-20 right-0 h-[420px] w-[420px] rounded-full bg-secondaire/10 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-secondaire">Réservation studio</span>
            <h1 className="mt-5 max-w-4xl text-5xl font-black uppercase tracking-tighter md:text-7xl">Planifiez votre prochaine prise de vue.</h1>
          </div>

          <div className="flex flex-col gap-6 lg:justify-self-end w-full max-w-2xl">
            <p className="text-lg leading-8 text-white/60">
              Choisissez une prestation, proposez un créneau et laissez-nous préparer la suite.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4">

              {/* BADGE ADRESSE */}
              <div className="flex flex-1 items-center gap-5 rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondaire/20 text-secondaire">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Talaref Studio</h3>
                  <p className="text-lg font-black text-white">5 Rue Bellanger, Levallois</p>
                </div>
              </div>

              {/* BADGE 24/7 LIVE */}
              <div className="flex flex-1 items-center gap-5 rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondaire/20 text-secondaire relative">
                  <span className="absolute right-0 top-0 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Ouverture</h3>
                  <p className="text-xl font-black text-white uppercase tracking-wider">24h/24 - 7j/7</p>
                </div>
              </div>

            </div>
          </div>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.55 }} className="rounded-[2rem] border border-white/10 bg-principale/15 p-4 backdrop-blur-2xl md:p-6 h-fit">
            <div className="grid gap-4">
              {services.map((service) => {
                const isSelected = selectedServiceId === service.id;
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => {
                      setSelectedServiceId(service.id);
                      setSelectedDuration(service.baseDuration);
                      setPaymentMode("full");
                    }}
                    className={`group rounded-[1.5rem] border p-6 text-left transition-all ${
                      isSelected ? "border-secondaire bg-secondaire text-background shadow-xl shadow-secondaire/10" : "border-white/10 bg-background/70 text-white hover:border-secondaire/40"
                    }`}
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div>
                        <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isSelected ? "text-background/60" : "text-secondaire"}`}>{service.eyebrow}</span>
                        <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">{service.title}</h2>
                        <p className={`mt-3 max-w-2xl leading-7 ${isSelected ? "text-background/70" : "text-white/55"}`}>{service.description}</p>
                      </div>
                      <div className="shrink-0 md:text-right">
                        <p className="text-sm font-black uppercase tracking-widest">{service.durationText}</p>
                        <p className={`mt-2 text-sm font-bold ${isSelected ? "text-background/70" : "text-white/45"}`}>{service.price}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          <motion.aside initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.55 }} className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl md:p-8 h-fit">
            <div className="flex items-start justify-between gap-6 mb-8">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/35">Votre demande</span>
                <h2 className="mt-3 text-3xl font-black tracking-tight">Créneau souhaité</h2>
              </div>
              <div className="rounded-2xl bg-secondaire px-4 py-3 text-center text-background min-w-[90px]">
                <span className="block text-[10px] font-black uppercase tracking-widest">Durée</span>
                <span className="block text-xl font-black">{selectedDuration}h</span>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleBooking}>
              <div className="grid gap-6 sm:grid-cols-2">

                {/* CALENDRIER */}
                <div className="relative space-y-3 z-30" ref={calendarRef}>
                  <span className="ml-1 text-xs font-black uppercase tracking-widest text-white/40">Date</span>
                  <div className="relative">
                    <div className={`relative flex w-full items-center rounded-2xl border px-5 py-4 text-white transition-all ${dateErrorMessage ? "border-red-500 bg-red-500/5 ring-4 ring-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "border-white/10 bg-background hover:border-secondaire/40 focus-within:border-secondaire/60 focus-within:ring-4 focus-within:ring-secondaire/10"}`}>
                      <input type="text" placeholder="JJ/MM/AAAA" value={dateInputValue} onChange={handleDateInputChange} onFocus={() => { setIsCalendarOpen(true); setIsTimeOpen(false); setIsDurationOpen(false); }} className="w-full bg-transparent outline-none placeholder:text-white/25"/>
                      <button type="button" onClick={() => {setIsCalendarOpen(!isCalendarOpen); setIsTimeOpen(false); setIsDurationOpen(false); }} className="ml-2 text-white/40 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                      </button>
                    </div>
                    <AnimatePresence>
                      {dateErrorMessage && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute -bottom-6 left-2 text-xs font-bold text-red-500">{dateErrorMessage}</motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <AnimatePresence>
                    {isCalendarOpen && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute left-0 top-[90px] w-full min-w-[300px] rounded-2xl border border-white/10 bg-[#121212] p-5 shadow-2xl overflow-hidden">
                        <div className="mb-4 flex items-center justify-between relative z-10">
                          <button type="button" onClick={calendarView === "days" ? prevMonth : undefined} className={`rounded-lg p-2 ${calendarView !== "days" ? "opacity-0 cursor-default" : "hover:bg-white/10"}`}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
                          <button type="button" onClick={() => setCalendarView(calendarView === "days" ? "years" : "days")} className="font-bold capitalize text-white hover:text-secondaire transition-colors">
                            {calendarView === "days" ? new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentMonthDate) : calendarView === "years" ? "Choisir l'année" : "Choisir le mois"}
                          </button>
                          <button type="button" onClick={calendarView === "days" ? nextMonth : undefined} className={`rounded-lg p-2 ${calendarView !== "days" ? "opacity-0 cursor-default" : "hover:bg-white/10"}`}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
                        </div>

                        <div className="relative min-h-[220px]">
                          <AnimatePresence mode="wait">
                            {calendarView === "days" && (
                              <motion.div key="days" variants={viewVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.15 }} className="absolute w-full">
                                <div className="grid grid-cols-7 gap-1 text-center mb-2">{weekDays.map(day => <span key={day} className="text-xs font-bold text-white/40">{day}</span>)}</div>
                                <div className="grid grid-cols-7 gap-1">
                                  {Array.from({ length: startOffset }).map((_, i) => <div key={`empty-${i}`} />)}
                                  {days.map((day) => {
                                    const dateObj = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), day);
                                    const isPast = dateObj.setHours(0,0,0,0) < new Date().setHours(0,0,0,0);
                                    const isSelected = bookingDate?.getTime() === dateObj.getTime();

                                    return (
                                      <button
                                        key={day}
                                        type="button"
                                        disabled={isPast}
                                        onClick={() => {
                                          setBookingDate(dateObj);
                                          setSelectedSlot("");
                                          setDateInputValue(`${String(day).padStart(2, '0')}/${String(currentMonthDate.getMonth() + 1).padStart(2, '0')}/${currentMonthDate.getFullYear()}`);
                                          setDateErrorMessage("");
                                          setIsCalendarOpen(false);
                                        }}
                                        className={`aspect-square rounded-xl text-sm transition-all ${isPast ? "text-white/10 cursor-not-allowed" : isSelected ? "bg-secondaire font-bold text-background" : "text-white hover:bg-white/10"}`}
                                      >
                                        {day}
                                      </button>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}

                            {calendarView === "years" && (
                              <motion.div key="years" variants={viewVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.15 }} className="absolute w-full">
                                <div className="grid grid-cols-3 gap-2">
                                  {yearsList.map((year) => (
                                    <button key={year} type="button" onClick={() => { const newDate = new Date(currentMonthDate); newDate.setFullYear(year); setCurrentMonthDate(newDate); setCalendarView("months"); }} className={`rounded-xl py-4 text-sm font-bold transition-all hover:bg-white/10 ${currentMonthDate.getFullYear() === year ? "bg-secondaire/20 text-secondaire" : "text-white"}`}>{year}</button>
                                  ))}
                                </div>
                              </motion.div>
                            )}

                            {calendarView === "months" && (
                              <motion.div key="months" variants={viewVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.15 }} className="absolute w-full">
                                <div className="grid grid-cols-3 gap-2">
                                  {monthNames.map((month, index) => (
                                    <button key={month} type="button" onClick={() => { const newDate = new Date(currentMonthDate); newDate.setMonth(index); setCurrentMonthDate(newDate); setCalendarView("days"); }} className={`rounded-xl py-4 text-sm font-bold capitalize transition-all hover:bg-white/10 ${currentMonthDate.getMonth() === index ? "bg-secondaire/20 text-secondaire" : "text-white"}`}>{month.slice(0, 3)}</button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* CRÉNEAU */}
                <div className="relative space-y-3 z-20">
                  <span className="ml-1 text-xs font-black uppercase tracking-widest text-white/40">Créneau</span>
                  <button type="button" disabled={!bookingDate} onClick={() => { setIsTimeOpen(!isTimeOpen); setIsCalendarOpen(false); setIsDurationOpen(false); }} className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-white outline-none transition-all ${!bookingDate ? "border-white/5 bg-white/5 cursor-not-allowed text-white/30" : "border-white/10 bg-background hover:border-secondaire/40 focus:border-secondaire/60 focus:ring-4 focus:ring-secondaire/10"}`}>
                    <span>{!bookingDate ? "Choisissez une date" : selectedSlot || "Créneau"}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={!bookingDate ? "text-white/20" : "text-white/40"}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </button>

                  <AnimatePresence>
                    {isTimeOpen && bookingDate && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute left-0 top-[80px] w-full max-h-[260px] overflow-y-auto rounded-2xl border border-white/10 bg-[#121212] p-2 shadow-2xl [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10">
                        <div className="grid grid-cols-2 gap-2">
                          {availableTimeSlots.map((slot) => (
                            <button key={slot} type="button" onClick={() => { setSelectedSlot(slot); setIsTimeOpen(false); }} className={`rounded-xl px-4 py-3 text-sm font-bold transition-all ${selectedSlot === slot ? "bg-secondaire text-background" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>{slot}</button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* DURÉE */}
              <div className="relative space-y-3 z-10">
                <span className="ml-1 text-xs font-black uppercase tracking-widest text-white/40">Durée de la séance</span>
                <button type="button" onClick={() => { setIsDurationOpen(!isDurationOpen); setIsTimeOpen(false); setIsCalendarOpen(false); }} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-background px-5 py-4 text-white outline-none transition-all hover:border-secondaire/40 focus:border-secondaire/60 focus:ring-4 focus:ring-secondaire/10">
                  <span>{selectedDuration} {selectedDuration > 1 ? 'heures' : 'heure'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </button>

                <AnimatePresence>
                  {isDurationOpen && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute left-0 top-[80px] w-full max-h-[200px] overflow-y-auto rounded-2xl border border-white/10 bg-[#121212] p-2 shadow-2xl [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10">
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {durationOptions.map((opt) => (
                          <button key={opt} type="button" onClick={() => { setSelectedDuration(opt); setIsDurationOpen(false); }} className={`rounded-xl px-4 py-3 text-sm font-bold transition-all ${selectedDuration === opt ? "bg-secondaire text-background" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
                            {opt} {opt > 1 ? 'heures' : 'heure'}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* TYPE DE PAIEMENT */}
              <div className="relative space-y-3 z-0">
                <span className="ml-1 text-xs font-black uppercase tracking-widest text-white/40">Type de paiement</span>
                <div className="relative flex w-full rounded-2xl border border-white/10 bg-[#121212] p-1 shadow-inner">
                  {['full', 'deposit'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMode(mode as "full" | "deposit")}
                      className={`relative z-10 w-1/2 rounded-xl py-3 text-sm font-bold transition-colors duration-300 ${
                        paymentMode === mode ? "text-background" : "text-white/40 hover:text-white"
                      }`}
                    >
                      {paymentMode === mode && (
                        <motion.div
                          layoutId="paymentToggle"
                          className="absolute inset-0 -z-10 rounded-xl bg-secondaire shadow-md"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      {mode === "full" ? "Complet" : "Acompte (30%)"}
                    </button>
                  ))}
                </div>
              </div>

              {/* INFOS PERSONNELLES */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-3">
                  <span className="ml-1 text-xs font-black uppercase tracking-widest text-white/40">Prénom</span>
                  <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jean" className="w-full rounded-2xl border border-white/10 bg-background px-5 py-4 text-white outline-none transition-all placeholder:text-white/25 focus:border-secondaire/60 focus:ring-4 focus:ring-secondaire/10"/>
                </label>
                <label className="block space-y-3">
                  <span className="ml-1 text-xs font-black uppercase tracking-widest text-white/40">Nom</span>
                  <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Dupont" className="w-full rounded-2xl border border-white/10 bg-background px-5 py-4 text-white outline-none transition-all placeholder:text-white/25 focus:border-secondaire/60 focus:ring-4 focus:ring-secondaire/10"/>
                </label>
              </div>

              {/* GRILLE EMAIL + TÉLÉPHONE */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-3">
                  <span className="ml-1 text-xs font-black uppercase tracking-widest text-white/40">Email</span>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => {
                      setUserEmail(e.target.value);
                      if (!e.target.value) setIsProEmail(false);
                    }}
                    onBlur={(e) => checkEmailDomain(e.target.value)}
                    placeholder="vous@domaine.com"
                    className="w-full rounded-2xl border border-white/10 bg-background px-5 py-4 text-white outline-none transition-all placeholder:text-white/25 focus:border-secondaire/60 focus:ring-4 focus:ring-secondaire/10"
                  />
                </label>

                <label className="block space-y-3">
                  <span className="ml-1 text-xs font-black uppercase tracking-widest text-white/40">Téléphone</span>
                  <input
                    type="tel"
                    required
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="06 12 34 56 78"
                    className="w-full rounded-2xl border border-white/10 bg-background px-5 py-4 text-white outline-none transition-all placeholder:text-white/25 focus:border-secondaire/60 focus:ring-4 focus:ring-secondaire/10"
                  />
                </label>
              </div>

              {/* CHAMP SIRET DYNAMIQUE & BYPASS (ANIMATIONS FLUIDES) */}
              <AnimatePresence mode="wait">
                {isProEmail && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="block overflow-hidden"
                  >
                    <div className="pt-2 pb-1 space-y-4">
                      {/* AnimatePresence imbriqué juste pour l'input SIRET */}
                      <AnimatePresence initial={false}>
                        {!isBypassProEmail && (
                          <motion.label
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="block space-y-3 overflow-hidden"
                          >
                            <span className="ml-1 text-xs font-black uppercase tracking-widest text-secondaire">SIRET Entreprise (Obligatoire)</span>
                            <input
                              type="text"
                              required={isProEmail && !isBypassProEmail}
                              value={userSiret}
                              onChange={(e) => setUserSiret(e.target.value)}
                              placeholder="14 chiffres sans espaces"
                              maxLength={14}
                              className="w-full rounded-2xl border border-secondaire/40 bg-secondaire/5 px-5 py-4 text-white outline-none transition-all placeholder:text-white/25 focus:border-secondaire focus:ring-4 focus:ring-secondaire/20"
                            />
                          </motion.label>
                        )}
                      </AnimatePresence>

                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isBypassProEmail}
                          onChange={(e) => setIsBypassProEmail(e.target.checked)}
                          className="mt-1 h-4 w-4 rounded border-white/20 bg-background text-secondaire focus:ring-secondaire focus:ring-offset-background transition-all"
                        />
                        <span className="text-xs text-white/50 leading-relaxed">
                          Je suis un particulier (étudiant, usage privé) ou je n&apos;ai pas besoin d&apos;une facture au nom d&apos;une entreprise.
                        </span>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <label className="block space-y-3">
                <span className="ml-1 text-xs font-black uppercase tracking-widest text-white/40">Informations complémentaires</span>
                <textarea rows={4} value={userMessage} onChange={(e) => setUserMessage(e.target.value)} placeholder="Lieu, objectif, format souhaité..." className="w-full resize-none rounded-2xl border border-white/10 bg-background px-5 py-4 text-white outline-none transition-all placeholder:text-white/25 focus:border-secondaire/60 focus:ring-4 focus:ring-secondaire/10"/>
              </label>

              {/* RÉSUMÉ */}
              <div className="rounded-2xl border border-white/10 bg-background/70 p-5">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondaire">Résumé</span>
                <div className="mt-4 space-y-3 text-sm text-white/65">
                  <p className="flex justify-between gap-4"><span>Prestation</span><strong className="text-right text-white">{selectedService.title}</strong></p>
                  <p className="flex justify-between gap-4"><span>Date</span><strong className="text-right text-white capitalize">{formatDateSummary(bookingDate) || "À définir"}</strong></p>
                  <p className="flex justify-between gap-4"><span>Heure</span><strong className="text-right text-white">{selectedSlot || "À définir"}</strong></p>

                  {(isProEmail && !isBypassProEmail) && (
                    <p className="flex justify-between gap-4"><span>Tarif</span><strong className="text-right text-secondaire">Entreprise Pro</strong></p>
                  )}

                  <div className="border-t border-white/10 pt-3 mt-3">
                    <p className="flex justify-between gap-4 items-center">
                      <span>{paymentMode === "deposit" ? "À payer maintenant (30%)" : "À payer maintenant (100%)"}</span>
                      <strong className="text-right text-xl text-secondaire">{dynamicPrice}€</strong>
                    </p>
                    {paymentMode === "deposit" && (
                      <p className="flex justify-between gap-4 mt-2 text-xs text-white/40">
                        <span>Reste à payer le jour J</span>
                        <strong className="text-right text-white/60">
                          {Number.isInteger(totalBasePrice * 0.7) ? (totalBasePrice * 0.7).toString() : (totalBasePrice * 0.7).toFixed(2).replace('.', ',')}€
                        </strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-center py-2">
                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                  onSuccess={(token) => setCaptchaToken(token)}
                  onExpire={() => setCaptchaToken(null)}
                  options={{ theme: 'dark' }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`w-full rounded-2xl px-6 py-5 text-base font-black uppercase tracking-widest transition-all shadow-xl
                  ${isSubmitDisabled
                    ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                    : "bg-secondaire text-background shadow-secondaire/10 hover:brightness-110 active:scale-[0.98]"
                  }`}
              >
                {isSending ? "Envoi en cours..." : isSuccess ? "Demande envoyée !" : "Payer la réservation"}
              </button>

            </form>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
