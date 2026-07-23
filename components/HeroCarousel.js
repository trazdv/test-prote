'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { siteConfig } from '@/lib/siteConfig';

export default function HeroCarousel() {
  const [photos, setPhotos] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch('/api/hero-photos', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setPhotos(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
  }, []);

  const items = photos.length ? photos.map((p) => p.url) : ['/hero-animals.svg'];

  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <div className="relative aspect-square rounded-3xl overflow-hidden shadow-softLg">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <Image
            src={items[index]}
            alt="Animales de la protectora"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </motion.div>
      </AnimatePresence>

      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Ir a foto ${i + 1}`}
              className={`w-2 h-2 rounded-full transition ${
                i === index ? 'bg-brand-white' : 'bg-brand-white/40'
              }`}
            />
          ))}
        </div>
      )}

      <div className="absolute -bottom-6 -left-6 w-28 h-28 sm:w-36 sm:h-36 drop-shadow-xl">
        <Image
          src="/logo.svg"
          alt={`Sello de ${siteConfig.nombreProtectora}`}
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}
