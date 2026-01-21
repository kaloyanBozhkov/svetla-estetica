import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'svetlaestetica.com',
      },
      {
        protocol: 'https',
        hostname: 'svetla-estetica.s3.eu-west-1.amazonaws.com',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
