'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

function formatFecha(fecha) {
  if (!fecha) return null;
  return new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AdminCampanasPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/campaigns');
    const data = await res.json();
    setCampaigns(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`¿Seguro que quieres eliminar la campaña "${title}"?`)) return;
    await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="container-page py-14">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-3xl font-semibold mb-1">Campañas</h1>
          <p className="text-brand-dark/60 text-sm">
            Campamentos, sorteos, merchandising y otras recaudaciones.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/campanas/nueva" className="btn-primary">
            + Añadir campaña
          </Link>
          <Link href="/admin" className="btn-outline">
            Volver a animales
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-brand-dark/50">Cargando...</p>
      ) : campaigns.length === 0 ? (
        <p className="text-brand-dark/50">Todavía no hay campañas. ¡Añade la primera!</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <div key={c.id} className="card p-4">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-brand-cream/30">
                <Image
                  src={c.cover_photo || c.photos?.[0] || '/placeholder-animal.svg'}
                  alt={c.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-display font-semibold text-lg mb-1">{c.title}</h3>
              <p className="text-sm text-brand-dark/60 mb-4">
                {formatFecha(c.start_date)}
                {c.end_date ? ` – ${formatFecha(c.end_date)}` : ' · sin fin'}
              </p>
              <div className="flex gap-3">
                <Link href={`/admin/campanas/${c.id}`} className="btn-outline text-sm px-4 py-2 flex-1 text-center">
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(c.id, c.title)}
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
