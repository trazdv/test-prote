'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { siteConfig } from '@/lib/siteConfig';

export default function FormularioAdopcionPage({ params }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tipo = searchParams.get('tipo') === 'acogida' ? 'acogida' : 'adopcion';

  const [animal, setAnimal] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', mensaje: '' });

  useEffect(() => {
    fetch(`/api/animals/${params.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(setAnimal);
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    const config = siteConfig.googleForms[tipo];
    const data = new FormData();
    data.append(config.entries.nombreSolicitante, form.nombre);
    data.append(config.entries.email, form.email);
    data.append(config.entries.telefono, form.telefono);
    data.append(config.entries.mensaje, form.mensaje);
    data.append(config.entries.nombreAnimal, animal?.name || '');
    data.append(config.entries.tipoSolicitud, tipo === 'acogida' ? 'Acogida' : 'Adopción');

    try {
      // 'no-cors' es necesario porque Google Forms no permite leer la respuesta
      // desde otro dominio, pero el envío sí se registra correctamente.
      await fetch(config.actionUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: data,
      });
    } catch (err) {
      // Aunque falle la lectura de la respuesta (esperado con no-cors),
      // seguimos adelante y mostramos la confirmación al usuario.
    }

    const query = new URLSearchParams({
      nombre: animal?.name || 'este animal',
      tipo,
    });
    router.push(`/gracias?${query.toString()}`);
  };

  return (
    <div className="container-page py-14 max-w-xl">
      <h1 className="font-display text-3xl font-semibold mb-2">
        {tipo === 'acogida' ? 'Solicitud de acogida' : 'Solicitud de adopción'}
      </h1>
      <p className="text-brand-dark/70 mb-8">
        {animal ? (
          <>
            Estás a punto de solicitar {tipo === 'acogida' ? 'la acogida' : 'la adopción'} de{' '}
            <strong>{animal.name}</strong>. Completa tus datos y nos pondremos en contacto contigo.
          </>
        ) : (
          'Completa tus datos y nos pondremos en contacto contigo.'
        )}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Nombre completo</label>
          <input
            required
            className="input-field"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input
            required
            type="email"
            className="input-field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Teléfono</label>
          <input
            required
            type="tel"
            className="input-field"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Cuéntanos por qué quieres {tipo === 'acogida' ? 'acogerlo' : 'adoptarlo'}
          </label>
          <textarea
            required
            rows={4}
            className="input-field"
            value={form.mensaje}
            onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
          />
        </div>

        <button type="submit" disabled={enviando} className="btn-primary w-full disabled:opacity-60">
          {enviando ? 'Enviando...' : 'Enviar solicitud'}
        </button>
      </form>
    </div>
  );
}
