import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="main">
      <section className="panel">
        <h1>InmoSignal</h1>
        <p>SaaS B2B para convertir busquedas de captacion en oportunidades.</p>
        <Link href="/dashboard">Ir al dashboard</Link>
      </section>
    </main>
  );
}
