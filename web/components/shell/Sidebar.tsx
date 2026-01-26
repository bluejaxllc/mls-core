'use client';

import Link from 'next/link';
import { Home, Search, FileText, Upload, ShieldAlert, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';

export function Sidebar() {
    const { t } = useLanguage();

    const items = [
        { name: t.sidebar.dashboard, href: '/', icon: Home },
        { name: t.sidebar.search, href: '/properties', icon: Search },
        { name: t.sidebar.listings, href: '/listings', icon: FileText },
        { name: t.sidebar.ingestion, href: '/ingestion', icon: Upload },
        { name: t.sidebar.governance, href: '/governance', icon: ShieldAlert },
        { name: t.sidebar.system, href: '/system', icon: Settings },
    ];

    return (
        <div className="w-16 lg:w-64 border-r bg-card flex flex-col items-center lg:items-stretch py-4 gap-2">
            <div className="px-4 mb-6 hidden lg:block">
                <h1 className="font-bold tracking-tight text-lg flex items-center gap-2">
                    <span className="text-blue-500 font-black">{t.sidebar.brand}</span> <span className="text-foreground">{t.sidebar.core}</span>
                </h1>
                <p className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider">{t.sidebar.region}</p>
            </div>

            {items.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 mx-2 rounded-md transition-colors",
                        "text-muted-foreground hover:text-foreground hover:bg-muted",
                        item.name === 'Dashboard' && "bg-muted text-foreground" // Active state mock
                    )}
                >
                    <item.icon className="h-5 w-5" />
                    <span className="hidden lg:block text-sm font-medium">{item.name}</span>
                </Link>
            ))}
        </div>
    );
}
