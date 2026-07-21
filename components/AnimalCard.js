'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import TagBadge from './TagBadge';

export default function AnimalCard({ animal, index = 0 }) {
  const cover = animal.photos?.[0] || '/placeholder-animal.svg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
    >
      <Link
        href={`/animales/${animal.id}`}
        className="card group block overflow-hidden hover:-translate-y-1"
      >
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-3xl bg-brand-cream/30">
          <Image
            src={cover}
            alt={animal.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-lg font-semibold">{animal.name}</h3>
            <span className="text-xs text-brand-dark/60">{animal.age}</span>
          </div>
          <p className="text-sm text-brand-dark/70 mb-3">
            {animal.species} · {animal.sex}
          </p>
          <div className="flex flex-wrap">
            {(animal.tags || []).slice(0, 3).map((tag) => (
              <TagBadge key={tag}>{tag}</TagBadge>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
