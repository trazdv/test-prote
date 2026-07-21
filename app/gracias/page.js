import { Suspense } from 'react';
import GraciasContent from './GraciasContent';

export default function GraciasPage() {
  return (
    <Suspense fallback={<div className="container-page py-20 text-brand-dark/50">Cargando...</div>}>
      <GraciasContent />
    </Suspense>
  );
}
