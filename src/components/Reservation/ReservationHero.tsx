import { motion } from "framer-motion";

export function ReservationHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end"
    >
      <div>
        <span className="text-xs font-black uppercase tracking-[0.3em] text-secondaire">
          Réservation studio
        </span>
        <h1 className="mt-5 max-w-4xl text-5xl font-black uppercase tracking-tighter md:text-7xl">
          Planifiez votre prochaine prise de vue.
        </h1>
      </div>

      <div className="flex flex-col gap-6 lg:justify-self-end w-full max-w-2xl">
        <p className="text-lg leading-8 text-white/60">
          Choisissez une prestation, proposez un créneau et laissez-nous préparer la suite.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
          <div className="flex flex-1 items-center gap-5 rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondaire/20 text-secondaire">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40">
                Talaref Studio
              </h3>
              <p className="text-lg font-black text-white">5 Rue Bellanger, Levallois</p>
            </div>
          </div>

          <div className="flex flex-1 items-center gap-5 rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondaire/20 text-secondaire relative">
              <span className="absolute right-0 top-0 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40">
                Ouverture
              </h3>
              <p className="text-xl font-black text-white uppercase tracking-wider">
                24h/24 - 7j/7
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
