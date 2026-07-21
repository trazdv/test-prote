'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const emptyCampaign = {
  title: '',
  description: '',
  info2: '',
  start_date: new Date().toISOString().slice(0, 10),
  end_date: '',
  photos: [],
};

export default function CampaignForm({ initialCampaign, campaignId }) {
  const router = useRouter();
  const isEditing = Boolean(campaignId);
  const [campaign, setCampaign] = useState(initialCampaign || emptyCampaign);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (field, value) => setCampaign((prev) => ({ ...prev, [field]: value }));

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
          onChange={(e) => update('title', e.target.value)}
        />
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
        <textarea
          rows={4}
          className="input-field"
          placeholder="En qué consiste la campaña..."
          value={campaign.description}
          onChange={(e) => update('description', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">
          Cuadro "¿Te interesa?" (cómo participar o comprar)
        </label>
        <textarea
          rows={4}
          className="input-field"
          placeholder="Ej. Puedes comprar tu boleto por 2€ escribiéndonos a... / El juego de mesa se puede reservar en..."
          value={campaign.info2}
          onChange={(e) => update('info2', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Fotos</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {(campaign.photos || []).map((url) => (
            <div key={url} className="relative w-24 h-24 rounded-2xl overflow-hidden group">
              <Image src={url} alt="Foto de la campaña" fill className="object-cover" />
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
        {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear campaña'}
      </button>
    </form>
  );
}
