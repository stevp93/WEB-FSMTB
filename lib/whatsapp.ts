import { EVENT } from './event';

/** El bot de WhatsApp atiende solo los accesos de contacto; la inscripción va a su propia plataforma. */
export function whatsappLink(text: string, number: string = EVENT.contact.whatsappNumber) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export const GENERAL_MESSAGE = `Hola, quiero información sobre la ${EVENT.name} 2026.`;
export const ALLY_MESSAGE = `Hola, quiero conocer las modalidades para ser aliado de la ${EVENT.name} 2026.`;
export const DEVELOPER_MESSAGE = `Hola, vi la web de la ${EVENT.name} y quiero información sobre sus servicios.`;
