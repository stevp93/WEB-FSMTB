import type { RouteId } from './event';
import { registrationSchema, type RegistrationInput } from './registration';

export type ReserveResult =
  | { ok: true; reference: string; category: RouteId; fullName: string; jerseySize: string }
  | {
      ok: false;
      reason: 'validation' | 'storage';
      message: string;
      fieldErrors?: Partial<Record<keyof RegistrationInput, string[]>>;
    };

function makeReference() {
  const bytes = crypto.getRandomValues(new Uint8Array(3));
  return `SF26-${Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

/**
 * Sitio estático (GitHub Pages): no hay servidor propio, así que el lead se envía
 * desde el navegador al webhook configurado (Apps Script, Make, Zapier, n8n…).
 * Se usa text/plain para evitar el preflight CORS. Sin webhook, WhatsApp cierra la inscripción.
 */
export async function reserveSpot(
  input: RegistrationInput,
  endpoint: string | undefined = process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL,
): Promise<ReserveResult> {
  const parsed = registrationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      reason: 'validation',
      message: 'Hay campos por corregir. Revisa los mensajes junto a cada uno.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  const lead = { ...data, reference: makeReference(), createdAt: new Date().toISOString(), source: 'web' };

  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(lead),
      });
      if (!res.ok) throw new Error(`Webhook respondió ${res.status}`);
    } catch (error) {
      console.error('[inscripcion] fallo al guardar', error);
      return {
        ok: false,
        reason: 'storage',
        message:
          'Tu inscripción no se guardó porque el servidor no respondió. Tus datos siguen en el formulario: vuelve a intentarlo o escríbenos por WhatsApp.',
      };
    }
  }

  return { ok: true, reference: lead.reference, category: data.category, fullName: data.fullName, jerseySize: data.jerseySize };
}
