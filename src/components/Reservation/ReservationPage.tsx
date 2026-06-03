"use client";

import { useEffect, useMemo, useState } from "react";
import { ReservationHero } from "./ReservationHero";
import { ServiceSelector } from "./ServiceSelector";
import { BookingForm } from "./BookingForm";
import { services } from "./data";

export function ReservationPage() {
  const [selectedServiceId, setSelectedServiceId] = useState(services[0].id);
  const [isNightTime, setIsNightTime] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      let isNight = false;
      if (process.env.NEXT_PUBLIC_FORCE_NIGHT_MODE === "true") {
        isNight = true;
      } else {
        try {
          const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: "Europe/Paris",
            hour: "numeric",
            hour12: false,
          });
          const hour = parseInt(formatter.format(new Date()), 10);
          isNight = hour >= 23 || hour < 9;
        } catch (e) {
          const hour = new Date().getHours();
          isNight = hour >= 23 || hour < 9;
        }
      }
      setIsNightTime(isNight);
    };

    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) ?? services[0],
    [selectedServiceId]
  );

  return (
    <section className={`min-h-screen bg-background px-6 pb-24 pt-36 text-white relative overflow-hidden transition-colors duration-500 ${isNightTime ? "night-theme" : ""}`}>
      <div className="absolute left-1/2 top-0 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-principale/20 blur-[150px] transition-colors duration-500" />
      <div className="absolute bottom-20 right-0 h-[420px] w-[420px] rounded-full bg-secondaire/10 blur-[130px] transition-colors duration-500" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <ReservationHero />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <ServiceSelector
            services={services}
            selectedServiceId={selectedServiceId}
            onSelectService={(service) => setSelectedServiceId(service.id)}
          />

          <BookingForm
            selectedService={selectedService}
            selectedServiceId={selectedServiceId}
            isNightTime={isNightTime}
          />
        </div>
      </div>
    </section>
  );
}
