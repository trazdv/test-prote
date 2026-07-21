import CampaignForm from '@/components/CampaignForm';

export default function NuevaCampanaPage() {
  return (
    <div className="container-page py-14">
      <h1 className="font-display text-3xl font-semibold mb-8">Añadir nueva campaña</h1>
      <CampaignForm />
    </div>
  );
}
