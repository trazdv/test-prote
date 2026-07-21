import { Suspense } from 'react';
import AnimalesContent from './AnimalesContent';

export default function AnimalesPage() {
  return (
    <Suspense fallback={<div className="container-page py-20 text-brand-dark/50">Cargando...</div>}>
      <AnimalesContent />
    </Suspense>
  );
}
