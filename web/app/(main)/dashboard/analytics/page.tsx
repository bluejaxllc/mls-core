'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import {
    Eye, Users, TrendingUp, Crown, ArrowLeft, Monitor,
    Smartphone, HelpCircle, BarChart3, Loader2
} from 'lucide-react';
import { PageTransition, AnimatedCard } from '@/components/ui/animated';
import Link from 'next/link';

interface OverviewData {
    totalViews: number;
    uniqueViewers: number;
    weekTrend: number;
    thisWeekViews: number;
    dailyViews: { date: string; views: number; label: string }[];
    topListing: { id: string; title: string; views: number } | null;
}

interface RankingItem {
    listingId: string;
    title: string;
    address: string;
    price: number;
    status: string;
    image: string | null;
    views: number;
}

const DONUT_COLORS = ['#3B82F6', '#8B5CF6', '#6B7280'];

export default function AnalyticsPage() {
    const { data: session }: any = useSession();
    const [overview, setOverview] = useState<OverviewData | null>(null);
    const [rankings, setRankings] = useState<RankingItem[]>([]);
    const [deviceData, setDeviceData] = useState<{ name: string; value: number; icon: any }[]>([]);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!session?.accessToken) {
                setLoading(false);
                return;
            }

            const headers = { 'Authorization': `Bearer ${session.accessToken}` };

            try {
                const [overviewRes, rankingsRes] = await Promise.all([
                    fetch(`${API_URL}/api/protected/analytics/overview`, { headers }).catch(() => null),
                    fetch(`${API_URL}/api/protected/analytics/rankings`, { headers }).catch(() => null),
                ]);

                if (overviewRes?.ok) {
                    const data = await overviewRes.json();
                    setOverview(data);
                }

                if (rankingsRes?.ok) {
                    const data = await rankingsRes.json();
                    setRankings(data);

                    // If we have a top listing, fetch its device breakdown
                    if (data.length > 0) {
                        const topId = data[0].listingId;
                        const detailRes = await fetch(
                            `${API_URL}/api/protected/analytics/listings/${topId}/views`,
                            { headers }
                        ).catch(() => null);

                        if (detailRes?.ok) {
                            const detail = await detailRes.json();
                            if (detail.deviceBreakdown) {
                                setDeviceData([
                                    { name: 'Desktop', value: detail.deviceBreakdown.desktop, icon: Monitor },
                                    { name: 'Móvil', value: detail.deviceBreakdown.mobile, icon: Smartphone },
                                    { name: 'Otro', value: detail.deviceBreakdown.unknown, icon: HelpCircle },
                                ]);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Analytics fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (session !== undefined) fetchAnalytics();
    }, [session, API_URL]);

    const fmt = (n: number) => `$${Math.round(n).toLocaleString('es-MX')}`;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                    <p className="text-muted-foreground">Cargando analíticas...</p>
                </div>
            </div>
        );
    }

    const totalDeviceViews = deviceData.reduce((s, d) => s + d.value, 0);

    return (
        <PageTransition className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </motion.button>
                </Link>
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                        Analíticas de Listados
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        Rendimiento de tus propiedades en los últimos 30 días
                    </p>
                </div>
            </div>

            {/* Primary Stat Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <AnimatedCard className="relative p-6 rounded-xl border bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/20 dark:to-blue-950/20 overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-muted-foreground">Vistas Totales</div>
                            <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                <Eye className="h-5 w-5 text-violet-600" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                            {overview?.totalViews?.toLocaleString() || '0'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                            Últimos 30 días
                        </div>
                    </div>
                </AnimatedCard>

                <AnimatedCard className="relative p-6 rounded-xl border bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 overflow-hidden group hover:shadow-lg transition-shadow" index={1}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-muted-foreground">Visitantes Únicos</div>
                            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Users className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            {overview?.uniqueViewers?.toLocaleString() || '0'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                            Usuarios registrados
                        </div>
                    </div>
                </AnimatedCard>

                <AnimatedCard className="relative p-6 rounded-xl border bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 overflow-hidden group hover:shadow-lg transition-shadow" index={2}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-muted-foreground">Tendencia 7 Días</div>
                            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-emerald-600" />
                            </div>
                        </div>
                        <div className={`text-3xl font-bold ${(overview?.weekTrend || 0) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {(overview?.weekTrend || 0) > 0 ? '+' : ''}{overview?.weekTrend || 0}%
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                            {overview?.thisWeekViews || 0} vistas esta semana
                        </div>
                    </div>
                </AnimatedCard>

                <AnimatedCard className="relative p-6 rounded-xl border bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 overflow-hidden group hover:shadow-lg transition-shadow" index={3}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-muted-foreground">Top Propiedad</div>
                            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                                <Crown className="h-5 w-5 text-amber-600" />
                            </div>
                        </div>
                        <div className="text-lg font-bold text-amber-700 dark:text-amber-400 truncate">
                            {overview?.topListing?.title || 'Sin datos'}
                        </div>
                        {overview?.topListing && (
                            <Link
                                href={`/properties/${overview.topListing.id}`}
                                className="text-xs text-amber-600 hover:text-amber-700 mt-2 inline-flex items-center gap-1"
                            >
                                {overview.topListing.views} vistas →
                            </Link>
                        )}
                    </div>
                </AnimatedCard>
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Views Over Time (2/3 width) */}
                <AnimatedCard className="md:col-span-2 p-6 rounded-xl border bg-card shadow-sm" index={4}>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">Vistas por Día</h3>
                        <p className="text-sm text-muted-foreground">Tendencia de los últimos 30 días</p>
                    </div>
                    {overview?.dailyViews && overview.dailyViews.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart data={overview.dailyViews}>
                                <defs>
                                    <linearGradient id="colorAnalytics" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
                                <XAxis
                                    dataKey="label"
                                    tick={{ fontSize: 10 }}
                                    stroke="#6b7280"
                                    interval={4}
                                />
                                <YAxis tick={{ fontSize: 11 }} stroke="#6b7280" allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                    labelFormatter={((label: string) => `Fecha: ${label}`) as any}
                                    formatter={((value: number) => [`${value} vistas`, 'Vistas']) as any}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#7C3AED"
                                    fillOpacity={1}
                                    fill="url(#colorAnalytics)"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4, fill: '#7C3AED' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
                            <div className="text-center space-y-2">
                                <BarChart3 className="h-10 w-10 mx-auto opacity-30" />
                                <p>No hay datos de vistas aún</p>
                                <p className="text-xs">Las vistas se registrarán cuando alguien visite tus propiedades</p>
                            </div>
                        </div>
                    )}
                </AnimatedCard>

                {/* Device Breakdown (1/3 width) */}
                <AnimatedCard className="p-6 rounded-xl border bg-card shadow-sm" index={5}>
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold">Dispositivos</h3>
                        <p className="text-sm text-muted-foreground">Distribución de visitas</p>
                    </div>
                    {totalDeviceViews > 0 ? (
                        <div className="space-y-4">
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie
                                        data={deviceData.filter(d => d.value > 0)}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={45}
                                        outerRadius={70}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {deviceData.filter(d => d.value > 0).map((_, index) => (
                                            <Cell key={index} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={((value: number) => [`${value} vistas`, '']) as any}
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-2">
                                {deviceData.map((d, i) => (
                                    <div key={d.name} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: DONUT_COLORS[i] }}
                                            />
                                            <d.icon className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span>{d.name}</span>
                                        </div>
                                        <span className="font-medium">
                                            {totalDeviceViews > 0 ? Math.round((d.value / totalDeviceViews) * 100) : 0}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                            <div className="text-center space-y-2">
                                <Monitor className="h-10 w-10 mx-auto opacity-30" />
                                <p>Sin datos de dispositivos</p>
                            </div>
                        </div>
                    )}
                </AnimatedCard>
            </div>

            {/* Rankings Table */}
            <AnimatedCard className="p-6 rounded-xl border bg-card shadow-sm" index={6}>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Ranking de Propiedades</h3>
                    <p className="text-sm text-muted-foreground">Tus listados ordenados por visualizaciones</p>
                </div>
                {rankings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="pb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">#</th>
                                    <th className="pb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Propiedad</th>
                                    <th className="pb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Precio</th>
                                    <th className="pb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Estado</th>
                                    <th className="pb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Vistas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {rankings.map((item, idx) => (
                                    <motion.tr
                                        key={item.listingId}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-muted/30 transition-colors group"
                                    >
                                        <td className="py-3 pr-3">
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                idx === 1 ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' :
                                                    idx === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                        'bg-muted text-muted-foreground'
                                                }`}>
                                                {idx + 1}
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <Link href={`/properties/${item.listingId}`} className="group-hover:text-blue-600 transition-colors">
                                                <div className="font-medium text-sm truncate max-w-[300px]">
                                                    {item.title || 'Propiedad'}
                                                </div>
                                                <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                                                    {item.address}
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="py-3 hidden md:table-cell">
                                            <span className="text-sm font-medium text-emerald-600">
                                                {item.price ? fmt(item.price) : '—'}
                                            </span>
                                        </td>
                                        <td className="py-3 hidden md:table-cell">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                item.status === 'SOLD' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                                }`}>
                                                {item.status === 'ACTIVE' ? 'Activo' : item.status === 'SOLD' ? 'Vendido' : item.status}
                                            </span>
                                        </td>
                                        <td className="py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden hidden lg:block">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${rankings[0]?.views ? (item.views / rankings[0].views) * 100 : 0}%` }}
                                                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                                                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                                                    />
                                                </div>
                                                <span className="font-bold text-sm min-w-[40px] text-right">
                                                    {item.views.toLocaleString()}
                                                </span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-12 text-center text-muted-foreground">
                        <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">Sin datos de ranking</p>
                        <p className="text-sm mt-1">Publica propiedades para empezar a ver analíticas</p>
                    </div>
                )}
            </AnimatedCard>
        </PageTransition>
    );
}
