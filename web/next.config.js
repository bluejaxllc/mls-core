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
        // Express proxy removed — API routes now served by Next.js App Router
        return [];
    },
};

module.exports = nextConfig;
