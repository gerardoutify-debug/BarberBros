import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'], weight: ['300','400','500','600','700'], variable: '--font-display', display: 'swap',
});
const inter = Inter({
  subsets: ['latin'], weight: ['300','400','500','600','700'], variable: '--font-body', display: 'swap',
});

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0a0c0f' };

export const metadata: Metadata = {
  title: 'BarberBros | Lujo y Estilo',
  description: 'Descubre la experiencia definitiva en cuidado masculino.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang=" es\ className={\\ \\}>
 <body className=\font-sans antialiased\>{children}</body>
 </html>
 );
}
