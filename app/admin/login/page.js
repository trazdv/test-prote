'use client';

import { useState } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { siteConfig } from '@/lib/siteConfig';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError('Usuario o contraseña incorrectos.');
      return;
    }

    router.push('/admin');
  };

  return (
    <div className="container-page py-24 max-w-sm mx-auto">
      <div className="relative w-24 h-24 mx-auto mb-6">
        <Image src="/logo.svg" alt={`Sello de ${siteConfig.nombreProtectora}`} fill className="object-contain" />
      </div>
      <h1 className="font-display text-2xl font-semibold mb-2 text-center">
        Acceso voluntarios
      </h1>
      <p className="text-brand-dark/60 text-sm text-center mb-8">
        Solo para el equipo de la protectora.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Usuario</label>
          <input
            required
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Contraseña</label>
          <input
            required
            type="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
