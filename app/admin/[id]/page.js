'use client';

import { useEffect, useState } from 'react';
import AnimalForm from '@/components/AnimalForm';

export default function EditarAnimalPage({ params }) {
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/animals/${params.id}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setAnimal(data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return <div className="container-page py-14 text-brand-dark/50">Cargando...</div>;
  }

  return (
    <div className="container-page py-14">
      <h1 className="font-display text-3xl font-semibold mb-8">Editar a {animal.name}</h1>
      <AnimalForm initialAnimal={animal} animalId={params.id} />
    </div>
  );
}
