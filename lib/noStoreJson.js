import { NextResponse } from 'next/server';

/**
 * Igual que NextResponse.json(), pero añadiendo cabeceras que prohíben
 * expresamente cualquier caché (del navegador, de Vercel/CDN, etc.).
 * Se usa en las rutas de lectura (GET) para asegurar que los cambios
 * guardados en la base de datos se reflejen siempre al instante.
 */
export function noStoreJson(data, init) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    },
  });
}
