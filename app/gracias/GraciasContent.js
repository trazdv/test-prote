'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function GraciasContent() {
  const searchParams = useSearchParams();
  const nombre = searchParams.get('nombre') || 'este animal';
  const tipo = searchParams.get('tipo') === 'acogida' ? 'acoger' : 'adoptar';

  return (
    <div className="container-page py-24 text-center max-w-lg mx-auto animate-fadeInUp">
      <div className="text-5xl mb-6">🐾</div>
      <h1 className="font-display text-3xl font-semibold mb-4">
        ¡Muchas gracias por tu interés en {tipo} a {nombre}!
      </h1>
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
