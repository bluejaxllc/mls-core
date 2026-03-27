'use client';

import { Bell, Search, User, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationBell } from './NotificationBell';

export function TopBar() {
    const { t, language, setLanguage } = useLanguage();
    const { data: session, status } = useSession();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'es' : 'en');
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            // Redirect to listings page with search query
            router.push(`/listings?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="absolute top-3 right-4 z-50 flex items-center gap-2">
            {status === 'loading' ? (
                <div className="text-xs text-muted-foreground">...</div>
            ) : session?.user ? (
                <div className="relative">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                        <motion.div
                            layoutId="user-avatar"
                            className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border overflow-hidden ring-2 ring-transparent hover:ring-primary/20 transition-all"
                        >
                            {session.user.image ? (
                                <img src={session.user.image} alt="User" className="h-full w-full object-cover" />
                            ) : (
                                <User className="h-4 w-4" />
                            )}
                        </motion.div>
                        <div className="hidden md:block text-sm">
                            <p className="font-medium leading-none">{session.user.name || 'User'}</p>
                            <p className="text-xs text-muted-foreground">{(session.user as any).role || t.topbar.role}</p>
                        </div>
                    </div>

                    <AnimatePresence>
                        {userMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 top-full pt-2 w-48 z-50"
                            >
                                <div className="bg-card border rounded-md shadow-lg py-1">
                                    <div className="px-4 py-2 text-xs text-muted-foreground border-b mb-1 break-all">
                                        Sesión iniciada como <br /> <span className="text-foreground font-medium">{session.user.email}</span>
                                    </div>
                                    <button
                                        onClick={() => import('next-auth/react').then(({ signOut }) => signOut({ callbackUrl: '/auth/signin' }))}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-muted text-red-500 transition-colors font-medium"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ) : (
                <a href="/api/auth/signin" className="text-sm font-medium hover:underline">
                    Iniciar Sesión
                </a>
            )}
        </div>
    );
}
