'use client';
import { useLanguage } from '@/lib/i18n';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { PageTransition, AnimatedCard } from '@/components/ui/animated';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Home, AlertTriangle, Activity, Eye, Plus } from 'lucide-react';

//  Mock data for charts
const activityData = [
    { name: 'Lun', views: 124, added: 4 },
    { name: 'Mar', views: 189, added: 7 },
    { name: 'Mie', views: 156, added: 3 },
    { name: 'Jue', views: 203, added: 9 },
    { name: 'Vie', views: 178, added: 5 },
    { name: 'Sab', views: 145, added: 2 },
    { name: 'Dom', views: 98, added: 1 },
];

export default function Dashboard() {
    const { t } = useLanguage();
    const { data: session }: any = useSession();
    const [stats, setStats] = useState<any>(null);
    const [feed, setFeed] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!session?.accessToken) return;

            try {
                const [statsRes, feedRes] = await Promise.all([
                    fetch(`${API_URL}/api/protected/dashboard/stats`, {
                        headers: { 'Authorization': `Bearer ${session.accessToken}` }
                    }),
                    fetch(`${API_URL}/api/protected/dashboard/feed`, {
                        headers: { 'Authorization': `Bearer ${session.accessToken}` }
                    })
                ]);

                if (statsRes.ok) setStats(await statsRes.json());
                if (feedRes.ok) setFeed(await feedRes.json());
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchDashboardData();
        }
    }, [session, API_URL]);

    return (
        <PageTransition className="space-y-6">
            {/* Header con botón de acción */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        {t.dashboard.title}
                    </h2>
                    <p className="text-muted-foreground mt-1">{t.dashboard.subtitle}</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                    <Plus className="h-4 w-4" />
                    <span className="text-sm font-medium">Agregar Listado</span>
                </motion.button>
            </div>

            {/* Metric Cards con gradientes */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <AnimatedCard className="relative p-6 rounded-xl border bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-muted-foreground">{t.dashboard.activeListings}</div>
                            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Home className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            {loading ? '...' : stats?.activeListings?.toLocaleString() || '247'}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
                            <TrendingUp className="h-3 w-3" />
                            <span>+12% {t.dashboard.fromLastMonth}</span>
                        </div>
                    </div>
                </AnimatedCard>

                <AnimatedCard className="relative p-6 rounded-xl border bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 overflow-hidden group hover:shadow-lg transition-shadow" index={1}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-muted-foreground">{t.dashboard.pendingReview}</div>
                            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                <Eye className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {loading ? '...' : stats?.pendingReview?.toLocaleString() || '12'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                            Requieren atención
                        </div>
                    </div>
                </AnimatedCard>

                <AnimatedCard className="relative p-6 rounded-xl border bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 overflow-hidden group hover:shadow-lg transition-shadow" index={2}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-muted-foreground">{t.dashboard.governanceAlerts}</div>
                            <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-orange-600" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            {loading ? '...' : stats?.govAlerts?.toLocaleString() || '3'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                            Últimas 24 horas
                        </div>
                    </div>
                </AnimatedCard>

                <AnimatedCard className="relative p-6 rounded-xl border bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 overflow-hidden group hover:shadow-lg transition-shadow" index={3}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-muted-foreground">{t.dashboard.systemHealth}</div>
                            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <Activity className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            99.8%
                        </div>
                        <div className="text-xs text-green-600 mt-2">
                            Excelente
                        </div>
                    </div>
                </AnimatedCard>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Activity Chart */}
                <AnimatedCard className="p-6 rounded-xl border bg-card shadow-sm" index={4}>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">Actividad Semanal</h3>
                        <p className="text-sm text-muted-foreground">Visualizaciones y listados agregados</p>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={activityData}>
                            <defs>
                                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#6b7280" />
                            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Area type="monotone" dataKey="views" stroke="#0066FF" fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </AnimatedCard>

                {/* Listings Added Chart */}
                <AnimatedCard className="p-6 rounded-xl border bg-card shadow-sm" index={5}>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">Listados Agregados</h3>
                        <p className="text-sm text-muted-foreground">Nuevos listados por día</p>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={activityData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#6b7280" />
                            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Line type="monotone" dataKey="added" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} activeDot={{ r: 7 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </AnimatedCard>
            </div>

            {/* Feed Section - mantenido del original */}
            <AnimatedCard className="p-6 rounded-xl border bg-card shadow-sm" index={6}>
                <h3 className="text-lg font-semibold mb-4">Feed de Gobernanza</h3>
                {!loading && feed.length === 0 && (
                    <p className="text-sm text-muted-foreground">No hay eventos recientes</p>
                )}
                <div className="space-y-3">
                    {feed.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">{item.message}</p>
                                <p className="text-xs text-muted-foreground">{new Date(item.timestamp).toLocaleString()}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </AnimatedCard>

            {/* Claims Section */}
            <AnimatedCard className="p-6 rounded-xl border bg-card shadow-sm" index={7}>
                <h3 className="text-lg font-semibold mb-4">{t.dashboard.claims.open}</h3>
                <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-sm">{t.dashboard.claims.dispute}</p>
                                <p className="text-xs text-muted-foreground">Calle Victoria #123</p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => alert('Navegando a evidencia...')}
                                className="px-3 py-1.5 text-xs font-medium bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                            >
                                {t.dashboard.claims.review}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </AnimatedCard>
        </PageTransition>
    );
}
