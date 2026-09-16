// Optimiza el material original de "IMAGES Y LOGOS" hacia /public y genera la imagen OG.
// next/image se encarga luego de servir AVIF/WebP en el tamaño justo.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'IMAGES Y LOGOS';
const PUB = 'public';

const photos = [
  // keep: fracción vertical a conservar (recorta la franja de logos sobreimpresa abajo).
  { src: '_DSC1760.jpg', out: 'images/salida-edicion-anterior.webp', width: 1600, keep: 0.87 },
  { src: 'DSC_9084.jpg', out: 'images/escuela-ciclomontanismo.webp', width: 1600, keep: 0.87 },
  { src: 'FondoPiezas.jpeg', out: 'images/cascada-san-francisco.webp', width: 1000, keep: 1 },
];

const logos = [
  { src: 'Organizadores/SFMTBTRWhite-sf.png', out: 'logos/sfmtb-trilogy-race.png', width: 640 },
  { src: 'Organizadores/SFMTBOfWhite-sf.png', out: 'logos/sfmtb-oficial.png', width: 720 },
  { src: 'Organizadores/Alcaldia.png', out: 'logos/alcaldia-san-francisco.png', width: 360 },
  { src: 'Organizadores/MTBSanFrancisco.png', out: 'logos/mtb-san-francisco.png', width: 560 },
  { src: 'Organizadores/JySRBlanco.png', out: 'logos/julito-y-sus-rutas.png', width: 520 },
  { src: 'Organizadores/JySRNegro.png', out: 'logos/julito-y-sus-rutas-negro.png', width: 520 },
];

async function ensureDir(file) {
  await mkdir(path.dirname(file), { recursive: true });
}

async function corner(file) {
  const { data, info } = await sharp(file).extract({ left: 2, top: 2, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
  return `${[...data].join(',')} (${info.channels}ch)`;
}

for (const p of photos) {
  const input = path.join(SRC, p.src);
  const out = path.join(PUB, p.out);
  await ensureDir(out);
  const meta = await sharp(input).rotate().metadata();
  const height = Math.round(meta.height * p.keep);
  await sharp(input)
    .rotate()
    .extract({ left: 0, top: 0, width: meta.width, height })
    .resize({ width: p.width, withoutEnlargement: true })
    .webp({ quality: 74 })
    .toFile(out);
  const m = await sharp(out).metadata();
  console.log('foto', p.out, `${m.width}x${m.height}`);
}

for (const l of logos) {
  const input = path.join(SRC, l.src);
  const out = path.join(PUB, l.out);
  await ensureDir(out);
  await sharp(input).resize({ width: l.width, withoutEnlargement: true }).png({ compressionLevel: 9, palette: false }).toFile(out);
  const m = await sharp(out).metadata();
  console.log('logo', l.out, `${m.width}x${m.height}`, 'alpha:', m.hasAlpha, 'esquina:', await corner(out));
}

// Imagen Open Graph 1200×630: salida real oscurecida + marca.
const og = 'app/opengraph-image.jpg';
const logo = await sharp(path.join(SRC, 'Organizadores/SFMTBTRWhite-sf.png')).resize({ width: 760 }).toBuffer();
await sharp(path.join(SRC, '_DSC1760.jpg'))
  .rotate()
  .resize(1200, 630, { fit: 'cover', position: 'north' })
  .modulate({ brightness: 0.42, saturation: 0.8 })
  .composite([{ input: logo, gravity: 'center' }])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(og);
console.log('og', og);
