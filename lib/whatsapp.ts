import { EVENT } from './event';

/** El bot de WhatsApp atiende solo los accesos de contacto; la inscripción va a su propia plataforma. */
export function whatsappLink(text: string) {
  return `https://wa.me/${EVENT.contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export const GENERAL_MESSAGE = `Hola, quiero información sobre la ${EVENT.name} 2026.`;
export const ALLY_MESSAGE = `Hola, quiero conocer las modalidades para ser aliado de la ${EVENT.name} 2026.`;
