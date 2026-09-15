import { MessageCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import type { RouteId } from '@/lib/event';
import { registrationLink } from '@/lib/whatsapp';

type Props = {
  route?: RouteId;
  className?: string;
  /** Muestra el ícono de WhatsApp cuando la inscripción aún se hace por chat. */
  icon?: boolean;
  onClick?: () => void;
  children: ReactNode;
};

/** CTA de inscripción: enlace del tercero cuando exista; mientras tanto, WhatsApp con el mensaje listo. */
export function RegisterLink({ route, className, icon = true, onClick, children }: Props) {
  const { href, viaWhatsApp } = registrationLink(route);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
      {icon && viaWhatsApp ? <MessageCircle className="size-5 shrink-0" aria-hidden /> : null}
      {children}
    </a>
  );
}
