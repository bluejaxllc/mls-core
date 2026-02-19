'use client';
import { useLanguage } from '@/lib/i18n';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { PageTransition, AnimatedCard } from '@/components/ui/animated';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
    TrendingUp, Home, Activity, Eye, Plus, Heart, MessageCircle, Star, Calculator,
    Building2, DollarSign, MapPin, Calendar, ArrowRight, BarChart3, Users, Bell
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { GovernanceStatsCard } from '../../../components/governance/GovernanceStatsCard';
import Link from 'next/link';

export default function Dashboard() {
    const { t } = useLanguage();
    const { data: session }: any = useSession();
    const [stats, setStats] = useState<any>(null);
    const [feed, setFeed] = useState<any[]>([]);
    const [activityData, setActivityData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // New live widgets
    const [favCount, setFavCount] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [marketStats, setMarketStats] = useState<any>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!session?.accessToken) return;

            try {
                const headers = { 'Authorization': `Bearer ${session.accessToken}` };

                const [statsRes, feedRes, chartRes, favsRes, msgRes, mktRes] = await Promise.all([
                    fetch(`${API_URL}/api/protected/dashboard/stats`, { headers }).catch(() => null),
                    fetch(`${API_URL}/api/protected/dashboard/feed`, { headers }).catch(() => null),
                    fetch(`${API_URL}/api/protected/dashboard/chart-data`, { headers }).catch(() => null),
                    fetch(`${API_URL}/api/protected/favorites/ids`, { headers }).catch(() => null),
                    fetch(`${API_URL}/api/protected/messages/unread-count`, { headers }).catch(() => null),
                    fetch(`${API_URL}/api/public/market-stats`).catch(() => null),
                ]);

                if (statsRes?.ok) setStats(await statsRes.json());
                if (feedRes?.ok) setFeed(await feedRes.json());
                if (chartRes?.ok) setActivityData(await chartRes.json());
                if (favsRes?.ok) {
                    const ids = await favsRes.json();
                    setFavCount(Array.isArray(ids) ? ids.length : 0);
                }
                if (msgRes?.ok) {
                    const data = await msgRes.json();
                    setUnreadMessages(data.count || 0);
                }
                if (mktRes?.ok) setMarketStats(await mktRes.json());

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

    const fmt = (n: number) => `$${Math.round(n).toLocaleString('es-MX')}`;

    return (
        <PageTransition className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        {t.dashboard.title}
                    </h2>
                    <p className="text-muted-foreground mt-1">{t.dashboard.subtitle}</p>
                </div>
                <Link href="/listings">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="text-sm font-medium">Agregar Listado</span>
                    </motion.button>
                </Link>
            </div>

            {/* Primary Metric Cards */}
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
                            {loading ? '...' : marketStats?.activeListings?.toLocaleString() || stats?.activeListings?.toLocaleString() || '0'}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-green-600 mt-2">
                            <TrendingUp className="h-3 w-3" />
                            <span>{t.dashboard.fromLastMonth}</span>
                        </div>
                    </div>
                </AnimatedCard>

                <AnimatedCard className="relative p-6 rounded-xl border bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 overflow-hidden group hover:shadow-lg transition-shadow" index={1}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-muted-foreground">Mis Favoritos</div>
                            <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                                <Heart className="h-5 w-5 text-red-500" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                            {loading ? '...' : favCount}
                        </div>
                        <Link href="/favorites" className="flex items-center gap-1 text-xs text-red-500 mt-2 hover:text-red-600">
                            Ver favoritos <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                </AnimatedCard>

                <AnimatedCard className="relative p-6 rounded-xl border bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-violet-950/20 overflow-hidden group hover:shadow-lg transition-shadow" index={2}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-muted-foreground">Mensajes</div>
                            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center relative">
                                <MessageCircle className="h-5 w-5 text-indigo-600" />
                                {unreadMessages > 0 && (
                                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                                        {unreadMessages}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            {loading ? '...' : unreadMessages > 0 ? unreadMessages : '0'}
                        </div>
                        <Link href="/messages" className="flex items-center gap-1 text-xs text-indigo-500 mt-2 hover:text-indigo-600">
                            {unreadMessages > 0 ? 'Sin leer' : 'Sin mensajes nuevos'} <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                </AnimatedCard>

                <AnimatedCard className="relative p-6 rounded-xl border bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 overflow-hidden group hover:shadow-lg transition-shadow" index={3}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-muted-foreground">Precio Promedio</div>
                            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <DollarSign className="h-5 w-5 text-emerald-600" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            {loading ? '...' : marketStats ? fmt(marketStats.avgPrice) : '$0'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                            MXN promedio
                        </div>
                    </div>
                </AnimatedCard>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { name: 'Analíticas', href: '/dashboard/analytics', icon: Eye, color: 'from-violet-500 to-indigo-500' },
                    { name: 'Comparar', href: '/compare', icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
                    { name: 'Calculadora', href: '/tools/calculator', icon: Calculator, color: 'from-emerald-500 to-teal-500' },
                    { name: 'Herramientas', href: '/tools', icon: Activity, color: 'from-purple-500 to-pink-500' },
                ].map((action, idx) => (
                    <Link key={action.name} href={action.href}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + idx * 0.05 }}
                            whileHover={{ y: -3, scale: 1.02 }}
                            className={`bg-gradient-to-br ${action.color} rounded-xl p-4 text-white cursor-pointer shadow-md hover:shadow-xl transition-shadow`}
                        >
                            <action.icon className="h-6 w-6 mb-2 opacity-80" />
                            <p className="text-sm font-semibold">{action.name}</p>
                        </motion.div>
                    </Link>
                ))}
            </div>

            {/* Market Overview + Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Activity Chart */}
                <AnimatedCard className="p-6 rounded-xl border bg-card shadow-sm" index={4}>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">Actividad Semanal</h3>
                        <p className="text-sm text-muted-foreground">Visualizaciones y listados agregados</p>
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={activityData}>
                            <defs>
                                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#6b7280" />
                            <YAxis tick={{ fontSize: 11 }} stroke="#6b7280" />
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

                {/* Market by Property Type */}
                <AnimatedCard className="p-6 rounded-xl border bg-card shadow-sm" index={5}>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">Mercado por Tipo</h3>
                        <p className="text-sm text-muted-foreground">Distribución de propiedades activas</p>
                    </div>
                    {marketStats?.byPropertyType ? (
                        <div className="space-y-3">
                            {Object.entries(marketStats.byPropertyType)
                                .sort(([, a]: any, [, b]: any) => b.count - a.count)
                                .slice(0, 5)
                                .map(([type, data]: [string, any]) => {
                                    const pct = marketStats.activeListings > 0 ? (data.count / marketStats.activeListings) * 100 : 0;
                                    const colors: Record<string, string> = {
                                        casa: '#3B82F6', departamento: '#8B5CF6', terreno: '#10B981',
                                        comercial: '#F59E0B', oficina: '#EF4444'
                                    };
                                    return (
                                        <div key={type}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="capitalize font-medium">{type}</span>
                                                <span className="text-muted-foreground">{data.count} • {fmt(data.avgPrice)}</span>
                                            </div>
                                            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 0.8 }}
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: colors[type.toLowerCase()] || '#6B7280' }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    ) : (
                        <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">
                            {loading ? 'Cargando...' : 'Sin datos de mercado'}
                        </div>
                    )}
                </AnimatedCard>
            </div>

            {/* Bottom Row: Feed + Governance */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Governance Feed */}
                <AnimatedCard className="p-6 rounded-xl border bg-card shadow-sm" index={6}>
                    <h3 className="text-lg font-semibold mb-4">Feed de Gobernanza</h3>
                    {!loading && feed.length === 0 && (
                        <p className="text-sm text-muted-foreground">No hay eventos recientes</p>
                    )}
                    <div className="space-y-3 max-h-64 overflow-y-auto">
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

                {/* Quick Stats Summary */}
                <AnimatedCard className="p-6 rounded-xl border bg-card shadow-sm" index={7}>
                    <h3 className="text-lg font-semibold mb-4">Resumen del Mercado</h3>
                    {marketStats ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm">Total de Listados</span>
                                </div>
                                <span className="font-bold">{marketStats.totalListings}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-emerald-500" />
                                    <span className="text-sm">Precio Mediano</span>
                                </div>
                                <span className="font-bold text-emerald-600">{fmt(marketStats.medianPrice)}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-orange-500" />
                                    <span className="text-sm">Rango de Precios</span>
                                </div>
                                <span className="text-xs font-medium">{fmt(marketStats.minPrice)} — {fmt(marketStats.maxPrice)}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-red-500" />
                                    <span className="text-sm">Ciudades</span>
                                </div>
                                <span className="font-bold">{Object.keys(marketStats.byCity || {}).length}</span>
                            </div>
                            <Link href="/tools" className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 font-medium mt-2">
                                Ver análisis completo <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">{loading ? 'Cargando...' : 'Sin datos'}</p>
                    )}
                </AnimatedCard>
            </div>

            <GovernanceStatsCard stats={stats} loading={loading} />
        </PageTransition>
    );
}
