'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { slugify } from '@/lib/slugify';
import RichTextEditor from './RichTextEditor';

const emptyCampaign = {
  title: '',
  slug: '',
  description: '',
  info2: '',
  start_date: new Date().toISOString().slice(0, 10),
  end_date: '',
  photos: [],
  coverPhoto: null,
};

export default function CampaignForm({ initialCampaign, campaignId }) {
  const router = useRouter();
  const isEditing = Boolean(campaignId);
  const [campaign, setCampaign] = useState(
    initialCampaign
      ? { ...emptyCampaign, ...initialCampaign, coverPhoto: initialCampaign.cover_photo ?? initialCampaign.coverPhoto ?? null }
      : emptyCampaign
  );
  const [slugTocado, setSlugTocado] = useState(isEditing);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (field, value) => setCampaign((prev) => ({ ...prev, [field]: value }));

  const handleTitleChange = (value) => {
    update('title', value);
    if (!slugTocado) {
      update('slug', slugify(value));
    }
  };

  const handleSlugChange = (value) => {
    setSlugTocado(true);
    update('slug', slugify(value));
  };

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
        data.append('bucket', 'campaign-photos');
        const res = await fetch('/api/upload', { method: 'POST', body: data });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Error al subir la imagen');
        urls.push(json.url);
      }
      update('photos', [...(campaign.photos || []), ...urls]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (url) => {
    update('photos', campaign.photos.filter((p) => p !== url));
    if (campaign.coverPhoto === url) {
      update('coverPhoto', null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isEditing ? `/api/campaigns/${campaignId}` : '/api/campaigns';
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaign),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al guardar');
      router.push('/admin/campanas');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium mb-1.5">Título de la campaña</label>
        <input
          required
          className="input-field"
          placeholder="Ej. Campamento de verano 2026"
          value={campaign.title}
          onChange={(e) => handleTitleChange(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">URL de la campaña</label>
        <input
          required
          className="input-field"
          value={campaign.slug}
          onChange={(e) => handleSlugChange(e.target.value)}
        />
        <p className="text-xs text-brand-dark/50 mt-1.5">
          Así se verá: tuprotectora.org/campanas/<strong>{campaign.slug || 'ejemplo'}</strong>. Solo
          letras, números y guiones.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Fecha de inicio</label>
          <input
            required
            type="date"
            className="input-field"
            value={campaign.start_date}
            onChange={(e) => update('start_date', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Fecha de fin (opcional)</label>
          <input
            type="date"
            className="input-field"
            value={campaign.end_date || ''}
            onChange={(e) => update('end_date', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Descripción general</label>
        <RichTextEditor
          value={campaign.description}
          onChange={(html) => update('description', html)}
          placeholder="En qué consiste la campaña..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">
          Cuadro "¿Te interesa?" (cómo participar o comprar)
        </label>
        <RichTextEditor
          value={campaign.info2}
          onChange={(html) => update('info2', html)}
          placeholder="Ej. Puedes comprar tu boleto por 2€ escribiéndonos a... / El juego de mesa se puede reservar en..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Fotos</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {(campaign.photos || []).map((url) => {
            const esPortada = (campaign.coverPhoto || campaign.photos[0]) === url;
            return (
              <div key={url} className="relative w-24 h-24 rounded-2xl overflow-hidden group">
                <Image src={url} alt="Foto de la campaña" fill className="object-cover" />
                {esPortada && (
                  <span className="absolute top-1 left-1 bg-brand-cream text-brand-dark text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    Portada
                  </span>
                )}
                <div className="absolute inset-0 bg-brand-dark/60 text-brand-white opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1 text-xs">
                  {!esPortada && (
                    <button type="button" onClick={() => update('coverPhoto', url)} className="underline">
                      Usar como portada
                    </button>
                  )}
                  <button type="button" onClick={() => removePhoto(url)} className="underline">
                    Quitar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <input type="file" accept="image/*" multiple onChange={handleFileChange} disabled={uploading} />
        {uploading && <p className="text-sm text-brand-dark/50 mt-2">Subiendo fotos...</p>}
        <p className="text-xs text-brand-dark/50 mt-2">
          La foto marcada como "Portada" es la que aparece en el listado de campañas. Si no eliges
          ninguna, se usa la primera foto subida.
        </p>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button type="submit" disabled={saving || uploading} className="btn-primary disabled:opacity-60">
        {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear campaña'}
      </button>
    </form>
  );
}
