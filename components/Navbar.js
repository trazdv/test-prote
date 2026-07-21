'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { siteConfig } from '@/lib/siteConfig';
import HeartIcon from './HeartIcon';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/animales', label: 'Animales' },
    { href: '/campanas', label: 'Campañas' },
    { href: '/#sobre-nosotros', label: 'Sobre nosotros' },
    { href: '/#contacto', label: 'Contacto' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-brand-white/85 backdrop-blur-md border-b border-brand-dark/5">
      <nav className="container-page flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3 font-display text-xl font-semibold tracking-tight">
          <span className="relative w-10 h-10 shrink-0">
            <Image src="/logo.svg" alt={`Sello de ${siteConfig.nombreProtectora}`} fill className="object-contain" />
          </span>
          <span className="hidden sm:inline">{siteConfig.nombreProtectora}</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium hover:opacity-70 transition"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/animales" className="btn-primary text-sm px-5 py-2.5">
            Ver animales
          </Link>
          <Link href="/donar" className="btn-donate text-sm px-5 py-2.5">
            <HeartIcon /> ¡Quiero donar!
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-full hover:bg-brand-cream/50 transition"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menú"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="#2E2A31" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden container-page pb-5 flex flex-col gap-3 animate-fadeInUp">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium py-2"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/animales" onClick={() => setOpen(false)} className="btn-primary text-sm">
            Ver animales
          </Link>
          <Link href="/donar" onClick={() => setOpen(false)} className="btn-donate text-sm">
            <HeartIcon /> ¡Quiero donar!
          </Link>
        </div>
      )}
    </header>
  );
}
