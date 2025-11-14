import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'e-Gov法令改正情報',
  description: 'e-Gov法令APIを使った法改正情報閲覧アプリケーション',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
