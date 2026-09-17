import type { Metadata, Viewport } from 'next';
import { Archivo, Hanken_Grotesk } from 'next/font/google';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';
import { Analytics } from '@/components/analytics/Analytics';
import { Providers } from '@/components/providers/Providers';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { Backdrop } from '@/components/site/Backdrop';
import { RouteFocus } from '@/components/site/RouteFocus';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { WhatsAppFloat } from '@/components/site/WhatsAppFloat';
import { SITE_URL } from '@/lib/asset';
import { EVENT } from '@/lib/event';
import { primitive } from '@/lib/tokens';
import './globals.css';

// server-hoist-static-io: fuentes resueltas una vez a nivel de módulo, autoalojadas y con display: swap.
const clash = localFont({
  src: [
    { path: './fonts/ClashDisplay-Medium.woff2', weight: '500', style: 'normal' },
    { path: './fonts/ClashDisplay-Semibold.woff2', weight: '600', style: 'normal' },
    { path: './fonts/ClashDisplay-Bold.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-clash',
  display: 'swap',
});

const hanken = Hanken_Grotesk({ subsets: ['latin'], variable: '--font-hanken', display: 'swap' });

// Respaldo de glifos para el display: no se precarga y solo se descarga si Clash no cubre un carácter.
const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo', display: 'swap', preload: false, axes: ['wdth'] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${EVENT.name} 2026 — ${EVENT.motto}`,
    template: `%s — ${EVENT.name} 2026`,
  },
  description: EVENT.shortDescription,
  applicationName: EVENT.name,
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: EVENT.name,
    title: `${EVENT.name} 2026 — ${EVENT.motto}`,
    description: EVENT.shortDescription,
  },
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: primitive['bruma-noche'],
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-CO" className={`${clash.variable} ${hanken.variable} ${archivo.variable}`}>
      <body className="min-h-dvh">
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-toast focus:rounded-sm focus:bg-niebla focus:px-4 focus:py-3 focus:font-semibold focus:text-bruma-noche"
          >
            Saltar al contenido
          </a>
          <Backdrop />
          <SiteHeader />
          <main id="main" tabIndex={-1} className="relative z-content">
            {children}
          </main>
          <SiteFooter />
          <WhatsAppFloat />
          <RouteFocus />
          <SmoothScroll />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
