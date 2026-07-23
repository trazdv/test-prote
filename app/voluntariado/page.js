'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { siteConfig } from '@/lib/siteConfig';

export default function VoluntariadoPage() {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    disponibilidad: '',
    mensaje: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    const config = siteConfig.googleForms.voluntariado;
    const data = new FormData();
    data.append(config.entries.nombreSolicitante, form.nombre);
    data.append(config.entries.email, form.email);
    data.append(config.entries.telefono, form.telefono);
    data.append(config.entries.disponibilidad, form.disponibilidad);
    data.append(config.entries.mensaje, form.mensaje);

    try {
      await fetch(config.actionUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: data,
      });
    } catch (err) {
      // Es normal que falle la lectura de la respuesta con 'no-cors';
      // el envío en sí sí que llega a Google Forms.
    }

    router.push('/gracias?tipo=voluntariado');
  };

  return (
    <div className="container-page py-14 max-w-xl">
      <h1 className="font-display text-3xl font-semibold mb-2">Hazte voluntario</h1>
      <p className="text-brand-dark/70 mb-8">
        Gracias por querer ayudarnos. Cuéntanos un poco sobre ti y nos pondremos en contacto
        contigo lo antes posible.
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
            ¿Qué disponibilidad tienes? (días, horas a la semana...)
          </label>
          <input
            className="input-field"
            placeholder="Ej. Fines de semana, 2-3 horas"
            value={form.disponibilidad}
            onChange={(e) => setForm({ ...form, disponibilidad: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Cuéntanos por qué quieres ser voluntario/a
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
