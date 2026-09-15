/** DATOS MAESTROS DEL EVENTO: única fuente de verdad para copy y cifras. */

export type RouteId = 'carrera' | 'travesia';

export const EVENT = {
  name: 'SFMTB Trilogy Race',
  fullName: 'SFMTB Trilogy Race — Tercera Edición',
  edition: 'Tercera Edición',
  motto: 'Tierra de Agua y Montañas',
  place: 'San Francisco, Cundinamarca',
  country: 'Colombia',
  dateLabel: '29 de noviembre de 2026',
  dateISO: '2026-11-29',
  // Medianoche en Bogotá (UTC−5). La hora oficial de largada aún no está publicada.
  countdownTarget: '2026-11-29T00:00:00-05:00',
  shortDescription:
    'Algunos ya saben qué significa SFMTB, para otros, es el turno de conocerlo. Ven a competir en un territorio que tiene una identidad propia.',
  longDescription: 'Nuestra tercera edición es el crecimiento de una experiencia que evoluciona.',
  price: 300000,
  currency: 'COP',
  signature: 'SAN FRANCISCO MTB OFICIAL 2026',
  contact: {
    website: 'https://www.sfmtb.info',
    websiteLabel: 'www.sfmtb.info',
    phoneLabel: '323 933 5820',
    phoneHref: 'tel:+573239335820',
    whatsappNumber: '573239335820',
  },
  developer: {
    name: 'SP Automatizaciones',
    url: 'https://www.instagram.com/sp930718/',
    handle: '@sp930718',
    // Cuando llegue el logo: guardarlo en public/logos/ y definir { src, width, height }.
    logo: null as { src: string; width: number; height: number } | null,
  },
  // Plataforma de inscripción del tercero. Vacío: las CTA de inscripción abren WhatsApp con el mensaje listo.
  registrationUrl: process.env.NEXT_PUBLIC_REGISTRATION_URL ?? '',
  // Cifras del documento de presentación del evento.
  community: {
    participantsPerEdition: 250,
    companionsPerEdition: 300,
    projectedParticipants: 400,
    projectedCompanions: 400,
  },
} as const;

export const ROUTES: Record<
  RouteId,
  {
    id: RouteId;
    name: string;
    distanceKm: number;
    ascentM: number;
    prize: string;
    pitch: string;
    cta: string;
  }
> = {
  carrera: {
    id: 'carrera',
    name: 'Carrera',
    distanceKm: 45,
    ascentM: 1600,
    prize: 'En efectivo',
    pitch: 'Para quienes vienen a competir, exigirse y medirse frente a otros corredores.',
    cta: 'Inscribirme en Carrera',
  },
  travesia: {
    id: 'travesia',
    name: 'Travesía',
    distanceKm: 25,
    ascentM: 1000,
    prize: 'En obsequios',
    pitch: 'Para disfrutar el recorrido, el paisaje y la montaña a tu propio ritmo.',
    cta: 'Inscribirme en Travesía',
  },
};

export const ROUTE_ORDER: RouteId[] = ['carrera', 'travesia'];

export type KitIcon =
  | 'jersey'
  | 'socks'
  | 'gloves'
  | 'strap'
  | 'bib'
  | 'medal'
  | 'sponsors'
  | 'photo'
  | 'bag'
  | 'insurance'
  | 'aid'
  | 'mechanic'
  | 'emergency'
  | 'sweep'
  | 'lunch'
  | 'route'
  | 'cash'
  | 'gift';

export const KIT: { label: string; icon: KitIcon }[] = [
  { label: 'Jersey Eleven', icon: 'jersey' },
  { label: 'Medias', icon: 'socks' },
  { label: 'Guantes Force', icon: 'gloves' },
  { label: 'Strap Vatios', icon: 'strap' },
  { label: 'Número y chip', icon: 'bib' },
  { label: 'Medalla Finishers', icon: 'medal' },
  { label: 'Productos de patrocinadores', icon: 'sponsors' },
  { label: 'Fotografía profesional personalizada', icon: 'photo' },
  { label: 'Tula', icon: 'bag' },
];

export const SERVICES: { label: string; icon: KitIcon; route?: RouteId }[] = [
  { label: 'Seguro de accidentes', icon: 'insurance' },
  { label: 'Avituallamiento en ruta', icon: 'aid' },
  { label: 'Asistencia mecánica básica', icon: 'mechanic' },
  { label: 'Acompañamiento de cuerpos de emergencia', icon: 'emergency' },
  { label: 'Carro escoba', icon: 'sweep' },
  { label: 'Almuerzo típico de la región', icon: 'lunch' },
  { label: 'Ruta a elección (Carrera o Travesía)', icon: 'route' },
  { label: 'Premiación en efectivo', icon: 'cash', route: 'carrera' },
  { label: 'Premiación en obsequios', icon: 'gift', route: 'travesia' },
];

export const ORGANIZERS = [
  {
    name: 'Alcaldía Municipal de San Francisco (Cundinamarca)',
    logo: { src: '/logos/alcaldia-san-francisco.png', width: 360, height: 344 },
    description:
      'Respalda la carrera junto a la Junta de Deportes y fortalece la organización, la logística y la seguridad de la jornada.',
  },
  {
    name: 'MTB San Francisco',
    logo: { src: '/logos/mtb-san-francisco.png', width: 560, height: 373 },
    description:
      'Ciclistas y líderes locales que impulsan el ciclomontañismo y forman nuevos talentos en la escuela del municipio, con la instructora Dolly De Los Ríos al frente.',
  },
  {
    name: 'JuliTo y sus rutas',
    logo: { src: '/logos/julito-y-sus-rutas.png', width: 520, height: 410 },
    description:
      'Ciclista MTB, conocedor y promotor de rutas. Conecta la carrera con una comunidad que busca aventura, turismo y montaña.',
  },
];

export const NAV = [
  { href: '/', label: 'Inicio' },
  { href: '/evento', label: 'El Evento' },
  { href: '/recorridos', label: 'Recorridos' },
  { href: '/kit-servicios', label: 'Kit y servicios' },
  { href: '/aliados', label: 'Aliados' },
] as const;

/** $300.000 con separador de miles colombiano, sin depender del ICU del entorno. */
export function formatCOP(value: number): string {
  return `$${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

export function formatThousands(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
