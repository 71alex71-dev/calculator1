import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Stone Calculator',
  description: 'Калькулятор изделий из искусственного камня',
};

const links = [
  { href: '/new-calculation', label: 'Новый расчёт' },
  { href: '/materials', label: 'Справочник материалов' },
  { href: '/summary', label: 'Итог расчёта' },
  { href: '/client-message', label: 'Сообщение клиенту' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <div className="mx-auto min-h-screen max-w-6xl px-4 py-8">
          <header className="mb-6 rounded-2xl bg-white p-4 shadow">
            <h1 className="mb-3 text-2xl font-semibold">Stone Calculator</h1>
            <nav className="flex flex-wrap gap-2">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-lg bg-slate-100 px-3 py-2 text-sm hover:bg-slate-200">
                  {link.label}
                </Link>
              ))}
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
