import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-950">
      <section className="w-full max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold">InmoSignal</h1>
        <p className="mt-3 text-slate-600">
          SaaS B2B para convertir busquedas de captacion en oportunidades.
        </p>
        <Link
          className="mt-6 inline-flex rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
          href="/dashboard"
        >
          Ir al dashboard
        </Link>
      </section>
    </main>
  );
}
