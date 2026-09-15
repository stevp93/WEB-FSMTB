import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/asset';
import { NAV } from '@/lib/event';

export default function sitemap(): MetadataRoute.Sitemap {
  return NAV.map(({ href }) => ({
    url: `${SITE_URL}${href === '/' ? '/' : `${href}/`}`,
    changeFrequency: 'weekly',
    priority: href === '/' || href === '/inscripcion' ? 1 : 0.7,
  }));
}
