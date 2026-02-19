'use client';

import { Bell, Search, User, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileMenu } from './MobileMenu';
import { NotificationBell } from './NotificationBell';

export function TopBar() {
    const { t, language, setLanguage } = useLanguage();
    const { data: session, status } = useSession();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const [isFocused, setIsFocused] = useState(false);

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
        <div className="h-14 border-b border-blue-500/10 bg-card/80 backdrop-blur-xl flex items-center pl-14 md:pl-4 pr-4 gap-4 justify-between relative">
            <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
            {/* Mobile Menu - Only on mobile */}
            <MobileMenu />

            <motion.div
                initial={false}
                animate={{ width: searchQuery || isFocused ? "100%" : "300px" }}
                className="hidden sm:flex items-center gap-2 flex-1 max-w-xl bg-muted/30 px-3 py-1.5 rounded-full border border-transparent focus-within:border-primary/20 focus-within:bg-muted/50 transition-colors"
            >
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={t.topbar.searchPlaceholder}
                    className="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-muted-foreground/70"
                />
            </motion.div>

            <div className="flex items-center gap-4">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleLanguage}
                    className="flex items-center gap-1 text-xs font-mono border px-2 py-1 rounded hover:bg-muted transition-colors relative overflow-hidden"
                >
                    <Globe className="h-3 w-3" />
                    <AnimatePresence mode='wait'>
                        <motion.span
                            key={language}
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 10, opacity: 0 }}
                        >
                            {language.toUpperCase()}
                        </motion.span>
                    </AnimatePresence>
                </motion.button>

                <div className="hidden md:flex flex-col items-end">
                    <motion.span
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-xs font-mono text-green-500 relative"
                    >
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block mr-1" />
                        {t.topbar.systemOnline}
                    </motion.span>
                    <span className="text-xs text-muted-foreground">{t.topbar.latency}: 24ms</span>
                </div>
                <div className="h-6 w-[1px] bg-border mx-2"></div>

                <NotificationBell />

                {status === 'loading' ? (
                    <div className="text-xs text-muted-foreground">Cargando...</div>
                ) : session?.user ? (
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative group"
                    >
                        <div className="flex items-center gap-2 cursor-pointer">
                            <motion.div
                                layoutId="user-avatar"
                                className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border overflow-hidden ring-2 ring-transparent group-hover:ring-primary/20 transition-all"
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

                        {/* Logout Dropdown (Simple implementation) */}
                        <div className="absolute right-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <div className="bg-card border rounded-md shadow-lg py-1">
                                <div className="px-4 py-2 text-xs text-muted-foreground border-b mb-1">
                                    Sesión iniciada como <br /> <span className="text-foreground font-medium">{session.user.email}</span>
                                </div>
                                <button
                                    onClick={() => import('next-auth/react').then(({ signOut }) => signOut({ callbackUrl: '/auth/signin' }))}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted text-red-400 hover:text-red-500 transition-colors"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex items-center gap-2 pl-2">
                        <a href="/api/auth/signin" className="text-sm font-medium hover:underline">
                            Iniciar Sesión
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
