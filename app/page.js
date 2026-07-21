import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/lib/siteConfig';
import CampaignCarousel from '@/components/CampaignCarousel';
import HeartIcon from '@/components/HeartIcon';

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="container-page pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fadeInUp">
          <span className="tag-pill mb-5">Protectora de animales</span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight mb-6">
            {siteConfig.eslogan}
          </h1>
          <p className="text-brand-dark/70 text-lg mb-8 max-w-md">
            {siteConfig.descripcionCorta}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/animales" className="btn-primary">
              Ver animales en adopción
            </Link>
            <Link href="/animales?tag=Acogida" className="btn-outline">
              Quiero acoger
            </Link>
            <Link href="/donar" className="btn-donate">
              <HeartIcon /> ¡Quiero donar!
            </Link>
          </div>
        </div>

        <div className="relative aspect-square rounded-3xl overflow-hidden shadow-softLg animate-softPulse">
          <Image
            src="/hero-animals.svg"
            alt="Animales de la protectora"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute -bottom-6 -left-6 w-28 h-28 sm:w-36 sm:h-36 drop-shadow-xl">
            <Image
              src="/logo.svg"
              alt={`Sello de ${siteConfig.nombreProtectora}`}
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* CAMPAÑAS ACTIVAS */}
      <CampaignCarousel />

      {/* SOBRE NOSOTROS */}
      <section id="sobre-nosotros" className="bg-brand-cream/30 py-20">
        <div className="container-page grid md:grid-cols-3 gap-8 text-center">
          {[
            { titulo: 'Rescatamos', texto: 'Animales abandonados o en riesgo reciben refugio inmediato.' },
            { titulo: 'Cuidamos', texto: 'Veterinario, alimentación y cariño mientras esperan un hogar.' },
            { titulo: 'Conectamos', texto: 'Buscamos familias responsables para adopción o acogida.' },
          ].map((b) => (
            <div key={b.titulo} className="card p-8">
              <h3 className="font-display text-xl font-semibold mb-3">{b.titulo}</h3>
              <p className="text-brand-dark/70">{b.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="container-page py-20 text-center">
        <h2 className="font-display text-3xl font-semibold mb-4">
          ¿Listo para cambiar una vida?
        </h2>
        <p className="text-brand-dark/70 mb-8 max-w-lg mx-auto">
          Descubre a todos los animales que están esperando un hogar y encuentra a tu nuevo mejor amigo.
        </p>
        <Link href="/animales" className="btn-primary">
          Ver todos los animales
        </Link>
      </section>
    </div>
  );
}
