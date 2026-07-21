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
          <div className="flex gap-4 text-sm">
            <a href={siteConfig.contacto.instagram} target="_blank" rel="noreferrer" className="hover:text-brand-cream transition">
              Instagram
            </a>
            <a href={siteConfig.contacto.facebook} target="_blank" rel="noreferrer" className="hover:text-brand-cream transition">
              Facebook
            </a>
          </div>
          <Link href="/admin/login" className="block mt-6 text-xs text-brand-white/40 hover:text-brand-white/70 transition">
            Acceso voluntarios
          </Link>
        </div>
      </div>
      <div className="border-t border-brand-white/10 py-5 text-center text-xs text-brand-white/50">
        © {new Date().getFullYear()} {siteConfig.nombreProtectora}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
