'use client';

import { useEffect, useState } from 'react';
import CampaignCard from '@/components/CampaignCard';

export default function CampanasPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/campaigns?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setCampaigns(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const hoy = new Date().toISOString().slice(0, 10);
  const activas = campaigns.filter((c) => c.start_date <= hoy && (!c.end_date || c.end_date >= hoy));
  const pasadas = campaigns.filter((c) => !activas.includes(c));

  return (
    <div className="container-page py-14">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-2">Campañas</h1>
      <p className="text-brand-dark/70 mb-10">
        Actividades y recaudaciones con las que nos ayudas a seguir rescatando animales.
      </p>

      {loading ? (
        <p className="text-brand-dark/50">Cargando...</p>
      ) : (
        <>
          {activas.length > 0 && (
            <div className="mb-14">
              <h2 className="font-display text-xl font-semibold mb-5">Activas ahora</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {activas.map((c) => (
                  <CampaignCard key={c.id} campaign={c} />
                ))}
              </div>
            </div>
          )}

          {pasadas.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-semibold mb-5 text-brand-dark/60">
                Campañas anteriores
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 opacity-70">
                {pasadas.map((c) => (
                  <CampaignCard key={c.id} campaign={c} />
                ))}
              </div>
            </div>
          )}

          {campaigns.length === 0 && (
            <p className="text-brand-dark/50">Todavía no hay campañas publicadas.</p>
          )}
        </>
      )}
    </div>
  );
}
