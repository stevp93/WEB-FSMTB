import { EVENT, ROUTES, formatCOP, type RouteId } from './event';

export function whatsappLink(text: string) {
  return `https://wa.me/${EVENT.contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

/**
 * Mensaje de cierre de inscripción. Solo lleva lo necesario para continuar la
 * conversación: el documento y el correo se quedan en el servidor, no en la URL.
 */
export function registrationMessage(input: {
  fullName: string;
  category: RouteId;
  jerseySize: string;
  reference: string;
}) {
  const route = ROUTES[input.category];
  return [
    `Hola, acabo de reservar mi cupo en la ${EVENT.name} 2026.`,
    `Nombre: ${input.fullName}`,
    `Categoría: ${route.name} (${route.distanceKm} km)`,
    `Talla de jersey: ${input.jerseySize}`,
    `Referencia: ${input.reference}`,
    `Quiero confirmar el pago de la inscripción (${formatCOP(EVENT.price)}).`,
  ].join('\n');
}

export const GENERAL_MESSAGE = `Hola, quiero información sobre la ${EVENT.name} 2026.`;
export const ALLY_MESSAGE = `Hola, quiero conocer las modalidades para ser aliado de la ${EVENT.name} 2026.`;
