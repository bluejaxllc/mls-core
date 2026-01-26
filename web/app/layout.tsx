import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/shell/Sidebar'
import { TopBar } from '@/components/shell/TopBar'
import { RightPanel } from '@/components/shell/RightPanel'
import { LanguageProvider } from '@/lib/i18n'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'BLUE JAX CORE',
    description: 'Mexico MLS Market Infrastructure',
}

import { AuthProvider } from '@/components/auth/AuthProvider';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <AuthProvider>
                    <LanguageProvider>
                        <div className="flex h-screen w-full overflow-hidden bg-background">
                            <Sidebar />
                            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                                <TopBar />
                                <div className="flex flex-1 overflow-hidden">
                                    <main className="flex-1 overflow-auto p-6">
                                        {children}
                                    </main>
                                    <RightPanel /> {/* Persistent Context Panel */}
                                </div>
                            </div>
                        </div>
                    </LanguageProvider>
                </AuthProvider>
            </body>
        </html>
    )
}
