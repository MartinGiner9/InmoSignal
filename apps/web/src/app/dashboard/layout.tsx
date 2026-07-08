import Link from 'next/link';
import type { ReactNode } from 'react';

const links = [
  ['Dashboard', '/dashboard'],
  ['Searches', '/dashboard/searches'],
  ['Opportunities', '/dashboard/opportunities'],
  ['Settings', '/dashboard/settings'],
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen bg-slate-50 text-slate-950 md:grid-cols-[220px_1fr]">
      <nav className="bg-slate-950 p-6 text-white">
        <strong className="text-lg">InmoSignal</strong>
        {links.map(([label, href]) => (
          <Link
            className="mt-4 block text-sm text-slate-200 hover:text-white"
            key={href}
            href={href}
          >
            {label}
          </Link>
        ))}
      </nav>
      <main className="p-8">{children}</main>
    </div>
  );
}
