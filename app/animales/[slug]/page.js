'use client';

import { useEffect, useState } from 'react';
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
      const res = await fetch(`/api/animals/by-slug/${params.slug}`);
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
  }, [params.slug]);

  if (loading) {
    return <div className="container-page py-20 text-brand-dark/50">Cargando...</div>;
  }

  if (error || !animal) {
    return notFound();
  }

  const puedeAcoger = (animal.tags || []).some((t) => t.toLowerCase() === 'acogida');
  // El botón de adopción solo tiene sentido para perros y gatos con su
  // categoría (Cachorro/Adulto) rellenada; el resto son casos especiales
  // gestionados en privado, sin formulario público.
  const esPerroOGato = animal.species === 'Perro' || animal.species === 'Gato';
  const tieneCategoria = (animal.tags || []).some((t) => t === 'Cachorro' || t === 'Adulto');
  const puedeAdoptar = esPerroOGato && tieneCategoria;

  return (
    <div className="container-page py-14 grid md:grid-cols-2 gap-12">
      <Carousel photos={animal.photos} alt={animal.name} />

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

        <p className="text-brand-dark/80 leading-relaxed whitespace-pre-line mb-10">
          {animal.description}
        </p>

        <div className="flex flex-wrap gap-4">
          {puedeAdoptar && (
            <a
              href={getAdoptionFormUrl(animal)}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              ¡Quiero adoptarlo!
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
      </div>
    </div>
  );
}
