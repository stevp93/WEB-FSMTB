import type { ReactNode } from 'react';
import { EVENT } from '@/lib/event';

type Props = {
  className?: string;
  onClick?: () => void;
  children: ReactNode;
};

/** CTA de inscripción: abre la plataforma de registro en una pestaña nueva. */
export function RegisterLink({ className, onClick, children }: Props) {
  return (
    <a href={EVENT.registrationUrl} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
      {children}
    </a>
  );
}
