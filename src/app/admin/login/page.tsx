"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error || "Erreur de connexion.");
        setIsLoading(false);
        return;
      }

      router.push("/admin/bookings");
      router.refresh();
    } catch {
      setError("Erreur de connexion.");
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl"
      >
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Espace admin</h1>
          <p className="mt-2 text-sm text-white/50">
            Connectez-vous pour gérer les réservations.
          </p>
        </div>

        <label className="block space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-white/40">
            Mot de passe
          </span>
          <input
            type="password"
            required
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-background px-5 py-4 text-white outline-none transition-all focus:border-secondaire/60 focus:ring-4 focus:ring-secondaire/10"
          />
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-2xl bg-secondaire px-6 py-4 text-sm font-black uppercase tracking-widest text-background transition-all hover:brightness-110 disabled:opacity-50"
        >
          {isLoading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </main>
  );
}
