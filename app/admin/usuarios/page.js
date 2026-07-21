'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function UsuariosPage() {
  const { data: session, status } = useSession();
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creando, setCreando] = useState(false);
  const [nuevo, setNuevo] = useState({ username: '', password: '', role: 'voluntario' });

  const esSuperadmin = session?.user?.role === 'superadmin';

  const cargar = async () => {
    setLoading(true);
    const res = await fetch('/api/admin-users');
    if (res.ok) {
      setCuentas(await res.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    if (esSuperadmin) cargar();
    else setLoading(false);
  }, [esSuperadmin]);

  const handleCrear = async (e) => {
    e.preventDefault();
    setError('');
    setCreando(true);
    const res = await fetch('/api/admin-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo),
    });
    const json = await res.json();
    setCreando(false);
    if (!res.ok) {
      setError(json.error);
      return;
    }
    setNuevo({ username: '', password: '', role: 'voluntario' });
    cargar();
  };

  const handleEliminar = async (id, username) => {
    if (!confirm(`¿Eliminar la cuenta de "${username}"? No podrá volver a iniciar sesión.`)) return;
    const res = await fetch(`/api/admin-users/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!res.ok) {
      alert(json.error);
      return;
    }
    cargar();
  };

  if (status === 'loading' || loading) {
    return <div className="container-page py-14 text-brand-dark/50">Cargando...</div>;
  }

  if (!esSuperadmin) {
    return (
      <div className="container-page py-14">
        <p className="text-brand-dark/70">
          No tienes permiso para ver esta página. Solo un superadmin puede gestionar cuentas.
        </p>
      </div>
    );
  }

  return (
    <div className="container-page py-14 max-w-2xl">
      <h1 className="font-display text-3xl font-semibold mb-2">Cuentas de voluntarios</h1>
      <p className="text-brand-dark/60 mb-10">
        Crea una cuenta para cada voluntario y elimínala el día que deje la protectora.
      </p>

      <div className="space-y-3 mb-12">
        {cuentas.map((cuenta) => (
          <div key={cuenta.id} className="card p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{cuenta.username}</p>
              <p className="text-xs text-brand-dark/50">
                {cuenta.role === 'superadmin' ? 'Superadmin' : 'Voluntario'} · desde{' '}
                {new Date(cuenta.created_at).toLocaleDateString('es-ES')}
              </p>
            </div>
            <button
              onClick={() => handleEliminar(cuenta.id, cuenta.username)}
              className="text-sm px-4 py-2 rounded-full border-2 border-red-300 text-red-600 hover:bg-red-50 transition"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="font-display text-xl font-semibold mb-5">Añadir nueva cuenta</h2>
        <form onSubmit={handleCrear} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Usuario</label>
            <input
              required
              className="input-field"
              value={nuevo.username}
              onChange={(e) => setNuevo({ ...nuevo, username: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Contraseña</label>
            <input
              required
              type="password"
              minLength={8}
              className="input-field"
              value={nuevo.password}
              onChange={(e) => setNuevo({ ...nuevo, password: e.target.value })}
            />
            <p className="text-xs text-brand-dark/50 mt-1">Mínimo 8 caracteres.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Rol</label>
            <select
              className="input-field"
              value={nuevo.role}
              onChange={(e) => setNuevo({ ...nuevo, role: e.target.value })}
            >
              <option value="voluntario">Voluntario (gestiona animales)</option>
              <option value="superadmin">Superadmin (también gestiona cuentas)</option>
            </select>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button type="submit" disabled={creando} className="btn-primary disabled:opacity-60">
            {creando ? 'Creando...' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}
