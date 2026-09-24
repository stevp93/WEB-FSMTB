'use client';

import { Cookie } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { getLenis } from '@/components/providers/SmoothScroll';
import { buttonClass } from '@/components/ui/button';
import {
  CONSENT_GRANTED_EVENT,
  OPEN_CONSENT_EVENT,
  loadClarity,
  readConsent,
  storeConsent,
  updateGoogleConsent,
  type ConsentChoice,
} from '@/lib/analytics';

type Step = 'closed' | 'ask' | 'blocked';

/**
 * Aviso de cookies obligatorio: la web solo se navega tras aceptar. Mientras está abierto, el resto
 * del documento queda inerte (sin foco, clic ni scroll). Se reabre desde "Preferencias de cookies".
 */
export function ConsentBanner() {
  const [step, setStep] = useState<Step>('closed');
  const dialog = useRef<HTMLDivElement>(null);
  const accept = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (readConsent() === 'granted') loadClarity();
    else setStep('ask');

    const reopen = () => setStep('ask');
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (step === 'closed') return;
    const root = dialog.current?.parentElement;
    const others = Array.from(document.body.children).filter((el) => el !== root && !el.contains(root ?? null));
    others.forEach((el) => el.setAttribute('inert', ''));
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const lenis = getLenis();
    lenis?.stop();
    accept.current?.focus();

    return () => {
      others.forEach((el) => el.removeAttribute('inert'));
      document.body.style.overflow = previousOverflow;
      lenis?.start();
    };
  }, [step]);

  const choose = (choice: ConsentChoice) => {
    storeConsent(choice);
    updateGoogleConsent(choice);
    if (choice === 'granted') {
      loadClarity();
      setStep('closed');
      window.dispatchEvent(new Event(CONSENT_GRANTED_EVENT));
    } else {
      // Si Clarity ya corría en esta visita, retira el consentimiento y borra sus cookies.
      window.clarity?.('consent', false);
      setStep('blocked');
    }
  };

  if (step === 'closed') return null;

  return (
    <div className="fixed inset-0 z-toast grid place-items-center bg-canvas/85 p-4">
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookies-titulo"
        aria-describedby="cookies-texto"
        className="w-full max-w-sm rounded-sm bg-surface p-6 text-ink shadow-lift-3 ring-1 ring-line/30"
      >
        <h2 id="cookies-titulo" className="flex items-center gap-2 font-display text-lg font-semibold">
          <Cookie className="size-5 text-accent" aria-hidden />
          Cookies
        </h2>
        <p id="cookies-texto" className="mt-2 text-ink-muted">
          {step === 'ask'
            ? '¿Aceptas el uso de cookies en este sitio?'
            : 'Para navegar en el sitio debes aceptar las cookies.'}
        </p>
        <div className="mt-5 flex gap-3">
          <button ref={accept} type="button" onClick={() => choose('granted')} className={buttonClass('primary', 'md', 'flex-1')}>
            Aceptar
          </button>
          {step === 'ask' ? (
            <button type="button" onClick={() => choose('denied')} className={buttonClass('secondary', 'md', 'flex-1')}>
              No acepto
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
