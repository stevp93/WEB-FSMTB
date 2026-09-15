'use client';

import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cx } from '@/components/ui/cx';
import { EVENT } from '@/lib/event';
import { GENERAL_MESSAGE, whatsappLink } from '@/lib/whatsapp';

/**
 * Acceso flotante a WhatsApp. Discreto a propósito: aparece solo después de que el
 * usuario se desplaza, sin pulsos, globos ni aperturas automáticas.
 */
export function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setVisible(window.scrollY > window.innerHeight * 0.6);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <a
      href={whatsappLink(GENERAL_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Escribir por WhatsApp al ${EVENT.contact.phoneLabel}`}
      title="Escríbenos por WhatsApp"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cx(
        'fixed bottom-4 right-4 z-float grid size-14 place-items-center rounded-full bg-surface text-accent shadow-lift-3 ring-1 ring-line/30 md:bottom-6 md:right-6',
        'transition-[opacity,transform] duration-300 ease-out hover:ring-accent',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
      )}
    >
      <MessageCircle className="size-6" aria-hidden />
    </a>
  );
}
