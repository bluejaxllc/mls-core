'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home, Search, FileText, Upload, ShieldAlert, Settings, Menu, X,
    Globe, MessageCircle, Heart, Star, CalendarDays, Bell, BarChart3, Users, MapPin, Wrench
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';
import { useState, useEffect } from 'react';

export function MobileMenu() {
    const { t } = useLanguage();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const items = [
        { name: t.sidebar.dashboard, href: '/dashboard', icon: Home },
        { name: t.sidebar.search, href: '/properties', icon: Search },
        { name: t.sidebar.listings, href: '/listings', icon: FileText },
        { name: 'Mensajes', href: '/messages', icon: MessageCircle },
        { name: 'Favoritos', href: '/favorites', icon: Heart },
        { name: 'Reseñas', href: '/reviews', icon: Star },
        { name: 'Citas', href: '/appointments', icon: CalendarDays },
        { name: 'Notificaciones', href: '/notifications', icon: Bell },
        { name: 'Analíticas', href: '/analytics', icon: BarChart3 },
        { name: 'Agentes', href: '/agents', icon: Users },
        { name: 'Mapa', href: '/map', icon: MapPin },
        { name: t.sidebar.ingestion, href: '/ingestion', icon: Upload },
        { name: t.sidebar.governance, href: '/governance', icon: ShieldAlert },
        { name: (t.sidebar as any).intelligence || 'Inteligencia', href: '/intelligence', icon: Globe },
        { name: 'Herramientas', href: '/tools', icon: Wrench },
        { name: t.sidebar.system, href: '/system', icon: Settings },
    ];

    return (
        <>
            {/* Hamburger Button - Fixed position, only on mobile */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-3 left-3 z-50 p-2.5 bg-card/90 backdrop-blur-sm border border-border rounded-lg shadow-lg text-foreground active:scale-95 transition-all"
                aria-label="Menu"
                style={{ minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                {isOpen ? (
                    <X className="h-5 w-5" />
                ) : (
                    <Menu className="h-5 w-5" />
                )}
            </button>

            {/* Backdrop - uses CSS transition instead of framer-motion */}
            <div
                onClick={() => setIsOpen(false)}
                className={cn(
                    "fixed inset-0 bg-black/60 z-[60] md:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
            />

            {/* Menu Drawer - uses CSS transform instead of framer-motion */}
            <div
                className={cn(
                    "fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border z-[70] md:hidden overflow-y-auto transition-transform duration-300 ease-out",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">MLS</span>
                        </div>
                        <span className="font-semibold text-foreground">Blue Jax</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-muted rounded-lg text-foreground"
                        style={{ minWidth: '40px', minHeight: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="p-3 space-y-1">
                    {items.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-all",
                                    isActive
                                        ? "bg-blue-500/15 text-blue-400 font-medium"
                                        : "text-foreground/70 active:bg-muted"
                                )}
                            >
                                <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-blue-400")} />
                                <span className="text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}
