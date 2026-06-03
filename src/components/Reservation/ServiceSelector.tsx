import { motion } from "framer-motion";
import type { Service } from "./data";

type ServiceSelectorProps = {
  services: Service[];
  selectedServiceId: string;
  onSelectService: (service: Service) => void;
};

export function ServiceSelector({
  services,
  selectedServiceId,
  onSelectService,
}: ServiceSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.55 }}
      className="rounded-[2rem] border border-white/10 bg-principale/15 p-4 backdrop-blur-2xl md:p-6 h-fit"
    >
      <div className="grid gap-4">
        {services.map((service) => {
          const isSelected = selectedServiceId === service.id;

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelectService(service)}
              className={`group rounded-[1.5rem] border p-6 text-left transition-all ${
                isSelected
                  ? "border-secondaire bg-secondaire text-background shadow-xl shadow-secondaire/10"
                  : "border-white/10 bg-background/70 text-white hover:border-secondaire/40"
              }`}
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <span
                    className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                      isSelected ? "text-background/60" : "text-secondaire"
                    }`}
                  >
                    {service.eyebrow}
                  </span>
                  <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">
                    {service.title}
                  </h2>
                  <p
                    className={`mt-3 max-w-2xl leading-7 ${
                      isSelected ? "text-background/70" : "text-white/55"
                    }`}
                  >
                    {service.description}
                  </p>
                </div>

                <div className="shrink-0 md:text-right">
                  <p className="text-sm font-black uppercase tracking-widest">
                    {service.durationText}
                  </p>
                  <p
                    className={`mt-2 text-sm font-bold ${
                      isSelected ? "text-background/70" : "text-white/45"
                    }`}
                  >
                    {service.price}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
