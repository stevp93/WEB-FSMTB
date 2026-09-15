// Convierte las capturas del Canvas (scripts/.poster) en los pósters estáticos de /public/poster.
import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';

await mkdir('public/poster', { recursive: true });

const jobs = [
  { src: 'scripts/.poster/horizontal.png', out: 'public/poster/terreno-horizontal.jpg', width: 2400, height: 1350 },
  { src: 'scripts/.poster/retrato.png', out: 'public/poster/terreno-retrato.jpg', width: 1080, height: 1920 },
];

for (const job of jobs) {
  await sharp(job.src)
    .resize(job.width, job.height, { fit: 'cover', position: 'north' })
    .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(job.out);
  const meta = await sharp(job.out).metadata();
  console.log(job.out, `${meta.width}x${meta.height}`, `${Math.round((await stat(job.out)).size / 1024)} KB`);
}
