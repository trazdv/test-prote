'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Carousel from '@/components/Carousel';
import TagBadge from '@/components/TagBadge';
import { siteConfig } from '@/lib/siteConfig';

function getAdoptionFormUrl(animal) {
  const especie = animal.species === 'Gato' ? 'gato' : 'perro';
  const esCachorro = (animal.tags || []).includes('Cachorro');
  const clave = `${especie}_${esCachorro ? 'cachorro' : 'adulto'}`;
  return siteConfig.formulariosExternos.adopcion[clave];
}

export default function AnimalDetailPage({ params }) {
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/animals/by-slug/${params.slug}?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) {
        setError(true);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setAnimal(data);
      setLoading(false);
    };
    load();

    // Si el usuario vuelve a esta página con el botón "atrás" del navegador,
    // este a veces la restaura tal cual estaba (sin volver a pedir datos).
    // Forzamos una recarga de datos en ese caso concreto.
    const handlePageShow = (event) => {
      if (event.persisted) load();
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [params.slug]);

  if (loading) {
    return <div className="container-page py-20 text-brand-dark/50">Cargando...</div>;
  }

  if (error || !animal) {
    return notFound();
  }

  const puedeAcoger = (animal.tags || []).some((t) => t.toLowerCase() === 'acogida');
  const esPerroOGato = animal.species === 'Perro' || animal.species === 'Gato';
  const tieneCategoria = (animal.tags || []).some((t) => t === 'Cachorro' || t === 'Adulto');
  const puedeAdoptar = esPerroOGato && tieneCategoria;
  const textoAdoptar = animal.sex === 'Hembra' ? '¡Quiero adoptarla!' : '¡Quiero adoptarlo!';

  const Botones = ({ className }) => (
    <div className={className}>
      {animal.paired_animal && (
        <div className="w-full card bg-brand-cream/50 p-4 text-sm text-brand-dark/80">
          {animal.name} se adopta junto a{' '}
          <Link href={`/animales/${animal.paired_animal.slug}`} className="font-semibold underline hover:no-underline">
            {animal.paired_animal.name}
          </Link>
          , no pueden ser adoptados de forma individual.
        </div>
      )}
      {puedeAdoptar && (
        <a
          href={getAdoptionFormUrl(animal)}
          target="_blank"
          rel="noreferrer"
          className="btn-primary"
        >
          {textoAdoptar}
        </a>
      )}
      {puedeAcoger && (
        <a
          href={siteConfig.formulariosExternos.acogida}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary"
        >
          ¡Quiero acogerlo!
        </a>
      )}
    </div>
  );

  return (
    <div className="container-page py-14 grid md:grid-cols-2 gap-12">
      <div>
        <Carousel photos={animal.photos} alt={animal.name} />
        {/* En escritorio, los botones van justo debajo de las fotos para que
            no queden muy abajo si la descripción es larga. */}
        <Botones className="hidden md:flex flex-wrap gap-4 mt-6" />
      </div>

      <div className="animate-fadeInUp">
        <h1 className="font-display text-4xl font-semibold mb-2">{animal.name}</h1>
        <p className="text-brand-dark/60 mb-5">
          {animal.species} · {animal.sex} · {animal.age}
        </p>

        <div className="flex flex-wrap mb-6">
          {(animal.tags || []).map((tag) => (
            <TagBadge key={tag}>{tag}</TagBadge>
          ))}
        </div>

        <div
          className="rich-text text-brand-dark/80 mb-10"
          dangerouslySetInnerHTML={{ __html: animal.description || '' }}
        />

        {/* En móvil, los botones se quedan aquí como hasta ahora. */}
        <Botones className="flex md:hidden flex-wrap gap-4" />
      </div>
    </div>
  );
}
