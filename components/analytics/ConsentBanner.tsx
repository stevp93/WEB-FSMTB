'use client';

import { Cookie } from 'lucide-react';
import { useEffect, useState } from 'react';
import { buttonClass } from '@/components/ui/button';
import {
  OPEN_CONSENT_EVENT,
  loadClarity,
  readConsent,
  storeConsent,
  updateGoogleConsent,
  type ConsentChoice,
} from '@/lib/analytics';

/** Aviso breve de cookies de medición: no bloquea la navegación y se reabre desde el pie de página. */
export function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    if (stored === 'granted') loadClarity();
    if (!stored) setOpen(true);

    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  const choose = (choice: ConsentChoice) => {
    storeConsent(choice);
    updateGoogleConsent(choice);
    if (choice === 'granted') loadClarity();
    // Si Clarity ya corría en esta visita, retira el consentimiento y borra sus cookies.
    else window.clarity?.('consent', false);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <section
      aria-labelledby="cookies-titulo"
      className="fixed inset-x-4 bottom-4 z-toast rounded-sm bg-surface p-5 text-ink shadow-lift-3 ring-1 ring-line/30 md:bottom-6 md:left-6 md:right-auto md:max-w-sm"
    >
      <h2 id="cookies-titulo" className="flex items-center gap-2 font-semibold">
        <Cookie className="size-5 text-accent" aria-hidden />
        Cookies de medición
      </h2>
      <p className="mt-2 text-sm text-ink-muted">
        Usamos Google Analytics y Microsoft Clarity para entender cómo se usa la web y mejorarla. Solo se activan si
        aceptas.
      </p>
      <div className="mt-4 flex gap-3">
        <button type="button" onClick={() => choose('granted')} className={buttonClass('primary', 'md', 'flex-1')}>
          Aceptar
        </button>
        <button type="button" onClick={() => choose('denied')} className={buttonClass('secondary', 'md', 'flex-1')}>
          Rechazar
        </button>
      </div>
    </section>
  );
}
