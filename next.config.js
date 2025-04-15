/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  trailingSlash: true,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    DATABASE_URL: process.env.DATABASE_URL,
  },
  experimental: {
    appDir: true,
    webpackBuildWorker: true,
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // Configurações de cache
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  // Configurações específicas para o Netlify
  assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
  basePath: '',
  poweredByHeader: false,
  generateEtags: false,
  compress: true,
  // Excluir rotas de API do build estático
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  exclude: ['/api/**'],
};

module.exports = nextConfig;
