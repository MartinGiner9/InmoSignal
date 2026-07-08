import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'InmoSignal',
  description: 'B2B real estate capture platform',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
