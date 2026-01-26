'use client';

import { Bell, Search, User, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function TopBar() {
    const { t, language, setLanguage } = useLanguage();
    const { data: session, status } = useSession();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'es' : 'en');
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            // TODO: Implement proper search results page
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="h-14 border-b bg-card flex items-center px-4 gap-4 justify-between">
            <div className="flex items-center gap-2 flex-1 max-w-xl">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    placeholder={t.topbar.searchPlaceholder}
                    className="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-muted-foreground"
                />
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-1 text-xs font-mono border px-2 py-1 rounded hover:bg-muted transition-colors"
                >
                    <Globe className="h-3 w-3" />
                    {language.toUpperCase()}
                </button>

                <div className="hidden md:flex flex-col items-end">
                    <span className="text-xs font-mono text-green-500">{t.topbar.systemOnline}</span>
                    <span className="text-xs text-muted-foreground">{t.topbar.latency}: 24ms</span>
                </div>
                <div className="h-6 w-[1px] bg-border mx-2"></div>
                <button className="relative">
                    <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {status === 'loading' ? (
                    <div className="text-xs text-muted-foreground">Loading...</div>
                ) : session?.user ? (
                    <div className="relative group">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border overflow-hidden">
                                {session.user.image ? (
                                    <img src={session.user.image} alt="User" className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-4 w-4" />
                                )}
                            </div>
                            <div className="hidden md:block text-sm">
                                <p className="font-medium leading-none">{session.user.name || 'User'}</p>
                                <p className="text-xs text-muted-foreground">{(session.user as any).role || t.topbar.role}</p>
                            </div>
                        </div>

                        {/* Logout Dropdown (Simple implementation) */}
                        <div className="absolute right-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <div className="bg-card border rounded-md shadow-lg py-1">
                                <div className="px-4 py-2 text-xs text-muted-foreground border-b mb-1">
                                    Signed in as <br /> <span className="text-foreground font-medium">{session.user.email}</span>
                                </div>
                                <button
                                    onClick={() => import('next-auth/react').then(({ signOut }) => signOut({ callbackUrl: '/auth/signin' }))}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-muted text-red-400 hover:text-red-500 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 pl-2">
                        <a href="/api/auth/signin" className="text-sm font-medium hover:underline">
                            Sign In
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
