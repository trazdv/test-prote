import AnimalForm from '@/components/AnimalForm';

export default function NuevoAnimalPage() {
  return (
    <div className="container-page py-14">
      <h1 className="font-display text-3xl font-semibold mb-8">Añadir nuevo animal</h1>
      <AnimalForm />
    </div>
  );
}
