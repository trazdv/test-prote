'use client';

import { siteConfig } from '@/lib/siteConfig';

export default function FilterBar({ especie, sexo, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 mb-10">
      <select
        value={especie}
        onChange={(e) => onChange({ especie: e.target.value, sexo })}
        className="input-field w-auto"
      >
        <option value="">Todos los tipos</option>
        {siteConfig.especies.map((e) => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>

      <select
        value={sexo}
        onChange={(e) => onChange({ especie, sexo: e.target.value })}
        className="input-field w-auto"
      >
        <option value="">Macho y hembra</option>
        <option value="Macho">Macho</option>
        <option value="Hembra">Hembra</option>
      </select>

      {(especie || sexo) && (
        <button
          onClick={() => onChange({ especie: '', sexo: '' })}
          className="text-sm underline text-brand-dark/60 hover:text-brand-dark transition"
        >
          Quitar filtros
        </button>
      )}
    </div>
  );
}
