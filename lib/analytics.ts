/** Identificadores de medición: Google Tag Manager (GA4 se configura dentro del contenedor) y Microsoft Clarity. */
export const GTM_ID = 'GTM-WSXJH8DD';
export const CLARITY_ID = 'yjgwvut3dg';

export type ConsentChoice = 'granted' | 'denied';

export const CONSENT_KEY = 'sfmtb-consent';
/** Evento para reabrir el aviso desde el pie de página. */
export const OPEN_CONSENT_EVENT = 'sfmtb:open-consent';

type Tag = ((...args: unknown[]) => void) & { q?: unknown[] };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Tag;
    clarity?: Tag;
  }
}

export function readConsent(): ConsentChoice | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

export function storeConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // Almacenamiento bloqueado: la elección vale solo para esta visita.
  }
}

/** Consent Mode v2: GTM carga con todo denegado; aquí se actualiza solo la analítica (el sitio no usa publicidad). */
export function updateGoogleConsent(choice: ConsentChoice) {
  window.gtag?.('consent', 'update', { analytics_storage: choice });
  window.dataLayer?.push({ event: `consent_${choice}` });
}

/** Clarity escribe cookies propias: se inyecta únicamente tras aceptar. */
export function loadClarity() {
  if (window.clarity) return;
  const clarity: Tag = (...args) => {
    (clarity.q = clarity.q || []).push(args);
  };
  window.clarity = clarity;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
  document.head.appendChild(script);
  clarity('consent');
}
