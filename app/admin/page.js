'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const esSuperadmin = session?.user?.role === 'superadmin';
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/animals');
    const data = await res.json();
    setAnimals(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Seguro que quieres eliminar a ${name}? Esta acción no se puede deshacer.`)) {
      return;
    }
    await fetch(`/api/animals/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="container-page py-14">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-1">Panel de administración</h1>
          <p className="text-brand-dark/60 text-sm">Gestiona las fichas de los animales de la protectora.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/nuevo" className="btn-primary">
            + Añadir animal
          </Link>
          <Link href="/admin/campanas" className="btn-outline">
            Gestionar campañas
          </Link>
          <Link href="/admin/portada" className="btn-outline">
            Carrusel de portada
          </Link>
          {esSuperadmin && (
            <Link href="/admin/usuarios" className="btn-outline">
              Gestionar cuentas
            </Link>
          )}
          <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-outline">
            Cerrar sesión
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-brand-dark/50">Cargando...</p>
      ) : animals.length === 0 ? (
        <p className="text-brand-dark/50">Todavía no hay animales. ¡Añade el primero!</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {animals.map((animal) => (
            <div key={animal.id} className="card p-4">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-brand-cream/30">
                <Image
                  src={animal.cover_photo || animal.photos?.[0] || '/placeholder-animal.svg'}
                  alt={animal.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-display font-semibold text-lg mb-1">{animal.name}</h3>
              <p className="text-sm text-brand-dark/60 mb-4">
                {animal.species} · {animal.sex} · {animal.age}
              </p>
              <div className="flex gap-3">
                <Link href={`/admin/${animal.id}`} className="btn-outline text-sm px-4 py-2 flex-1 text-center">
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(animal.id, animal.name)}
                  className="text-sm px-4 py-2 rounded-full border-2 border-red-300 text-red-600 hover:bg-red-50 transition flex-1"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
