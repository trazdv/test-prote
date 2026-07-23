'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Carousel from '@/components/Carousel';
import TagBadge from '@/components/TagBadge';

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

  const puedeAcoger = (animal.tags || []).some(
    (t) => t.toLowerCase() === 'acogida'
  );

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
          <Link
            href={`/adopcion/${animal.slug}?tipo=adopcion`}
            className="btn-primary"
          >
            ¡Quiero adoptarlo!
          </Link>
          {puedeAcoger && (
            <Link
              href={`/adopcion/${animal.slug}?tipo=acogida`}
              className="btn-secondary"
            >
              ¡Quiero acogerlo!
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
