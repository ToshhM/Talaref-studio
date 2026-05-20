import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ReservationPage } from "@/components/Reservation";

export const metadata: Metadata = {
  title: "Réservation | TALAREF STUDIO",
  description: "Réservez une prestation photo ou video avec TALAREF STUDIO.",
};

export default function Reservation() {
  return (
    <div className="min-h-screen bg-background text-white selection:bg-secondaire selection:text-background">
      <Header />
      <main>
        <ReservationPage />
      </main>
      <Footer />
    </div>
  );
}
