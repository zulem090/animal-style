/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        // pathname: '/photo-1542909168-82c3e7fdca5c'
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        // pathname: '/photo-1542909168-82c3e7fdca5c'
      },
      {
        // protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        // pathname: '/photo-1542909168-82c3e7fdca5c'
      },
      {
        // protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
        // pathname: '/photo-1542909168-82c3e7fdca5c'
      },
    ],
  },
};

export default nextConfig;
