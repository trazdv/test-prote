import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center max-w-md mx-auto">
      <div className="text-5xl mb-6">🐾</div>
      <h1 className="font-display text-3xl font-semibold mb-4">Página no encontrada</h1>
      <p className="text-brand-dark/70 mb-8">
        Puede que este animal ya haya encontrado un hogar, o que la página no exista.
      </p>
      <Link href="/animales" className="btn-primary">
        Ver animales
      </Link>
    </div>
  );
}
