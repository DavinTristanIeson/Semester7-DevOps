const env = process.env.NODE_ENV

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  distDir: env === 'production' ? '../backend/views' : undefined,
};

export default nextConfig;
