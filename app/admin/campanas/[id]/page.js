'use client';

import { useEffect, useState } from 'react';
import CampaignForm from '@/components/CampaignForm';

export default function EditarCampanaPage({ params }) {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/campaigns/${params.id}?t=${Date.now()}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setCampaign(data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return <div className="container-page py-14 text-brand-dark/50">Cargando...</div>;
  }

  return (
    <div className="container-page py-14">
      <h1 className="font-display text-3xl font-semibold mb-8">Editar "{campaign.title}"</h1>
      <CampaignForm initialCampaign={campaign} campaignId={params.id} />
    </div>
  );
}
