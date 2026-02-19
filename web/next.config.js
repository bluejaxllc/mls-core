/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/api/:path((?!auth).*)',
                destination: 'http://localhost:3001/api/:path*',
            },
        ];
    },
};

module.exports = nextConfig;
