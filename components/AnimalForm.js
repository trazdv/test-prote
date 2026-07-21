'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { siteConfig } from '@/lib/siteConfig';

const emptyAnimal = {
  name: '',
  species: siteConfig.especies[0],
  sex: 'Macho',
  age: '',
  description: '',
  tags: [],
  photos: [],
};

export default function AnimalForm({ initialAnimal, animalId }) {
  const router = useRouter();
  const isEditing = Boolean(animalId);
  const [animal, setAnimal] = useState(initialAnimal || emptyAnimal);
  const [newTag, setNewTag] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (field, value) => setAnimal((prev) => ({ ...prev, [field]: value }));

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setError('');

    try {
      const urls = [];
      for (const file of files) {
        const data = new FormData();
        data.append('file', file);
        data.append('bucket', 'animal-photos');
        const res = await fetch('/api/upload', { method: 'POST', body: data });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Error al subir la imagen');
        urls.push(json.url);
      }
      update('photos', [...(animal.photos || []), ...urls]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (url) => {
    update('photos', animal.photos.filter((p) => p !== url));
  };

  const addTag = (tag) => {
    const clean = tag.trim();
    if (!clean || animal.tags.includes(clean)) return;
    update('tags', [...animal.tags, clean]);
    setNewTag('');
  };

  const removeTag = (tag) => {
    update('tags', animal.tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isEditing ? `/api/animals/${animalId}` : '/api/animals';
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(animal),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al guardar');
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Nombre</label>
          <input
            required
            className="input-field"
            value={animal.name}
            onChange={(e) => update('name', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Edad</label>
          <input
            className="input-field"
            placeholder="Ej. 2 años"
            value={animal.age}
            onChange={(e) => update('age', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Tipo de animal</label>
          <select
            className="input-field"
            value={animal.species}
            onChange={(e) => update('species', e.target.value)}
          >
            {siteConfig.especies.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Sexo</label>
          <select
            className="input-field"
            value={animal.sex}
            onChange={(e) => update('sex', e.target.value)}
          >
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Descripción</label>
        <textarea
          rows={5}
          className="input-field"
          value={animal.description}
          onChange={(e) => update('description', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Etiquetas</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {animal.tags.map((tag) => (
            <span key={tag} className="tag-pill flex items-center gap-2">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="text-brand-dark/50 hover:text-brand-dark">
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {siteConfig.etiquetasSugeridas
            .filter((t) => !animal.tags.includes(t))
            .map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => addTag(t)}
                className="text-xs rounded-full border border-brand-dark/20 px-3 py-1 hover:bg-brand-cream/50 transition"
              >
                + {t}
              </button>
            ))}
        </div>
        <div className="flex gap-2">
          <input
            className="input-field"
            placeholder="Añadir etiqueta personalizada"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag(newTag);
              }
            }}
          />
          <button type="button" onClick={() => addTag(newTag)} className="btn-outline px-4">
            Añadir
          </button>
        </div>
        <p className="text-xs text-brand-dark/50 mt-2">
          Consejo: usa la etiqueta <strong>Acogida</strong> para que aparezca el botón
          "¡Quiero acogerlo!" en la ficha del animal.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Fotos</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {(animal.photos || []).map((url) => (
            <div key={url} className="relative w-24 h-24 rounded-2xl overflow-hidden group">
              <Image src={url} alt="Foto del animal" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(url)}
                className="absolute inset-0 bg-brand-dark/60 text-brand-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-sm"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" multiple onChange={handleFileChange} disabled={uploading} />
        {uploading && <p className="text-sm text-brand-dark/50 mt-2">Subiendo fotos...</p>}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button type="submit" disabled={saving || uploading} className="btn-primary disabled:opacity-60">
        {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear animal'}
      </button>
    </form>
  );
}
