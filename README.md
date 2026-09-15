# SFMTB Trilogy Race 2026

Web oficial de inscripción de la tercera edición. Next.js 14 (App Router), React 18, TypeScript, Tailwind, three + R3F + drei, framer-motion, Lenis, react-hook-form + zod.

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
| Datos maestros (fecha, precio, rutas, kit, aliados, contacto) | `lib/event.ts` |
| Tokens de color (primitivo → semántico → componente) | `lib/tokens.ts` → `tailwind.config.ts` |
| Encuadre 3D por página | `lib/shots.ts` |
| Terreno y trazados (compartidos por 3D y perfiles) | `lib/terrain.ts`, `lib/profiles.ts` |
| Validación del formulario | `lib/registration.ts` |
| Server action y guardado del lead | `app/inscripcion/actions.ts`, `lib/leads.ts` |
| Mensajes de WhatsApp | `lib/whatsapp.ts` |

## Despliegue (GitHub Pages)

El sitio se exporta como estático (`output: 'export'`) y se publica con `.github/workflows/deploy.yml` en cada push a `main`. El workflow define `NEXT_PUBLIC_BASE_PATH` y `NEXT_PUBLIC_SITE_URL` según el repositorio. En **Settings → Pages → Source** debe estar seleccionado **GitHub Actions**.

Variables opcionales en **Settings → Secrets and variables → Actions → Variables**: `LEAD_WEBHOOK_URL`, `DEVELOPER_URL`, `GA_ID`. Tras cambiarlas, relanza el workflow.

## Leads

Al no haber servidor, `reserveSpot` (`lib/leads-client.ts`) valida en el navegador y hace POST del lead a `NEXT_PUBLIC_LEAD_WEBHOOK_URL` (JSON como `text/plain`, sin preflight CORS: sirve Google Apps Script, Make, Zapier o n8n). Sin webhook, la inscripción se completa por WhatsApp.

El mensaje de WhatsApp solo lleva nombre, categoría, talla y referencia: documento y correo no viajan en la URL.

## 3D y póster

Un solo `<Canvas>` persistente (`components/site/Backdrop.tsx`) que se carga con `next/dynamic` después de hidratar y solo en escritorio/tablet con puntero fino, sin `prefers-reduced-motion`, sin ahorro de datos y con WebGL. En móvil y en esos casos se muestra `public/poster/terreno-*.jpg`, capturado del mismo Canvas. Si cambias el terreno o el encuadre del inicio, vuelve a capturar ambos pósters y ejecuta `node scripts/build-posters.mjs`.
