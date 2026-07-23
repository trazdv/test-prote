import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/lib/siteConfig';

export default function Footer() {
  return (
    <footer id="contacto" className="bg-brand-dark text-brand-white mt-24">
      <div className="container-page py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="relative w-20 h-20 mb-4">
            <Image
              src="/logo.svg"
              alt={`Sello de ${siteConfig.nombreProtectora}`}
              fill
              className="object-contain [filter:brightness(0)_invert(1)]"
            />
          </div>
          <h3 className="font-display text-lg mb-3">{siteConfig.nombreProtectora}</h3>
          <p className="text-sm text-brand-white/70 leading-relaxed">
            {siteConfig.descripcionCorta}
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-brand-cream">Contacto</h4>
          <ul className="text-sm text-brand-white/70 space-y-2">
            <li>{siteConfig.contacto.direccion}</li>
            <li>
              <a href={`tel:${siteConfig.contacto.telefono}`} className="hover:text-brand-cream transition">
                {siteConfig.contacto.telefono}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.contacto.email}`} className="hover:text-brand-cream transition">
                {siteConfig.contacto.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-brand-cream">Síguenos</h4>
          <div className="flex gap-4 mb-6">
            <a
              href={siteConfig.contacto.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full border border-brand-white/20 flex items-center justify-center hover:bg-brand-cream hover:text-brand-dark hover:border-brand-cream transition"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.2c3.2 0 3.6 0 4.9.07 3.3.15 4.8 1.7 4.95 4.95.06 1.3.07 1.6.07 4.78 0 3.18-.01 3.48-.07 4.78-.15 3.25-1.65 4.8-4.95 4.95-1.3.06-1.6.07-4.9.07-3.2 0-3.6-.01-4.9-.07-3.3-.15-4.8-1.71-4.95-4.95-.06-1.3-.07-1.6-.07-4.78 0-3.18.01-3.48.07-4.78.15-3.25 1.66-4.8 4.95-4.95 1.3-.06 1.7-.07 4.9-.07zM12 0C8.74 0 8.33.01 7.05.07c-4.35.2-6.78 2.62-6.98 6.98C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.35 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.4-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z" />
              </svg>
            </a>
            <a
              href={siteConfig.contacto.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full border border-brand-white/20 flex items-center justify-center hover:bg-brand-cream hover:text-brand-dark hover:border-brand-cream transition"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
              </svg>
            </a>
          </div>

          <h4 className="font-semibold mb-3 text-brand-cream">¿Quieres ayudar?</h4>
          <ul className="text-sm text-brand-white/70 space-y-2">
            <li>
              <Link href="/voluntariado" className="hover:text-brand-cream transition">
                Hazte voluntario
              </Link>
            </li>
            <li>
              <Link href="/donar" className="hover:text-brand-cream transition">
                Quiero donar
              </Link>
            </li>
          </ul>

          <Link href="/admin/login" className="block mt-6 text-xs text-brand-white/40 hover:text-brand-white/70 transition">
            Acceso al panel (equipo)
          </Link>
        </div>
      </div>
      <div className="border-t border-brand-white/10 py-5 text-center text-xs text-brand-white/50">
        © {new Date().getFullYear()} {siteConfig.nombreProtectora}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
