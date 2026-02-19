'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    data: any;
}

export function NotificationBell() {
    const { data: session }: any = useSession();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const API_URL = '';

    const fetchNotifications = async () => {
        if (!session?.accessToken) return;
        try {
            const headers = { 'Authorization': `Bearer ${session.accessToken}` };

            const [notifRes, countRes] = await Promise.all([
                fetch(`${API_URL}/api/protected/notifications?limit=15`, { headers }),
                fetch(`${API_URL}/api/protected/notifications/unread-count`, { headers })
            ]);

            if (notifRes.ok) {
                setNotifications(await notifRes.json());
            }
            if (countRes.ok) {
                const data = await countRes.json();
                setUnreadCount(data.count || 0);
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    // Poll every 30 seconds for new notifications
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [session]);

    const markAsRead = async (id: string) => {
        try {
            await fetch(`${API_URL}/api/protected/notifications/${id}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${session.accessToken}` }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error(error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch(`${API_URL}/api/protected/notifications/read-all`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${session.accessToken}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error(error);
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            markAsRead(notification.id);
        }

        // Route based on type
        if (notification.type === 'APPOINTMENT_REQUEST' || notification.type.includes('APPOINTMENT')) {
            router.push('/dashboard/calendar');
        } else if (notification.type === 'NEW_LEAD') {
            router.push('/dashboard/leads');
        } else if (notification.type === 'LISTING_SUSPENDED' || notification.type === 'CLAIM_FILED') {
            router.push('/claims');
        }

        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full animate-pulse border-2 border-background box-content" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40 bg-transparent"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border bg-card shadow-lg z-50 overflow-hidden"
                        >
                            <div className="p-3 border-b bg-muted/30 flex justify-between items-center">
                                <h3 className="font-semibold text-sm">Notificaciones</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Marcar todas leídas
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-muted-foreground text-sm">
                                        Sin notificaciones nuevas
                                    </div>
                                ) : (
                                    <div className="divide-y">
                                        {notifications.map(notification => (
                                            <div
                                                key={notification.id}
                                                onClick={() => handleNotificationClick(notification)}
                                                className={cn(
                                                    "p-4 hover:bg-muted/50 transition-colors cursor-pointer flex gap-3 text-left",
                                                    !notification.isRead && "bg-blue-500/5"
                                                )}
                                            >
                                                <div className={cn(
                                                    "h-2 w-2 mt-1.5 rounded-full shrink-0",
                                                    !notification.isRead ? "bg-blue-500" : "bg-transparent"
                                                )} />
                                                <div>
                                                    <p className={cn("text-sm font-medium", !notification.isRead && "text-blue-600 dark:text-blue-400")}>
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground mt-1.5 opacity-70">
                                                        {new Date(notification.createdAt).toLocaleDateString('es-MX')}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
