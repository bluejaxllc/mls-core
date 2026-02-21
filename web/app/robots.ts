import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/admin/',
                    '/auth/',
                    '/_next/',
                ],
            },
        ],
        sitemap: 'https://mls.bluejax.ai/sitemap.xml',
    }
}
