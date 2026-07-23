'use client';

import { siteConfig } from '@/lib/siteConfig';

export default function FilterBar({ especie, sexo, soloAcogida, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-10">
      <select
        value={especie}
        onChange={(e) => onChange({ especie: e.target.value, sexo, soloAcogida })}
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
        onChange={(e) => onChange({ especie, sexo: e.target.value, soloAcogida })}
        className="input-field w-auto"
      >
        <option value="">Macho y hembra</option>
        <option value="Macho">Macho</option>
        <option value="Hembra">Hembra</option>
      </select>

      <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
        <input
          type="checkbox"
          checked={soloAcogida}
          onChange={(e) => onChange({ especie, sexo, soloAcogida: e.target.checked })}
          className="w-4 h-4 accent-brand-dark"
        />
        Solo en acogida
      </label>

      {(especie || sexo || soloAcogida) && (
        <button
          onClick={() => onChange({ especie: '', sexo: '', soloAcogida: false })}
          className="text-sm underline text-brand-dark/60 hover:text-brand-dark transition"
        >
          Quitar filtros
        </button>
      )}
    </div>
  );
}
