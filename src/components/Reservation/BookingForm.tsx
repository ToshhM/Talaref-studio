import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Turnstile } from "@marsidev/react-turnstile";
import { calculateBookingPrice, calculateNightHours } from "@/lib/priceCalculator";
import {
  currentYear,
  FORMATION_DURATIONS,
  monthNames,
  PODCAST_DURATIONS,
  BOOKING_DURATIONS,
  publicEmailDomains,
  type Service,
  weekDays,
  yearsList,
} from "./data";
import {
  buildStrictDate,
  formatDateSummary,
  formatPrice,
  getDurationLabel,
  isPastDay,
  isSameDay,
} from "./utils";
import { BookingSummary } from "./BookingSummary";

type BookingFormProps = {
  selectedService: Service;
  selectedServiceId: string;
  isNightTime: boolean;
};

const viewVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
};

export function BookingForm({ selectedService, selectedServiceId, isNightTime }: BookingFormProps) {
  const [selectedDuration, setSelectedDuration] = useState<number>(
    selectedService.baseDuration
  );
  const [paymentMode, setPaymentMode] = useState<"full" | "deposit">("full");

  const [bookingDate, setBookingDate] = useState<Date | null>(null);
  const [dateInputValue, setDateInputValue] = useState("");
  const [dateErrorMessage, setDateErrorMessage] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [isDurationOpen, setIsDurationOpen] = useState(false);

  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<"days" | "months" | "years">(
    "days"
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userSiret, setUserSiret] = useState("");
  const [userMessage, setUserMessage] = useState("");

  const [isProEmail, setIsProEmail] = useState(false);
  const [isBypassProEmail, setIsBypassProEmail] = useState(false);

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);

  const durationOptions = useMemo(() => {
    if (selectedServiceId === "formations") return FORMATION_DURATIONS;
    if (selectedServiceId === "podcasts") return PODCAST_DURATIONS;
    return BOOKING_DURATIONS;
  }, [selectedServiceId]);

  useEffect(() => {
    setSelectedDuration(selectedService.baseDuration);
    setPaymentMode("full");
    setIsDurationOpen(false);
  }, [selectedService.id, selectedService.baseDuration]);

  useEffect(() => {
    if (!durationOptions.includes(selectedDuration)) {
      setSelectedDuration(durationOptions[0]);
    }
  }, [durationOptions, selectedDuration]);

  const checkEmailDomain = (email: string) => {
    if (!email || !email.includes("@")) {
      setIsProEmail(false);
      setIsBypassProEmail(false);
      setUserSiret("");
      return;
    }

    const parts = email.split("@");
    if (parts.length !== 2) return;

    const domain = parts[1].toLowerCase();
    const domainParts = domain.split(".");

    if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
      setIsProEmail(false);
      setIsBypassProEmail(false);
      setUserSiret("");
      return;
    }

    const nextIsProEmail = !publicEmailDomains.includes(domain);
    setIsProEmail(nextIsProEmail);

    if (!nextIsProEmail) {
      setIsBypassProEmail(false);
      setUserSiret("");
    }
  };

  const priceComputation = useMemo(() => {
    try {
      const isEnterprise = isProEmail && !isBypassProEmail;

      const basePrice = calculateBookingPrice(
        selectedService.title,
        selectedDuration,
        selectedSlot || "09:00",
        isEnterprise
      );

      return {
        basePrice,
        error: "",
      };
    } catch (error) {
      return {
        basePrice: 0,
        error:
          error instanceof Error
            ? error.message
            : "Impossible de calculer le prix de cette réservation.",
      };
    }
  }, [selectedService.title, selectedDuration, selectedSlot, isProEmail, isBypassProEmail]);

  const totalBasePrice = priceComputation.basePrice;
  const priceErrorMessage = priceComputation.error;

  const selectedNightHours = useMemo(() => {
    if (!selectedSlot) return 0;
    try {
      return calculateNightHours(selectedSlot, selectedDuration);
    } catch {
      return 0;
    }
  }, [selectedSlot, selectedDuration]);

  const dynamicPrice = useMemo(() => {
    const price = paymentMode === "deposit" ? totalBasePrice * 0.3 : totalBasePrice;
    return formatPrice(price);
  }, [totalBasePrice, paymentMode]);

  const remainingAmount = useMemo(() => {
    if (paymentMode !== "deposit") return 0;
    return totalBasePrice * 0.7;
  }, [totalBasePrice, paymentMode]);

  const availableTimeSlots = useMemo(() => {
    if (!bookingDate) return [];

    const slots = [];

    for (let h = 0; h < 24; h++) {
      slots.push(`${h.toString().padStart(2, "0")}:00`);
      slots.push(`${h.toString().padStart(2, "0")}:30`);
    }

    return slots;
  }, [bookingDate]);

  const daysInMonth = new Date(
    currentMonthDate.getFullYear(),
    currentMonthDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonthDate.getFullYear(),
    currentMonthDate.getMonth(),
    1
  ).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const nextMonth = () =>
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1)
    );

  const prevMonth = () =>
    setCurrentMonthDate(
      new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1)
    );

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDateErrorMessage("");

    if (val.length < dateInputValue.length) {
      setDateInputValue(val);
      setBookingDate(null);
      setSelectedSlot("");
      return;
    }

    const raw = val.replace(/\D/g, "");
    let day = raw.substring(0, 2);
    let month = raw.substring(2, 4);
    let year = raw.substring(4, 8);

    if (day.length === 1 && parseInt(day) > 3) day = `0${day}`;
    if (day.length === 2 && parseInt(day) > 31) day = day.substring(0, 1);
    if (day.length === 2 && day === "00") day = "01";

    if (month.length === 1 && parseInt(month) > 1) month = `0${month}`;
    if (month.length === 2 && parseInt(month) > 12) month = month.substring(0, 1);
    if (month.length === 2 && month === "00") month = "01";

    if (year.length > 0) {
      const yearPrefix = currentYear.toString().substring(0, year.length);
      if (year < yearPrefix) year = year.substring(0, year.length - 1);
    }

    let finalStr = day;
    if (raw.length >= 3) finalStr += `/${month}`;
    if (raw.length >= 5) finalStr += `/${year}`;

    setDateInputValue(finalStr);

    if (finalStr.length === 10) {
      const y = parseInt(year, 10);
      const m = parseInt(month, 10) - 1;
      const d = parseInt(day, 10);

      const parsedDate = new Date(y, m, d);
      const isValidDate =
        parsedDate.getFullYear() === y &&
        parsedDate.getMonth() === m &&
        parsedDate.getDate() === d;
      const isNotPast =
        parsedDate.setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0);

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

  const isSiretRequired = isProEmail && !isBypassProEmail;
  const isProfessionalRate = isProEmail && !isBypassProEmail;

  const isSubmitDisabled =
    isSending ||
    !captchaToken ||
    isSuccess ||
    !firstName.trim() ||
    !lastName.trim() ||
    !userEmail.trim() ||
    !userPhone.trim() ||
    !bookingDate ||
    !selectedSlot ||
    Boolean(priceErrorMessage) ||
    (isSiretRequired && !userSiret.trim());

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitDisabled) {
      alert("Veuillez remplir tous les champs obligatoires et valider le captcha.");
      return;
    }

    setIsSending(true);

    try {
      const strictDate = buildStrictDate(bookingDate);
      const prettyDate = formatDateSummary(bookingDate);

      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email: userEmail,
          phone: userPhone,
          siret: isSiretRequired ? userSiret : undefined,
          service: selectedService.title,
          date: strictDate,
          formattedDate: prettyDate,
          slot: selectedSlot,
          duration: selectedDuration,
          paymentMode,
          message: userMessage,
          captchaToken,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        setIsSuccess(true);
        if (data?.url) window.location.href = data.url;
      } else {
        alert(
          data?.error ||
            "Erreur lors de la préparation de la réservation. Vérifiez vos informations et réessayez."
        );
        setIsSending(false);
      }
    } catch (error) {
      console.error("Erreur booking:", error);
      alert("Une erreur de connexion est survenue.");
      setIsSending(false);
    }
  };

  return (
    <motion.aside
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, duration: 0.55 }}
      className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl md:p-8 h-fit"
    >
      <div className="flex items-start justify-between gap-6 mb-8">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
            Votre demande
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight">Créneau souhaité</h2>
        </div>
        <div className="rounded-2xl bg-secondaire px-4 py-3 text-center text-background min-w-[90px]">
          <span className="block text-[10px] font-black uppercase tracking-widest">
            Durée
          </span>
          <span className="block text-xl font-black">{selectedDuration}h</span>
        </div>
      </div>

      {(isNightTime || selectedNightHours > 0) && (
        <div className="mb-8 flex items-start gap-5 rounded-2xl border border-secondaire/30 bg-secondaire/5 p-6 text-sm text-white/90 backdrop-blur-md">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondaire/15 text-secondaire">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <path d="M12 14v4" />
              <path d="M10 16h4" />
            </svg>
          </span>
          <div className="leading-relaxed">
            <h4 className="text-secondaire font-black uppercase tracking-wider text-xs mb-1">
              {isNightTime 
                ? (selectedNightHours > 0 ? "Réservation Nocturne Active" : "Plage Horaire Nocturne Active") 
                : "Ajustement Tarifaire Nocturne"}
            </h4>
            <p className="text-white/80">
              {isNightTime ? (
                selectedNightHours > 0 ? (
                  <span>Votre sélection inclut <strong>{selectedNightHours} heure{selectedNightHours > 1 ? "s" : ""}</strong> dans la plage nocturne (23h00 - 08h59) soumise à une majoration de <strong>100 €/h</strong>.</span>
                ) : (
                  <span>La tarification nocturne est active de 23h00 à 08h59. Les heures réservées durant cette période font l&apos;objet d&apos;un ajustement de +100 €/h.</span>
                )
              ) : (
                <span>Le créneau sélectionné contient <strong>{selectedNightHours} heure{selectedNightHours > 1 ? "s" : ""}</strong> dans la plage nocturne (23h00 - 08h59). Une majoration de <strong>100 €/h</strong> s&apos;applique automatiquement à ces heures.</span>
              )}
            </p>
          </div>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleBooking}>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="relative space-y-3 z-30" ref={calendarRef}>
            <span className="ml-1 text-xs font-black uppercase tracking-widest text-white/40">
              Date
            </span>
            <div className="relative">
              <div
                className={`relative flex w-full items-center rounded-2xl border px-5 py-4 text-white transition-all ${
                  dateErrorMessage
                    ? "border-red-500 bg-red-500/5 ring-4 ring-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                    : "border-white/10 bg-background hover:border-secondaire/40 focus-within:border-secondaire/60 focus-within:ring-4 focus-within:ring-secondaire/10"
                }`}
              >
                <input
                  type="text"
                  placeholder="JJ/MM/AAAA"
                  value={dateInputValue}
                  onChange={handleDateInputChange}
                  onFocus={() => {
                    setIsCalendarOpen(true);
                    setIsTimeOpen(false);
                    setIsDurationOpen(false);
                  }}
                  className="w-full bg-transparent outline-none placeholder:text-white/25"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsCalendarOpen(!isCalendarOpen);
                    setIsTimeOpen(false);
                    setIsDurationOpen(false);
                  }}
                  className="ml-2 text-white/40 hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                </button>
              </div>
              <AnimatePresence>
                {dateErrorMessage && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute -bottom-6 left-2 text-xs font-bold text-red-500"
                  >
                    {dateErrorMessage}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {isCalendarOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 top-[90px] w-full min-w-[300px] rounded-2xl border border-white/10 bg-[#121212] p-5 shadow-2xl overflow-hidden"
                >
                  <div className="mb-4 flex items-center justify-between relative z-10">
                    <button
                      type="button"
                      onClick={calendarView === "days" ? prevMonth : undefined}
                      className={`rounded-lg p-2 ${
                        calendarView !== "days"
                          ? "opacity-0 cursor-default"
                          : "hover:bg-white/10"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCalendarView(calendarView === "days" ? "years" : "days")
                      }
                      className="font-bold capitalize text-white hover:text-secondaire transition-colors"
                    >
                      {calendarView === "days"
                        ? new Intl.DateTimeFormat("fr-FR", {
                            month: "long",
                            year: "numeric",
                          }).format(currentMonthDate)
                        : calendarView === "years"
                          ? "Choisir l'année"
                          : "Choisir le mois"}
                    </button>
                    <button
                      type="button"
                      onClick={calendarView === "days" ? nextMonth : undefined}
                      className={`rounded-lg p-2 ${
                        calendarView !== "days"
                          ? "opacity-0 cursor-default"
                          : "hover:bg-white/10"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>

                  <div className="relative min-h-[220px]">
                    <AnimatePresence mode="wait">
                      {calendarView === "days" && (
                        <motion.div
                          key="days"
                          variants={viewVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{ duration: 0.15 }}
                          className="absolute w-full"
                        >
                          <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {weekDays.map((day) => (
                              <span key={day} className="text-xs font-bold text-white/40">
                                {day}
                              </span>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {Array.from({ length: startOffset }).map((_, i) => (
                              <div key={`empty-${i}`} />
                            ))}
                            {days.map((day) => {
                              const dateObj = new Date(
                                currentMonthDate.getFullYear(),
                                currentMonthDate.getMonth(),
                                day
                              );
                              const isPast = isPastDay(dateObj);
                              const isSelected = isSameDay(bookingDate, dateObj);

                              return (
                                <button
                                  key={day}
                                  type="button"
                                  disabled={isPast}
                                  onClick={() => {
                                    setBookingDate(dateObj);
                                    setSelectedSlot("");
                                    setDateInputValue(
                                      `${String(day).padStart(2, "0")}/${String(
                                        currentMonthDate.getMonth() + 1
                                      ).padStart(2, "0")}/${currentMonthDate.getFullYear()}`
                                    );
                                    setDateErrorMessage("");
                                    setIsCalendarOpen(false);
                                  }}
                                  className={`aspect-square rounded-xl text-sm transition-all ${
                                    isPast
                                      ? "text-white/10 cursor-not-allowed"
                                      : isSelected
                                        ? "bg-secondaire font-bold text-background"
                                        : "text-white hover:bg-white/10"
                                  }`}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}

                      {calendarView === "years" && (
                        <motion.div
                          key="years"
                          variants={viewVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{ duration: 0.15 }}
                          className="absolute w-full"
                        >
                          <div className="grid grid-cols-3 gap-2">
                            {yearsList.map((year) => (
                              <button
                                key={year}
                                type="button"
                                onClick={() => {
                                  const newDate = new Date(currentMonthDate);
                                  newDate.setFullYear(year);
                                  setCurrentMonthDate(newDate);
                                  setCalendarView("months");
                                }}
                                className={`rounded-xl py-4 text-sm font-bold transition-all hover:bg-white/10 ${
                                  currentMonthDate.getFullYear() === year
                                    ? "bg-secondaire/20 text-secondaire"
                                    : "text-white"
                                }`}
                              >
                                {year}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {calendarView === "months" && (
                        <motion.div
                          key="months"
                          variants={viewVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{ duration: 0.15 }}
                          className="absolute w-full"
                        >
                          <div className="grid grid-cols-3 gap-2">
                            {monthNames.map((month, index) => (
                              <button
                                key={month}
                                type="button"
                                onClick={() => {
                                  const newDate = new Date(currentMonthDate);
                                  newDate.setMonth(index);
                                  setCurrentMonthDate(newDate);
                                  setCalendarView("days");
                                }}
                                className={`rounded-xl py-4 text-sm font-bold capitalize transition-all hover:bg-white/10 ${
                                  currentMonthDate.getMonth() === index
                                    ? "bg-secondaire/20 text-secondaire"
                                    : "text-white"
                                }`}
                              >
                                {month.slice(0, 3)}
                              </button>
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

          <div className="relative space-y-3 z-20">
            <span className="ml-1 text-xs font-black uppercase tracking-widest text-white/40">
              Créneau
            </span>
            <button
              type="button"
              disabled={!bookingDate}
              onClick={() => {
                setIsTimeOpen(!isTimeOpen);
                setIsCalendarOpen(false);
                setIsDurationOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-white outline-none transition-all ${
                !bookingDate
                  ? "border-white/5 bg-white/5 cursor-not-allowed text-white/30"
                  : "border-white/10 bg-background hover:border-secondaire/40 focus:border-secondaire/60 focus:ring-4 focus:ring-secondaire/10"
              }`}
            >
              <span>{!bookingDate ? "Choisissez une date" : selectedSlot || "Créneau"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={!bookingDate ? "text-white/20" : "text-white/40"}
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </button>

            <AnimatePresence>
              {isTimeOpen && bookingDate && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 top-[80px] w-full max-h-[260px] overflow-y-auto rounded-2xl border border-white/10 bg-[#121212] p-2 shadow-2xl [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {availableTimeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          setSelectedSlot(slot);
                          setIsTimeOpen(false);
                        }}
                        className={`rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                          selectedSlot === slot
                            ? "bg-secondaire text-background"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="relative space-y-3 z-10">
          <span className="ml-1 text-xs font-black uppercase tracking-widest text-white/40">
            Durée de la séance
          </span>
          <button
            type="button"
            onClick={() => {
              setIsDurationOpen(!isDurationOpen);
              setIsTimeOpen(false);
              setIsCalendarOpen(false);
            }}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-background px-5 py-4 text-white outline-none transition-all hover:border-secondaire/40 focus:border-secondaire/60 focus:ring-4 focus:ring-secondaire/10"
          >
            <span>{getDurationLabel(selectedDuration)}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/40"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </button>

          <AnimatePresence>
            {isDurationOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 top-[80px] w-full max-h-[200px] overflow-y-auto rounded-2xl border border-white/10 bg-[#121212] p-2 shadow-2xl [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10"
              >
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {durationOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setSelectedDuration(opt);
                        setIsDurationOpen(false);
                      }}
                      className={`rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                        selectedDuration === opt
                          ? "bg-secondaire text-background"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {getDurationLabel(opt)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative space-y-3 z-0">
          <span className="ml-1 text-xs font-black uppercase tracking-widest text-white/40">
            Type de paiement
          </span>
          <div className="relative flex w-full rounded-2xl border border-white/10 bg-[#121212] p-1 shadow-inner">
            {(["full", "deposit"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setPaymentMode(mode)}
                className={`relative z-10 w-1/2 rounded-xl py-3 text-sm font-bold transition-colors duration-300 ${
                  paymentMode === mode
                    ? "text-background"
                    : "text-white/40 hover:text-white"
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
            <span className="ml-1 text-xs font-black uppercase tracking-widest text-white/40">
              Téléphone
            </span>
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
                <AnimatePresence initial={false}>
                  {!isBypassProEmail && (
                    <motion.label
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="block space-y-3 overflow-hidden"
                    >
                      <span className="ml-1 text-xs font-black uppercase tracking-widest text-secondaire">
                        SIRET Entreprise (Obligatoire)
                      </span>
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
                    onChange={(e) => {
                      setIsBypassProEmail(e.target.checked);
                      if (e.target.checked) setUserSiret("");
                    }}
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-background text-secondaire focus:ring-secondaire focus:ring-offset-background transition-all"
                  />
                  <span className="text-xs text-white/50 leading-relaxed">
                    Je suis un particulier (étudiant, usage privé) ou je n&apos;ai pas besoin
                    d&apos;une facture au nom d&apos;une entreprise.
                  </span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <label className="block space-y-3">
          <span className="ml-1 text-xs font-black uppercase tracking-widest text-white/40">
            Informations complémentaires
          </span>
          <textarea
            rows={4}
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Lieu, objectif, format souhaité..."
            className="w-full resize-none rounded-2xl border border-white/10 bg-background px-5 py-4 text-white outline-none transition-all placeholder:text-white/25 focus:border-secondaire/60 focus:ring-4 focus:ring-secondaire/10"
          />
        </label>

        <BookingSummary
          selectedService={selectedService}
          bookingDate={bookingDate}
          selectedSlot={selectedSlot}
          selectedDuration={selectedDuration}
          isProfessionalRate={isProfessionalRate}
          paymentMode={paymentMode}
          dynamicPrice={dynamicPrice}
          remainingAmount={remainingAmount}
          priceErrorMessage={priceErrorMessage}
          selectedNightHours={selectedNightHours}
        />

        <div className="flex justify-center py-2">
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            onSuccess={(token) => setCaptchaToken(token)}
            onExpire={() => setCaptchaToken(null)}
            options={{ theme: "dark" }}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`w-full rounded-2xl px-6 py-5 text-base font-black uppercase tracking-widest transition-all shadow-xl ${
            isSubmitDisabled
              ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
              : "bg-secondaire text-background shadow-secondaire/10 hover:brightness-110 active:scale-[0.98]"
          }`}
        >
          {isSending
            ? "Envoi en cours..."
            : isSuccess
              ? "Demande envoyée !"
              : "Payer la réservation"}
        </button>
      </form>
    </motion.aside>
  );
}
