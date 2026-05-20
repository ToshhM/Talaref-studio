"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState(sessionId ? "loading" : "error");

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    fetch("/api/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then((res) => {
        setStatus(res.ok ? "success" : "error");
      })
      .catch(() => setStatus("error"));
  }, [sessionId]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondaire/20 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 max-w-md"
      >
        {status === "loading" && (
          <div className="space-y-4">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-secondaire border-t-transparent" />
            <p className="text-xl font-bold">Confirmation de votre paiement...</p>
          </div>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondaire text-background">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Reserve !</h1>
            <p className="mt-4 text-white/60">
              Merci ! Votre seance est confirmee. Vous allez recevoir un mail recapitulatif d&apos;ici quelques instants.
            </p>
            <Link href="/" className="mt-10 inline-block rounded-2xl bg-white/5 px-8 py-4 font-bold transition-all hover:bg-white/10">
              Retour a l&apos;accueil
            </Link>
          </>
        )}

        {status === "error" && (
          <p className="text-red-400">
            Une erreur est survenue lors de la confirmation. Contactez-nous si vous avez ete debite.
          </p>
        )}
      </motion.div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  );
}
