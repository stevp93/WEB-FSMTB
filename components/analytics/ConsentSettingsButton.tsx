'use client';

import { OPEN_CONSENT_EVENT } from '@/lib/analytics';

/** Reabre el aviso de cookies para cambiar la elección. */
export function ConsentSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))} className={className}>
      Preferencias de cookies
    </button>
  );
}
