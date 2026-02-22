'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, FileText, Upload, ShieldAlert, Settings, Sparkles, Globe, MessageCircle, Heart, Star, Wrench, CalendarDays, Bell, BarChart3, Users, MapPin, Shield, ChevronDown, UserCog, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';

export function Sidebar() {
    const { t } = useLanguage();
    const pathname = usePathname();
    const [adminOpen, setAdminOpen] = useState(pathname.startsWith('/admin'));

    const items = [
        { name: t.sidebar.dashboard, href: '/dashboard', icon: Home, badge: null },
        { name: t.sidebar.search, href: '/properties', icon: Search, badge: null },
        { name: t.sidebar.listings, href: '/listings', icon: FileText, badge: 12 },
        { name: t.sidebar.ingestion, href: '/ingestion', icon: Upload, badge: null },
        { name: t.sidebar.governance, href: '/governance', icon: ShieldAlert, badge: 3 },
        { name: (t.sidebar as any).intelligence, href: '/intelligence', icon: Globe, badge: 5 },
        { name: 'Mensajes', href: '/messages', icon: MessageCircle, badge: null },
        { name: 'Favoritos', href: '/favorites', icon: Heart, badge: null },
        { name: 'Reseñas', href: '/reviews', icon: Star, badge: null },
        { name: 'Citas', href: '/appointments', icon: CalendarDays, badge: null },
        { name: 'Notificaciones', href: '/notifications', icon: Bell, badge: null },
        { name: 'Analíticas', href: '/analytics', icon: BarChart3, badge: null },
        { name: 'Agentes', href: '/agents', icon: Users, badge: null },
        { name: 'Mapa', href: '/map', icon: MapPin, badge: null },
        { name: 'Herramientas', href: '/tools', icon: Wrench, badge: null },
        { name: t.sidebar.system, href: '/system', icon: Settings, badge: null },
    ];

    const adminItems = [
        { name: 'Personal', href: '/admin/staff', icon: UserCog },
        { name: 'Beta Users', href: '/admin/beta', icon: Users },
        { name: 'Intelligence', href: '/admin/intelligence', icon: Zap },
    ];

    return (
        <div className="hidden md:flex md:w-16 lg:w-64 border-r border-blue-500/10 bg-gradient-to-b from-card to-card/50 backdrop-blur-sm flex-col items-center lg:items-stretch py-4 gap-1 relative overflow-hidden">
            {/* Right glow line */}
            <div className="absolute right-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-blue-500/20 to-transparent pointer-events-none" />
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

            {/* Logo Section */}
            <div className="px-4 mb-6 hidden lg:block relative z-10">
                <div className="group cursor-pointer">
                    <h1 className="font-bold tracking-tight text-lg flex items-center gap-2 mb-1">
                        <motion.span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500 font-black"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400 }}
                        >
                            {t.sidebar.brand}
                        </motion.span>
                        <span className="text-foreground font-semibold">{t.sidebar.core}</span>
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}
                        >
                            <Sparkles className="h-3 w-3 text-blue-500" />
                        </motion.div>
                    </h1>
                    <p className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider">
                        {t.sidebar.region}
                    </p>
                </div>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 relative z-10">
                {items.map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link
                                href={item.href}
                                className={cn(
                                    "relative flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg transition-all duration-200 group mb-1",
                                    isActive
                                        ? "text-foreground shadow-lg"
                                        : "text-muted-foreground hover:text-foreground hover:translate-x-1"
                                )}
                            >
                                {/* Active indicator with gradient */}
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}

                                {/* Hover effect */}
                                {!isActive && (
                                    <div className="absolute inset-0 bg-muted/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                )}

                                {/* Active left border indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-border"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-r-full"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}

                                {/* Icon with animation */}
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: isActive ? 0 : 5 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                    className="relative z-10"
                                >
                                    <item.icon className={cn(
                                        "h-5 w-5 relative z-10",
                                        isActive && "text-blue-500"
                                    )} />
                                </motion.div>

                                {/* Text */}
                                <span className={cn(
                                    "hidden lg:block text-sm font-medium relative z-10 transition-all",
                                    isActive && "font-semibold"
                                )}>
                                    {item.name}
                                </span>

                                {/* Badge */}
                                {item.badge && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="hidden lg:flex items-center justify-center ml-auto h-5 min-w-5 px-1.5 text-[10px] font-bold bg-blue-500 text-white rounded-full relative z-10"
                                    >
                                        {item.badge}
                                    </motion.span>
                                )}

                                {/* Dot indicator for mobile when has badge */}
                                {item.badge && (
                                    <span className="lg:hidden absolute top-1.5 right-1.5 h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                                )}
                            </Link>
                        </motion.div>
                    );
                })}
            </div>

            {/* Admin Section */}
            <div className="relative z-10 mt-2 mx-2">
                <button
                    onClick={() => setAdminOpen(!adminOpen)}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                        pathname.startsWith('/admin')
                            ? "text-foreground bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                >
                    <Shield className={cn("h-5 w-5", pathname.startsWith('/admin') && "text-violet-500")} />
                    <span className="hidden lg:block text-sm font-medium flex-1 text-left">Admin</span>
                    <motion.div
                        animate={{ rotate: adminOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="hidden lg:block"
                    >
                        <ChevronDown className="h-4 w-4" />
                    </motion.div>
                </button>
                <AnimatePresence>
                    {adminOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            {adminItems.map((item, index) => {
                                const isActive = pathname === item.href;
                                return (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2 ml-4 rounded-lg transition-all duration-200 text-sm",
                                                isActive
                                                    ? "text-violet-500 font-semibold bg-violet-500/10"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                            )}
                                        >
                                            <item.icon className={cn("h-4 w-4", isActive && "text-violet-500")} />
                                            <span className="hidden lg:block">{item.name}</span>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom decorative element */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none" />
        </div>
    );
}
