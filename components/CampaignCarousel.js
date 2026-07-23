'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

export default function CampaignCarousel() {
  const [campaigns, setCampaigns] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      if (!Array.isArray(data)) {
        setLoading(false);
        return;
      }

      const hoy = new Date().toISOString().slice(0, 10);
      const activas = data.filter(
        (c) => c.start_date <= hoy && (!c.end_date || c.end_date >= hoy)
      );
      setCampaigns(activas);
      setLoading(false);
    };
    load();
  }, []);

  const go = useCallback(
    (dir) => {
      setIndex((prev) => (prev + dir + campaigns.length) % campaigns.length);
    },
    [campaigns.length]
  );

  useEffect(() => {
    if (campaigns.length < 2) return;
    const timer = setInterval(() => go(1), 6000);
    return () => clearInterval(timer);
  }, [campaigns.length, go]);

  if (loading || campaigns.length === 0) return null;

  const campaign = campaigns[index];
  const cover = campaign.photos?.[0] || '/placeholder-animal.svg';

  return (
    <section className="container-page py-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold">
          Campañas activas
        </h2>
        <Link href="/campanas" className="text-sm font-semibold underline hover:opacity-70 transition">
          Ver todas
        </Link>
      </div>

      <div className="relative rounded-3xl overflow-hidden shadow-softLg bg-brand-cream/20">
        <AnimatePresence mode="wait">
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="grid md:grid-cols-2"
          >
            <div className="relative w-full aspect-[4/3] md:aspect-auto">
              <Image src={cover} alt={campaign.title} fill className="object-cover" />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <h3 className="font-display text-2xl font-semibold mb-3">{campaign.title}</h3>
              <p className="text-brand-dark/70 mb-6 line-clamp-3">{campaign.description}</p>
              <Link href={`/campanas/${campaign.slug}`} className="btn-primary w-fit">
                Ver más
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {campaigns.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Campaña anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-brand-white/80 hover:bg-brand-white rounded-full w-10 h-10 flex items-center justify-center shadow-soft transition"
            >
              ‹
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Siguiente campaña"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-brand-white/80 hover:bg-brand-white rounded-full w-10 h-10 flex items-center justify-center shadow-soft transition"
            >
              ›
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {campaigns.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setIndex(i)}
                  aria-label={`Ir a campaña ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition ${
                    i === index ? 'bg-brand-dark' : 'bg-brand-dark/25'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
