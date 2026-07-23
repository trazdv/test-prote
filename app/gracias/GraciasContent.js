'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function GraciasContent() {
  const searchParams = useSearchParams();
  const tipoParam = searchParams.get('tipo');
  const nombre = searchParams.get('nombre') || 'este animal';

  let titulo;
  if (tipoParam === 'voluntariado') {
    titulo = '¡Muchas gracias por tu interés en ser voluntario/a!';
  } else {
    const accion = tipoParam === 'acogida' ? 'acoger' : 'adoptar';
    titulo = `¡Muchas gracias por tu interés en ${accion} a ${nombre}!`;
  }

  return (
    <div className="container-page py-24 text-center max-w-lg mx-auto animate-fadeInUp">
      <div className="text-5xl mb-6">🐾</div>
      <h1 className="font-display text-3xl font-semibold mb-4">{titulo}</h1>
      <p className="text-brand-dark/70 mb-10">
        Te contactaremos muy pronto. Mientras tanto, puedes seguir conociendo a otros animales
        que también están buscando un hogar.
      </p>
      <Link href="/animales" className="btn-primary">
        Ver más animales
      </Link>
    </div>
  );
}
