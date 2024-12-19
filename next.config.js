/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "uploadthing.com",
            "utfs.io"
        ],
        unoptimized: process.env.NODE_ENV === 'development',
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    eslint: {
        ignoreDuringBuilds: false,
    },
    transpilePackages: ['geist'],
};

module.exports = nextConfig;
