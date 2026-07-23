'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function AdminPortadaPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const cargar = async () => {
    setLoading(true);
    const res = await fetch('/api/hero-photos');
    setPhotos(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setError('');

    try {
      for (const file of files) {
        const data = new FormData();
        data.append('file', file);
        data.append('bucket', 'hero-photos');
        const res = await fetch('/api/upload', { method: 'POST', body: data });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Error al subir la imagen');

        await fetch('/api/hero-photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: json.url }),
        });
      }
      cargar();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta foto del carrusel de portada?')) return;
    await fetch(`/api/hero-photos/${id}`, { method: 'DELETE' });
    cargar();
  };

  return (
    <div className="container-page py-14 max-w-2xl">
      <h1 className="font-display text-3xl font-semibold mb-2">Carrusel de portada</h1>
      <p className="text-brand-dark/60 mb-8">
        Estas son las fotos que se muestran, rotando automáticamente, en la imagen grande de la
        página principal. Si no hay ninguna, se muestra una ilustración de ejemplo.
      </p>

      {loading ? (
        <p className="text-brand-dark/50">Cargando...</p>
      ) : (
        <div className="flex flex-wrap gap-4 mb-8">
          {photos.map((photo) => (
            <div key={photo.id} className="relative w-32 h-32 rounded-2xl overflow-hidden group">
              <Image src={photo.url} alt="Foto de portada" fill className="object-cover" />
              <button
                onClick={() => handleDelete(photo.id)}
                className="absolute inset-0 bg-brand-dark/60 text-brand-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-sm"
              >
                Eliminar
              </button>
            </div>
          ))}
          {photos.length === 0 && (
            <p className="text-brand-dark/50 text-sm">
              Todavía no has subido ninguna foto: se está mostrando la ilustración de ejemplo.
            </p>
          )}
        </div>
      )}

      <div className="card p-6">
        <h2 className="font-semibold mb-3">Añadir fotos</h2>
        <input type="file" accept="image/*" multiple onChange={handleFileChange} disabled={uploading} />
        {uploading && <p className="text-sm text-brand-dark/50 mt-2">Subiendo...</p>}
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        <p className="text-xs text-brand-dark/50 mt-3">
          Consejo: usa fotos horizontales o cuadradas, a ser posible con buena luz y protagonismo de
          los animales, para que se vean bien recortadas en el carrusel.
        </p>
      </div>
    </div>
  );
}
