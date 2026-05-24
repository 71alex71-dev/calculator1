import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Генератор объявлений для Авито',
  description: 'Быстро создаёт тексты, идеи фото и рекомендации для размещения.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}