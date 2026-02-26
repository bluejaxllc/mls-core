/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        DATABASE_URL: process.env.POSTGRES_PRISMA_URL,
        DATABASE_URL_UNPOOLED: process.env.POSTGRES_URL_NON_POOLING,
        INTELLIGENCE_DATABASE_URL: process.env.POSTGRES_PRISMA_URL,
        INTELLIGENCE_DATABASE_URL_UNPOOLED: process.env.POSTGRES_URL_NON_POOLING,
    },
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
    async headers() {
        return [
            {
                // Apply to all routes
                source: '/:path*',
                headers: [
                    {
                        // Allow iframe embedding from bluejax.ai domains
                        key: 'Content-Security-Policy',
                        value: "frame-ancestors 'self' https://*.bluejax.ai https://bluejax.ai",
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                ],
            },
        ];
    },
    async rewrites() {
        return [];
    },
};

module.exports = nextConfig;
