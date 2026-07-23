import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import AuthSessionProvider from '@/providers/SessionProvider';
import { siteConfig } from '@/lib/siteConfig';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.nombreProtectora} — Adopción y acogida de animales en Murcia`,
    template: `%s · ${siteConfig.nombreProtectora}`,
  },
  description: siteConfig.descripcionCorta,
  keywords: [
    'Ayuda Animal Murcia',
    'protectora de animales Murcia',
    'adopción de perros Murcia',
    'adopción de gatos Murcia',
    'acogida de animales',
    'ONG animales Murcia',
  ],
  openGraph: {
    title: `${siteConfig.nombreProtectora} — Adopción y acogida de animales en Murcia`,
    description: siteConfig.descripcionCorta,
    url: siteConfig.url,
    siteName: siteConfig.nombreProtectora,
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.nombreProtectora} — Adopción y acogida de animales en Murcia`,
    description: siteConfig.descripcionCorta,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: siteConfig.nombreProtectora,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.svg`,
    description: siteConfig.descripcionCorta,
    email: siteConfig.contacto.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contacto.direccion,
      addressCountry: 'ES',
    },
    sameAs: [siteConfig.contacto.instagram, siteConfig.contacto.facebook],
  };

  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <AuthSessionProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
