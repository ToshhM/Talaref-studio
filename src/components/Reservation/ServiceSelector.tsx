import { motion } from "framer-motion";
import type { PhotographerFormula } from "@/lib/photographerFormulas";
import { photographerFormulas } from "@/lib/photographerFormulas";
import type { Service } from "./data";

type ServiceSelectorProps = {
  services: Service[];
  selectedServiceId: string;
  selectedPhotographerFormulaId: string;
  selectedPhotographerTierIndex: number;
  onSelectService: (service: Service) => void;
  onSelectPhotographerFormula: (formulaId: string, tierIndex: number) => void;
};

const SERVICE_GROUPS = [
  { title: "Shooting sans photographe · Location", serviceIds: ["location-studio"] },
  { title: "Autres prestations", serviceIds: ["podcasts", "formations"] },
];

function getFormulaPrice(formula: PhotographerFormula): string {
  if (formula.tiers.length === 0) return "Sur devis";

  if (formula.id === "polas") {
    return formula.tiers.map((tier) => `${tier.price}€`).join(" · ");
  }

  const startingPrice = Math.min(...formula.tiers.map((tier) => tier.price));
  return formula.tiers.length === 1 ? `${startingPrice}€` : `Dès ${startingPrice}€`;
}

function getFormulaDuration(formula: PhotographerFormula): string {
  if (formula.tiers.length === 0) return "Au forfait";
  return formula.subtitle;
}

export function ServiceSelector({
  services,
  selectedServiceId,
  selectedPhotographerFormulaId,
  selectedPhotographerTierIndex,
  onSelectService,
  onSelectPhotographerFormula,
}: ServiceSelectorProps) {
  const renderCard = ({
    selected,
    eyebrow,
    title,
    description,
    durationText,
    price,
    onClick,
    children,
  }: {
    selected: boolean;
    eyebrow: string;
    title: string;
    description: string;
    durationText: string;
    price: string;
    onClick: () => void;
    children?: React.ReactNode;
  }) => (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`w-full rounded-[1.5rem] border p-6 text-left transition-all ${
        selected
          ? "border-secondaire bg-secondaire text-background shadow-xl shadow-secondaire/10"
          : "border-white/10 bg-background/70 text-white hover:border-secondaire/40"
      }`}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div>
          <span
            className={`text-[10px] font-black uppercase tracking-[0.3em] ${
              selected ? "text-background/60" : "text-secondaire"
            }`}
          >
            {eyebrow}
          </span>
          <h3 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">
            {title}
          </h3>
          <p
            className={`mt-3 max-w-2xl leading-7 ${
              selected ? "text-background/70" : "text-white/55"
            }`}
          >
            {description}
          </p>
          {children}
        </div>

        <div className="shrink-0 md:text-right">
          <p className="text-sm font-black uppercase tracking-widest">{durationText}</p>
          <p
            className={`mt-2 text-sm font-bold ${
              selected ? "text-background/70" : "text-white/45"
            }`}
          >
            {price}
          </p>
        </div>
      </div>
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.55 }}
      className="h-fit rounded-[2rem] border border-white/10 bg-principale/15 p-4 backdrop-blur-2xl md:p-6"
    >
      <div className="grid gap-7">
        <section aria-label="Shooting avec photographe">
          <h2 className="mb-3 px-1 text-[10px] font-black uppercase tracking-[0.24em] text-white/40">
            Shooting avec photographe
          </h2>
          <div className="grid gap-3">
            {photographerFormulas.map((formula) => {
              const selected =
                selectedServiceId === "prestation-photographe" &&
                selectedPhotographerFormulaId === formula.id;
              const selectedTier = formula.tiers[selectedPhotographerTierIndex];

              return (
                <div key={formula.id} className="grid gap-2">
                  {renderCard({
                    selected,
                    eyebrow: formula.tiers.length === 0 ? "Prestation sur devis" : "Formule avec photographe",
                    title: formula.title,
                    description: formula.description,
                    durationText: getFormulaDuration(formula),
                    price: getFormulaPrice(formula),
                    onClick: () => onSelectPhotographerFormula(formula.id, 0),
                    children: selectedTier?.details?.length ? (
                      <ul
                        className={`mt-4 grid gap-1 text-sm ${
                          selected ? "text-background/75" : "text-white/60"
                        }`}
                      >
                        {selectedTier.details.map((detail) => (
                          <li key={detail}>↗ {detail}</li>
                        ))}
                      </ul>
                    ) : null,
                  })}

                  {formula.id === "polas" && (
                    <div className="grid gap-2 pl-3 sm:grid-cols-3">
                      {formula.tiers.map((tier, index) => {
                        const tierSelected = selected && selectedPhotographerTierIndex === index;

                        return (
                          <button
                            key={tier.label}
                            type="button"
                            aria-pressed={tierSelected}
                            onClick={() => onSelectPhotographerFormula(formula.id, index)}
                            className={`rounded-xl border p-4 text-left transition-all ${
                              tierSelected
                                ? "border-secondaire bg-secondaire text-background"
                                : "border-white/10 bg-background/80 text-white hover:border-secondaire/40"
                            }`}
                          >
                            <span className="block text-xs font-black uppercase tracking-widest opacity-60">
                              {tier.label}
                            </span>
                            <span className="mt-1 block text-2xl font-black">
                              {tier.price}€
                            </span>
                            <span className="mt-1 block text-xs opacity-65">
                              {tier.duration === 0.5
                                ? "30 min"
                                : tier.duration === 1
                                  ? "1 heure"
                                  : "1 h 30"}{" "}
                              · {tier.photos} photos
                            </span>
                            <span className="mt-3 block text-xs leading-5 opacity-75">
                              {tier.details?.join(" · ")}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {SERVICE_GROUPS.map((group) => {
          const groupServices = services.filter((service) =>
            group.serviceIds.includes(service.id)
          );

          return (
            <section key={group.title} aria-label={group.title}>
              <h2 className="mb-3 px-1 text-[10px] font-black uppercase tracking-[0.24em] text-white/40">
                {group.title}
              </h2>
              <div className="grid gap-3">
                {groupServices.map((service) =>
                  renderCard({
                    selected: selectedServiceId === service.id,
                    eyebrow: service.eyebrow,
                    title: service.title,
                    description: service.description,
                    durationText: service.durationText,
                    price: service.price,
                    onClick: () => onSelectService(service),
                    children: (
                      <ul
                        className={`mt-4 grid gap-1 text-sm ${
                          selectedServiceId === service.id
                            ? "text-background/75"
                            : "text-white/60"
                        }`}
                      >
                        {service.includes.map((item) => (
                          <li key={item}>↗ {item}</li>
                        ))}
                      </ul>
                    ),
                  })
                )}
              </div>
            </section>
          );
        })}
      </div>
    </motion.div>
  );
}
