import Link from 'next/link';
import { PageHeader } from '@/components/site/PageHeader';
import { buttonClass } from '@/components/ui/button';

export default function NotFound() {
  return (
    <PageHeader title="Esta ruta no está en el mapa" lead="El enlace que seguiste no existe o cambió de lugar.">
      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        <Link href="/" className={buttonClass('primary', 'lg')}>
          Volver al inicio
        </Link>
        <Link href="/recorridos" className={buttonClass('secondary', 'lg')}>
          Ver recorridos
        </Link>
      </div>
    </PageHeader>
  );
}
