// Exportación estática para GitHub Pages: el sitio vive en /<repo>, sin servidor Node.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Sin servidor de optimización: las fotos se pre-optimizan con `npm run assets` (WebP a su tamaño de uso).
    unoptimized: true,
  },
  experimental: {
    // bundle-barrel-imports: reescribe imports de barrels a módulos directos.
    optimizePackageImports: ['lucide-react', '@react-three/drei', 'framer-motion'],
  },
};

export default nextConfig;
