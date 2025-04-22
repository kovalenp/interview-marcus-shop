import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',  // Security issue, only allow for interview purposes because I took some random images on the internet :)
      },
    ],
  },
};

export default nextConfig;
