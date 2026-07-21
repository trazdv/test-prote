'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AnimalCard from '@/components/AnimalCard';
import FilterBar from '@/components/FilterBar';

export default function AnimalesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [especie, setEspecie] = useState(searchParams.get('especie') || '');
  const [sexo, setSexo] = useState(searchParams.get('sexo') || '');
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnimals = useCallback(async (esp, sx) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (esp) params.set('especie', esp);
    if (sx) params.set('sexo', sx);
    const res = await fetch(`/api/animals?${params.toString()}`);
    const data = await res.json();
    setAnimals(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAnimals(especie, sexo);
  }, [especie, sexo, fetchAnimals]);

  const handleChange = ({ especie: e, sexo: s }) => {
    setEspecie(e);
    setSexo(s);
    const params = new URLSearchParams();
    if (e) params.set('especie', e);
    if (s) params.set('sexo', s);
    router.push(`/animales?${params.toString()}`);
  };

  return (
    <div className="container-page py-14">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-2">
        Animales en adopción
      </h1>
      <p className="text-brand-dark/70 mb-8">
        Filtra por tipo de animal y sexo para encontrar a tu compañero ideal.
      </p>

      <FilterBar especie={especie} sexo={sexo} onChange={handleChange} />

      {loading ? (
        <p className="text-brand-dark/50">Cargando animales...</p>
      ) : animals.length === 0 ? (
        <p className="text-brand-dark/50">
          No hay animales que coincidan con estos filtros por ahora.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {animals.map((animal, i) => (
            <AnimalCard key={animal.id} animal={animal} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
