import Link from "next/link";

export default function AdminIndexPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-white">
      <div className="w-full max-w-md">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-secondaire">Admin · Talaref Studio</p>
        <h1 className="mt-2 text-4xl font-black uppercase tracking-tight">Console</h1>
        <div className="mt-8 grid gap-4">
          <Link href="/admin/projects" className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-secondaire/40">
            <p className="text-lg font-black">Projets</p>
            <p className="mt-1 text-sm text-white/50">Gérer le portfolio affiché sur /portfolio.</p>
          </Link>
          <Link href="/admin/bookings" className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-secondaire/40">
            <p className="text-lg font-black">Réservations</p>
            <p className="mt-1 text-sm text-white/50">Studio, événements Congo, emails.</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
