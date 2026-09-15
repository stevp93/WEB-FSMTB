import { EVENT, ROUTES, type RouteId } from './event';

export function whatsappLink(text: string) {
  return `https://wa.me/${EVENT.contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function registrationIntentMessage(route?: RouteId) {
  const base = `Hola, quiero inscribirme en la ${EVENT.name} 2026`;
  if (!route) return `${base}. ¿Cómo reservo mi cupo?`;
  const r = ROUTES[route];
  return `${base} en la modalidad ${r.name} (${r.distanceKm} km). ¿Cómo reservo mi cupo?`;
}

/** Destino de las CTA de inscripción: la plataforma del tercero cuando exista; mientras tanto, WhatsApp. */
export function registrationLink(route?: RouteId) {
  if (EVENT.registrationUrl) return { href: EVENT.registrationUrl, viaWhatsApp: false };
  return { href: whatsappLink(registrationIntentMessage(route)), viaWhatsApp: true };
}

export const GENERAL_MESSAGE = `Hola, quiero información sobre la ${EVENT.name} 2026.`;
export const ALLY_MESSAGE = `Hola, quiero conocer las modalidades para ser aliado de la ${EVENT.name} 2026.`;
