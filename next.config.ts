import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dl.pcloud.com',
      },
      {
        protocol: 'https',
        hostname: 'e.pcloud.link',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.192',
        port:'',
        pathname: '/web_images/**',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
