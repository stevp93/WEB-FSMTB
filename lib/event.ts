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
  price: 180000,
  // Se vende por separado de la inscripción.
  apparel: {
    label: 'Indumentaria opcional',
    price: 130000,
    items: 'Jersey Eleven, guantes Force y medias',
  },
  currency: 'COP',
  signature: 'SAN FRANCISCO MTB OFICIAL 2026',
  contact: {
    website: 'https://www.sfmtb.info',
    websiteLabel: 'www.sfmtb.info',
    phoneLabel: '323 933 5820',
    phoneHref: 'tel:+573239335820',
    whatsappNumber: '573239335820',
    instagram: [
      { handle: '@julitoysusrutas', url: 'https://www.instagram.com/julitoysusrutas/' },
      { handle: '@sanfranciscomtboficial', url: 'https://www.instagram.com/sanfranciscomtboficial/' },
      { handle: '@mtb.sanfrancisco', url: 'https://www.instagram.com/mtb.sanfrancisco/' },
    ],
  },
  developer: {
    name: 'SP Automatizaciones',
    url: 'https://www.instagram.com/sp930718/',
    handle: '@sp930718',
    phoneLabel: '304 523 5480',
    whatsappNumber: '573045235480',
    logo: { src: '/logos/sp-automatizaciones.svg', width: 213, height: 152 },
    mark: { src: '/logos/sp-automatizaciones-simbolo.svg', width: 106, height: 70 },
  },
  // Plataforma de inscripción. La variable de entorno permite cambiarla sin tocar código.
  registrationUrl: process.env.NEXT_PUBLIC_REGISTRATION_URL || 'https://sfmtb-view.onrender.com/',
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
  | 'gift'
  | 'raffle';

export const INCLUDES: { id: string; title: string; items: { label: string; icon: KitIcon; route?: RouteId }[] }[] = [
  {
    id: 'kit',
    title: 'Kit del corredor',
    items: [
      { label: 'Número y chip', icon: 'bib' },
      { label: 'Medalla Finishers', icon: 'medal' },
      { label: 'Productos de patrocinadores', icon: 'sponsors' },
      { label: 'Fotografía profesional personalizada', icon: 'photo' },
      { label: 'Tula', icon: 'bag' },
    ],
  },
  {
    id: 'servicios',
    title: 'Servicios en ruta',
    items: [
      { label: 'Seguro de accidentes', icon: 'insurance' },
      { label: 'Avituallamiento en ruta', icon: 'aid' },
      { label: 'Asistencia mecánica básica', icon: 'mechanic' },
      { label: 'Acompañamiento de cuerpos de emergencia', icon: 'emergency' },
      { label: 'Carro escoba', icon: 'sweep' },
    ],
  },
  {
    id: 'experiencia',
    title: 'Experiencia y premios',
    items: [
      { label: 'Almuerzo típico de la región', icon: 'lunch' },
      { label: 'Ruta a elección: Carrera o Travesía', icon: 'route' },
      { label: 'Premiación en efectivo', icon: 'cash', route: 'carrera' },
      { label: 'Premiación en obsequios', icon: 'gift', route: 'travesia' },
      { label: 'Rifa de 10 bonos de $200.000', icon: 'raffle' },
    ],
  },
];

/** Premiación en efectivo de la Carrera (45 km): el mismo podio para cada categoría. */
export const PRIZES = {
  podium: [250000, 180000, 100000],
  categories: [
    { name: 'Pro femenino', ages: '18 a 29 años' },
    { name: 'Máster femenino', ages: '30 años o más' },
    { name: 'Pro masculino', ages: '18 a 29 años' },
    { name: 'Máster A masculino', ages: '30 a 39 años' },
    { name: 'Máster B masculino', ages: '40 a 49 años' },
    { name: 'Máster C masculino', ages: '50 años o más' },
    { name: 'E-bikes', ages: 'Mixta, abierta' },
  ],
  note: 'De no completarse el mínimo de inscritos, la premiación será en obsequios.',
} as const;

/** Marcas aliadas: se agregan aquí con su logo en public/logos/ a medida que se sumen. */
export const ALLIES: { name: string; url?: string; logo: { src: string; width: number; height: number } }[] = [];

export const ORGANIZERS = [
  {
    name: 'Julito y Sus Rutas',
    logo: { src: '/logos/julito-y-sus-rutas.png', width: 520, height: 410 },
    description:
      'Ciclista MTB, conocedor y promotor de rutas. Conecta la carrera con una comunidad que busca aventura, turismo y montaña.',
  },
  {
    name: 'MTB San Francisco',
    logo: { src: '/logos/mtb-san-francisco.png', width: 560, height: 373 },
    description:
      'Ciclistas y líderes locales que impulsan el ciclomontañismo y forman nuevos talentos en la escuela del municipio, con la instructora Dolly De Los Ríos al frente.',
  },
  {
    name: 'Alcaldía Municipal de San Francisco (Cundinamarca)',
    logo: { src: '/logos/alcaldia-san-francisco.png', width: 360, height: 344 },
    description:
      'El evento cuenta con el respaldo y apoyo local de la Alcaldía Municipal de San Francisco Cundinamarca, la Junta Municipal de Deportes, y los organismos de socorro que fortalecen la organización, la logística y la seguridad de la jornada.',
  },
];

export const NAV = [
  { href: '/', label: 'Inicio' },
  { href: '/evento', label: 'El Evento' },
  { href: '/recorridos', label: 'Recorridos' },
  { href: '/kit-servicios', label: 'Kit y servicios' },
  { href: '/aliados', label: 'Aliados' },
  { href: '/aliados#contacto', label: 'Contacto' },
] as const;

export function isActivePath(pathname: string, href: string) {
  // Los accesos a una sección (/aliados#contacto) no marcan la página como actual.
  if (href.includes('#')) return false;
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

/** $180.000 con separador de miles colombiano, sin depender del ICU del entorno. */
export function formatCOP(value: number): string {
  return `$${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

export function formatThousands(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
