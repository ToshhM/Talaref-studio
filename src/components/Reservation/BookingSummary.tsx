import type { Service } from "./data";
import { formatDateSummary, formatPrice, getDurationLabel } from "./utils";

type BookingSummaryProps = {
  selectedService: Service;
  bookingDate: Date | null;
  selectedSlot: string;
  selectedDuration: number;
  isProfessionalRate: boolean;
  paymentMode: "full" | "deposit";
  dynamicPrice: string;
  remainingAmount: number;
  priceErrorMessage: string;
  selectedNightHours?: number;
};

export function BookingSummary({
  selectedService,
  bookingDate,
  selectedSlot,
  selectedDuration,
  isProfessionalRate,
  paymentMode,
  dynamicPrice,
  remainingAmount,
  priceErrorMessage,
  selectedNightHours = 0,
}: BookingSummaryProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-background/70 p-5">
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondaire">
        Résumé
      </span>

      <div className="mt-4 space-y-3 text-sm text-white/65">
        <p className="flex justify-between gap-4">
          <span>Prestation</span>
          <strong className="text-right text-white">{selectedService.title}</strong>
        </p>

        <p className="flex justify-between gap-4">
          <span>Date</span>
          <strong className="text-right text-white capitalize">
            {formatDateSummary(bookingDate) || "À définir"}
          </strong>
        </p>

        <p className="flex justify-between gap-4">
          <span>Heure</span>
          <strong className="text-right text-white">{selectedSlot || "À définir"}</strong>
        </p>

        <p className="flex justify-between gap-4">
          <span>Durée</span>
          <strong className="text-right text-white">
            {getDurationLabel(selectedDuration)}
          </strong>
        </p>

        {isProfessionalRate && (
          <p className="flex justify-between gap-4">
            <span>Tarif</span>
            <strong className="text-right text-secondaire">Entreprise Pro</strong>
          </p>
        )}

        {selectedNightHours > 0 && (
          <p className="flex justify-between gap-4">
            <span>Heures de nuit</span>
            <strong className="text-right text-secondaire">
              {selectedNightHours}h (+100€/h)
            </strong>
          </p>
        )}

        {priceErrorMessage && (
          <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs font-bold text-red-300">
            {priceErrorMessage}
          </p>
        )}

        <div className="border-t border-white/10 pt-3 mt-3">
          <p className="flex justify-between gap-4 items-center">
            <span>
              {paymentMode === "deposit"
                ? "À payer maintenant (30%)"
                : "À payer maintenant (100%)"}
            </span>
            <strong className="text-right text-xl text-secondaire">{dynamicPrice}€</strong>
          </p>

          {paymentMode === "deposit" && (
            <p className="flex justify-between gap-4 mt-2 text-xs text-white/40">
              <span>Reste à payer le jour J</span>
              <strong className="text-right text-white/60">
                {formatPrice(remainingAmount)}€
              </strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
