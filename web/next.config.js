/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    experimental: {
        outputFileTracingIncludes: {
            '/api/**': [
                './node_modules/@prisma/client-intelligence/**',
                './node_modules/@prisma/client-core/**',
            ],
        },
        serverComponentsExternalPackages: ['@prisma/client-core', '@prisma/client-intelligence'],
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
    async redirects() {
        return [];
    },
    async rewrites() {
        return [];
    },
};

module.exports = nextConfig;
