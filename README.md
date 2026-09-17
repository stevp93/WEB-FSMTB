# SFMTB Trilogy Race 2026

Web oficial de la tercera edición. Next.js 14 (App Router), React 18, TypeScript, Tailwind, three + R3F + drei, framer-motion y Lenis.

## Comandos

```bash
npm install
npm run dev        # desarrollo en http://localhost:3000
npm run build      # build de producción
npm run start      # servir el build
npm run typecheck
npm run assets     # re-optimiza fotos y logos desde "IMAGES Y LOGOS"
```

Copia `.env.example` a `.env.local` y completa las variables.

## Dónde está cada cosa

| Qué | Archivo |
| --- | --- |
| Datos maestros (fecha, precios, rutas, kit, premiación, organizadores, marcas aliadas, contacto) | `lib/event.ts` |
| Tokens de color (primitivo → semántico → componente) | `lib/tokens.ts` → `tailwind.config.ts` |
| Encuadre 3D por página | `lib/shots.ts` |
| Terreno y trazados (compartidos por 3D y perfiles) | `lib/terrain.ts`, `lib/profiles.ts` |
| Mensajes de WhatsApp | `lib/whatsapp.ts` |

## Despliegue (GitHub Pages)

El sitio se exporta como estático (`output: 'export'`) y se publica con `.github/workflows/deploy.yml` en cada push a `main`. Se sirve en el dominio propio https://www.sfmtb.info (`public/CNAME`), por eso el workflow compila sin `NEXT_PUBLIC_BASE_PATH`. En **Settings → Pages → Source** debe estar seleccionado **GitHub Actions**.

Variables opcionales en **Settings → Secrets and variables → Actions → Variables**: `REGISTRATION_URL`.

## Analítica y cookies

Google Tag Manager (`GTM-WSXJH8DD`) y Microsoft Clarity (`yjgwvut3dg`), definidos en `lib/analytics.ts`. GTM carga con Consent Mode v2 en "denegado"; al aceptar el aviso se concede `analytics_storage` y se carga Clarity. GA4 se configura como etiqueta dentro de GTM. "Preferencias de cookies" en el pie reabre el aviso. Tras cambiarlas, relanza el workflow.

## Inscripción

Todos los botones "Reservar mi cupo" e "Inscribirme" usan `RegisterLink` y abren la plataforma de registro (https://sfmtb-view.onrender.com/, definida en `lib/event.ts`; la variable `REGISTRATION_URL` la reemplaza sin tocar código). El bot de WhatsApp (323 933 5820) queda solo en los accesos de contacto.

## Marca del desarrollador

El crédito de SP Automatizaciones (pie de página y Aliados) enlaza a Instagram y a su WhatsApp (304 523 5480). Logos en `public/logos/sp-automatizaciones.svg` (completo) y `sp-automatizaciones-simbolo.svg` (pie de página).

## Marcas aliadas

Se agregan en `ALLIES` (`lib/event.ts`) con su logo en `public/logos/`; mientras falten, Aliados muestra casillas "Espacio para tu marca".

## 3D y póster

Un solo `<Canvas>` persistente (`components/site/Backdrop.tsx`) que se carga con `next/dynamic` después de hidratar y solo en escritorio/tablet con puntero fino, sin `prefers-reduced-motion`, sin ahorro de datos y con WebGL. En móvil y en esos casos se muestra `public/poster/terreno-*.jpg`, capturado del mismo Canvas. Si cambias el terreno o el encuadre del inicio, vuelve a capturar ambos pósters y ejecuta `node scripts/build-posters.mjs`.
