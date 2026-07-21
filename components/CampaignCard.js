'use client';

import Link from 'next/link';
import Image from 'next/image';

function formatFecha(fecha) {
  if (!fecha) return null;
  return new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function CampaignCard({ campaign }) {
  const cover = campaign.photos?.[0] || '/placeholder-animal.svg';

  return (
    <Link href={`/campanas/${campaign.id}`} className="card group block overflow-hidden hover:-translate-y-1 h-full">
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-3xl bg-brand-cream/30">
        <Image
          src={cover}
          alt={campaign.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold mb-2">{campaign.title}</h3>
        <p className="text-sm text-brand-dark/70 line-clamp-2 mb-2">{campaign.description}</p>
        <p className="text-xs text-brand-dark/50">
          {formatFecha(campaign.start_date)}
          {campaign.end_date ? ` – ${formatFecha(campaign.end_date)}` : ' · sin fecha de fin'}
        </p>
      </div>
    </Link>
  );
}
