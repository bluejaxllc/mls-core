import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'BLUE JAX CORE',
        short_name: 'BJX CORE',
        description: 'Mexico MLS Market Infrastructure — Sistema de registro y gobernanza inmobiliaria.',
        start_url: '/',
        display: 'standalone',
        background_color: '#030712',
        theme_color: '#3b82f6',
        icons: [
            {
                src: '/icon.png',
                sizes: '1024x1024',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/apple-icon.png',
                sizes: '1024x1024',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    }
}
