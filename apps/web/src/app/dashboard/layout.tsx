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
    <div className="shell">
      <nav className="nav">
        <strong>InmoSignal</strong>
        {links.map(([label, href]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </nav>
      <main className="main">{children}</main>
    </div>
  );
}
