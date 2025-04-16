/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      dns: false,
      path: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      querystring: false,
    };
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    return config;
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
  output: 'standalone',
  distDir: '.next',
  transpilePackages: [
    '@radix-ui/react-dialog',
    '@radix-ui/react-hover-card',
    '@radix-ui/react-context-menu',
    '@radix-ui/react-accordion',
    '@radix-ui/react-avatar',
    '@radix-ui/react-checkbox',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-label',
    '@radix-ui/react-popover',
    '@radix-ui/react-progress',
    '@radix-ui/react-radio-group',
    '@radix-ui/react-scroll-area',
    '@radix-ui/react-select',
    '@radix-ui/react-separator',
    '@radix-ui/react-slot',
    '@radix-ui/react-switch',
    '@radix-ui/react-tabs',
    '@radix-ui/react-toast',
    '@radix-ui/react-tooltip',
    '@tanstack/react-query',
    '@tanstack/react-table',
    'cmdk',
    'react-icons',
    'recharts',
    'react-chartjs-2',
    'react-day-picker',
    'firebase',
    'chart.js',
    'date-fns',
    'lucide-react',
    'sonner',
    'tailwind-merge',
    'tailwindcss-animate',
    'class-variance-authority',
    'clsx',
    'next-themes',
    'framer-motion',
    'zod',
    'zustand',
    'react-hook-form',
    '@hookform/resolvers',
    'axios'
  ],
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
    optimizeCss: true,
    turbo: {
      resolveAlias: {
        '@': require('path').resolve(__dirname, 'src'),
      },
    },
  },
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  optimizeFonts: true,
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-DNS-Prefetch-Control',
          value: 'on',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains',
        },
        {
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
      ],
    },
  ],
};

module.exports = nextConfig;
