'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

export default function Carousel({ photos = [], alt = '' }) {
  const [index, setIndex] = useState(0);
  const items = photos.length ? photos : ['/placeholder-animal.svg'];

  const go = (dir) => {
    setIndex((prev) => (prev + dir + items.length) % items.length);
  };

  return (
    <div className="relative w-full aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-brand-cream/30 shadow-soft">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <Image
            src={items[index]}
            alt={`${alt} - foto ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {items.length > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            aria-label="Foto anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-brand-white/80 hover:bg-brand-white rounded-full w-10 h-10 flex items-center justify-center shadow-soft transition"
          >
            ‹
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Foto siguiente"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-brand-white/80 hover:bg-brand-white rounded-full w-10 h-10 flex items-center justify-center shadow-soft transition"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Ir a foto ${i + 1}`}
                className={`w-2 h-2 rounded-full transition ${
                  i === index ? 'bg-brand-dark' : 'bg-brand-dark/25'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
