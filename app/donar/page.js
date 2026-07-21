import Link from 'next/link';
import { siteConfig } from '@/lib/siteConfig';

export default function DonarPage() {
  return (
    <div className="container-page py-14 max-w-3xl">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-3">
        Tu ayuda cambia vidas
      </h1>
      <p className="text-brand-dark/70 mb-10">
        Cada donación, por pequeña que sea, nos permite rescatar, alimentar y curar a más animales.
        Además, en España donar sale más a cuenta de lo que crees.
      </p>

      {/* DESGRAVACIÓN FISCAL */}
      <div className="card bg-brand-cream/50 p-7 mb-12">
        <h2 className="font-display text-xl font-semibold mb-3">
          Donar te cuesta menos de lo que piensas
        </h2>
        <p className="text-brand-dark/80 leading-relaxed mb-4">
          Las donaciones a entidades sin ánimo de lucro acogidas a la Ley 49/2002 se pueden
          desgravar en la declaración de la Renta (IRPF): los primeros 250 € donados en el año se
          desgravan al <strong>80 %</strong>, y lo que dones por encima de esa cifra se desgrava al
          40 % (45 % si donas a la misma entidad durante 3 años seguidos por un importe igual o
          mayor).
        </p>
        <p className="text-brand-dark/80 leading-relaxed mb-4">
          En la práctica, esto significa que si donas <strong>20 €</strong>, Hacienda te devuelve{' '}
          <strong>16 €</strong> en tu siguiente declaración de la Renta: tu coste real es de solo 4 €.
        </p>
        <p className="text-xs text-brand-dark/50">
          Esta información es orientativa y se basa en el artículo 19 de la Ley 49/2002. Para que
          aplique, la entidad receptora debe estar acogida a dicha ley; te recomendamos confirmarlo
          con nosotros o con tu asesor fiscal, ya que no somos asesores fiscales ni podemos
          garantizar tu caso concreto.
        </p>
      </div>

      {/* FORMAS DE DONAR */}
      <h2 className="font-display text-2xl font-semibold mb-6">Formas de donar</h2>

      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        <div className="card p-6">
          <h3 className="font-semibold mb-2">Transferencia bancaria</h3>
          <p className="text-sm text-brand-dark/60 mb-3">IBAN</p>
          <p className="font-mono text-lg tracking-wide break-all">{siteConfig.donaciones.iban}</p>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold mb-2">Bizum</h3>
          <p className="text-sm text-brand-dark/60 mb-3">
            En vez de un número de móvil, introduce este código de ONG en tu app del banco:
          </p>
          <p className="font-mono text-2xl tracking-widest">{siteConfig.donaciones.bizumCodigo}</p>
        </div>
      </div>

      <div className="card p-7 mb-10">
        <h3 className="font-semibold text-lg mb-2">Hazte socio</h3>
        <p className="text-brand-dark/70 leading-relaxed">
          Programa desde la app o la web de tu banco una transferencia periódica (mensual, trimestral
          o como prefieras) a nuestro IBAN por la cantidad que quieras. Con tu aportación recurrente
          nos ayudas a planificar mejor el cuidado de los animales durante todo el año.
        </p>
      </div>

      <div className="card p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div>
          <h3 className="font-semibold text-lg mb-1">Únete a nuestro Teaming</h3>
          <p className="text-brand-dark/70 text-sm">
            Colabora con solo 1 € al mes, junto a cientos de personas más.
          </p>
        </div>
        <Link
          href={siteConfig.donaciones.teamingUrl}
          target="_blank"
          rel="noreferrer"
          className="btn-primary whitespace-nowrap"
        >
          Únete a nuestro Teaming por 1€ al mes
        </Link>
      </div>
    </div>
  );
}
