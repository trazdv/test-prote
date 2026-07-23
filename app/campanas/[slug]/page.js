'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Carousel from '@/components/Carousel';

function formatFecha(fecha) {
  if (!fecha) return null;
  return new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function CampanaDetailPage({ params }) {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/campaigns/by-slug/${params.slug}`, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setCampaign(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [params.slug]);

  if (loading) {
    return <div className="container-page py-20 text-brand-dark/50">Cargando...</div>;
  }
  if (error || !campaign) {
    return notFound();
  }

  const CuadroInteresa = ({ className }) =>
    campaign.info2 ? (
      <div className={`card bg-brand-cream/50 p-6 ${className}`}>
        <h2 className="font-display text-xl font-semibold mb-3">¿Te interesa?</h2>
        <div
          className="rich-text text-brand-dark/80"
          dangerouslySetInnerHTML={{ __html: campaign.info2 }}
        />
      </div>
    ) : null;

  return (
    <div className="container-page py-14 grid md:grid-cols-2 gap-12">
      <div>
        <Carousel photos={campaign.photos} alt={campaign.title} />
        {/* En escritorio, el cuadro "¿Te interesa?" va justo debajo de las fotos */}
        <CuadroInteresa className="hidden md:block mt-6" />
      </div>

      <div className="animate-fadeInUp">
        <h1 className="font-display text-4xl font-semibold mb-2">{campaign.title}</h1>
        <p className="text-brand-dark/60 mb-6">
          {formatFecha(campaign.start_date)}
          {campaign.end_date ? ` – ${formatFecha(campaign.end_date)}` : ' · sin fecha de fin'}
        </p>

        {campaign.description && (
          <div
            className="rich-text text-brand-dark/80 mb-8"
            dangerouslySetInnerHTML={{ __html: campaign.description }}
          />
        )}

        {/* En móvil, el cuadro "¿Te interesa?" se queda debajo de la descripción */}
        <CuadroInteresa className="md:hidden" />
      </div>
    </div>
  );
}
