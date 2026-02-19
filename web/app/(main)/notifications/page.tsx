'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, CheckCheck, CalendarDays, Shield, Info, AlertTriangle, Loader2, X, Inbox } from 'lucide-react';
import { PageTransition, AnimatedCard } from '@/components/ui/animated';
import toast from 'react-hot-toast';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    data: Record<string, any>;
}

const TYPE_ICONS: Record<string, { icon: typeof Bell; color: string }> = {
    APPOINTMENT_REQUEST: { icon: CalendarDays, color: 'text-purple-500' },
    APPOINTMENT_CONFIRMED: { icon: CalendarDays, color: 'text-emerald-500' },
    APPOINTMENT_CANCELLED: { icon: CalendarDays, color: 'text-red-500' },
    APPOINTMENT_COMPLETED: { icon: CalendarDays, color: 'text-blue-500' },
    SYSTEM: { icon: Shield, color: 'text-blue-500' },
    WARNING: { icon: AlertTriangle, color: 'text-amber-500' },
};

export default function NotificationsPage() {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('ALL');

    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`${API}/api/protected/notifications?limit=50`, {
                headers: { Authorization: `Bearer ${(session as any)?.accessToken}` }
            });
            if (res.ok) setNotifications(await res.json());
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) fetchNotifications();
    }, [session]);

    const markRead = async (id: string) => {
        try {
            await fetch(`${API}/api/protected/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${(session as any)?.accessToken}` }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch {
            toast.error('Error al marcar como leída');
        }
    };

    const markAllRead = async () => {
        try {
            await fetch(`${API}/api/protected/notifications/read-all`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${(session as any)?.accessToken}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success('Todas las notificaciones marcadas como leídas');
        } catch {
            toast.error('Error al actualizar');
        }
    };

    const relativeTime = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Ahora';
        if (mins < 60) return `Hace ${mins}m`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `Hace ${hrs}h`;
        const days = Math.floor(hrs / 24);
        if (days < 7) return `Hace ${days}d`;
        return new Date(dateStr).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const typeFilters = [
        { key: 'ALL', label: 'Todas' },
        { key: 'APPOINTMENT', label: 'Citas' },
        { key: 'SYSTEM', label: 'Sistema' },
    ];

    const filtered = filter === 'ALL'
        ? notifications
        : notifications.filter(n => n.type.startsWith(filter));

    return (
        <PageTransition className="space-y-6">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-rose-500 to-pink-600 p-6 md:p-8 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
                <div className="relative z-10 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm relative">
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center bg-white text-rose-600 text-[10px] font-bold rounded-full px-1"
                                    >
                                        {unreadCount}
                                    </motion.span>
                                )}
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Notificaciones</h1>
                        </div>
                        <p className="text-white/80 text-sm md:text-base">
                            {unreadCount > 0
                                ? `Tienes ${unreadCount} notificación${unreadCount > 1 ? 'es' : ''} sin leer`
                                : 'Estás al día'
                            }
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="flex items-center gap-1.5 px-4 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-sm font-medium transition-colors backdrop-blur-sm"
                        >
                            <CheckCheck className="h-4 w-4" />
                            Marcar todo leído
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-2">
                {typeFilters.map(f => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === f.key
                            ? 'bg-rose-600 text-white shadow'
                            : 'bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Notifications List */}
            {loading ? (
                <div className="py-16 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-rose-500" />
                    <p className="text-muted-foreground text-sm">Cargando notificaciones...</p>
                </div>
            ) : filtered.length === 0 ? (
                <AnimatedCard className="p-12 text-center" index={0}>
                    <Inbox className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                    <h3 className="text-lg font-bold mb-1">Sin notificaciones</h3>
                    <p className="text-muted-foreground text-sm">No tienes notificaciones{filter !== 'ALL' ? ' en esta categoría' : ''}</p>
                </AnimatedCard>
            ) : (
                <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((notif, idx) => {
                            const typeConfig = TYPE_ICONS[notif.type] || TYPE_ICONS.SYSTEM;
                            const Icon = typeConfig.icon;
                            return (
                                <motion.div
                                    key={notif.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20, height: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                >
                                    <div
                                        className={`group flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${notif.isRead
                                            ? 'bg-card/50 border-border/50'
                                            : 'bg-card border-rose-200 dark:border-rose-800/50 shadow-sm'
                                            }`}
                                        onClick={() => !notif.isRead && markRead(notif.id)}
                                    >
                                        {/* Icon */}
                                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${notif.isRead ? 'bg-muted' : 'bg-rose-100 dark:bg-rose-900/30'
                                            }`}>
                                            <Icon className={`h-4 w-4 ${notif.isRead ? 'text-muted-foreground' : typeConfig.color}`} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h4 className={`text-sm font-medium truncate ${notif.isRead ? 'text-muted-foreground' : 'font-semibold'}`}>
                                                    {notif.title}
                                                </h4>
                                                {!notif.isRead && (
                                                    <span className="h-2 w-2 bg-rose-500 rounded-full shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                                            <p className="text-[10px] text-muted-foreground/60 mt-1">{relativeTime(notif.createdAt)}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </PageTransition>
    );
}
