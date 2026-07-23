import { siteConfig } from '@/lib/siteConfig';

export default function VoluntariadoPage() {
  return (
    <div className="container-page py-14 max-w-2xl">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-3">
        Hazte voluntario
      </h1>
      <p className="text-brand-dark/70 mb-10">
        Hay dos formas de colaborar como voluntario con nosotros. Elige la que encaje contigo y
        rellena el formulario correspondiente; te contactaremos en cuanto lo recibamos.
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="card p-7 flex flex-col">
          <h2 className="font-display text-xl font-semibold mb-2">Voluntariado</h2>
          <p className="text-brand-dark/70 text-sm mb-6 flex-1">
            Colabora con nosotros en el cuidado diario de los animales, paseos, eventos y
            campañas.
          </p>
          <a
            href={siteConfig.formulariosExternos.voluntariado}
            target="_blank"
            rel="noreferrer"
            className="btn-primary text-center"
          >
            Voluntariado
          </a>
        </div>

        <div className="card p-7 flex flex-col">
          <h2 className="font-display text-xl font-semibold mb-2">Voluntariado UMU</h2>
          <p className="text-brand-dark/70 text-sm mb-3 flex-1">
            ¿Estudias en la UMU? Consigue créditos (CRAU) al colaborar con la protectora.
          </p>
          <a
            href={siteConfig.formulariosExternos.voluntariadoUmu}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary text-center"
          >
            Voluntariado UMU
          </a>
        </div>
      </div>
    </div>
  );
}
