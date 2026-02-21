import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/i18n'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { ClickSparkle } from '@/components/ui/click-sparkle'
import { ToastProvider } from '@/components/providers/ToastProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    metadataBase: new URL('https://mls.bluejax.ai'),
    title: {
        default: 'BLUE JAX CORE',
        template: '%s | BLUE JAX CORE',
    },
    description: 'Mexico MLS Market Infrastructure — Sistema de registro y gobernanza inmobiliaria. Real estate intelligence, listings and market data.',
    openGraph: {
        type: 'website',
        siteName: 'BLUE JAX CORE',
        title: 'BLUE JAX CORE — Mexico MLS Market Infrastructure',
        description: 'Sistema de registro y gobernanza inmobiliaria. La verdad compartida del mercado inmobiliario.',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'BLUE JAX CORE',
        description: 'Mexico MLS Market Infrastructure — Sistema de registro y gobernanza inmobiliaria.',
    },
    icons: {
        icon: [
            { url: '/icon.png', type: 'image/png' },
        ],
        apple: '/icon.png',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background pointer-events-none z-[-1]" />
                <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none z-[-1]" />
                <AuthProvider>
                    <LanguageProvider>
                        <ToastProvider />
                        <ClickSparkle />
                        {children}
                    </LanguageProvider>
                </AuthProvider>
            </body>
        </html>
    )
}
