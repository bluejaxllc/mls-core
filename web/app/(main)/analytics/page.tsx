'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { BarChart3, Eye, Users, TrendingUp, Trophy, Loader2, Monitor, Smartphone, Building2 } from 'lucide-react';
import { PageTransition, AnimatedCard } from '@/components/ui/animated';

interface AnalyticsOverview {
    totalViews: number;
    uniqueViewers: number;
    weekTrend: number;
    thisWeekViews: number;
    dailyViews: { date: string; views: number }[];
    topListing: { id: string; title: string; views: number } | null;
}

interface ListingRanking {
    listingId: string;
    title: string;
    price: number;
    status: string;
    image: string | null;
    views: number;
}

export default function AnalyticsPage() {
    const { data: session } = useSession();
    const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
    const [rankings, setRankings] = useState<ListingRanking[]>([]);
    const [loading, setLoading] = useState(true);

    const API = '';
    const headers = { Authorization: `Bearer ${(session as any)?.accessToken}` };

    useEffect(() => {
        if (!session) return;
        Promise.all([
            fetch(`${API}/api/protected/analytics/overview`, { headers }).then(r => r.json()),
            fetch(`${API}/api/protected/analytics/rankings`, { headers }).then(r => r.json()),
        ])
            .then(([ov, rank]) => {
                setOverview(ov);
                setRankings(Array.isArray(rank) ? rank : []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [session]);

    const fmt = (n: number) => n.toLocaleString('es-MX');
    const fmtPrice = (n: number) => `$${Math.round(n).toLocaleString('es-MX')}`;

    return (
        <PageTransition className="space-y-6">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 p-6 md:p-8 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <BarChart3 className="h-5 w-5" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Analíticas</h1>
                    </div>
                    <p className="text-white/80 text-sm md:text-base max-w-xl">Rendimiento de tus listados en los últimos 30 días</p>
                </div>
            </div>

            {loading ? (
                <div className="py-16 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-500" />
                    <p className="text-muted-foreground text-sm">Cargando analíticas...</p>
                </div>
            ) : !overview ? (
                <AnimatedCard className="p-12 text-center" index={0}>
                    <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                    <h3 className="text-lg font-bold mb-1">Sin datos</h3>
                    <p className="text-muted-foreground text-sm">Aún no hay analíticas disponibles</p>
                </AnimatedCard>
            ) : (
                <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { label: 'Total Vistas', value: fmt(overview.totalViews), icon: Eye, color: 'text-blue-500', bg: 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20' },
                            { label: 'Espectadores Únicos', value: fmt(overview.uniqueViewers), icon: Users, color: 'text-purple-500', bg: 'from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20' },
                            { label: 'Esta Semana', value: fmt(overview.thisWeekViews), icon: TrendingUp, color: 'text-emerald-500', bg: 'from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20' },
                            {
                                label: 'Tendencia Semanal',
                                value: `${overview.weekTrend >= 0 ? '+' : ''}${overview.weekTrend.toFixed(0)}%`,
                                icon: TrendingUp,
                                color: overview.weekTrend >= 0 ? 'text-emerald-500' : 'text-red-500',
                                bg: overview.weekTrend >= 0 ? 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20' : 'from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20'
                            },
                        ].map((kpi, idx) => (
                            <motion.div
                                key={kpi.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.08 }}
                                className={`bg-gradient-to-br ${kpi.bg} border rounded-xl p-4 hover:shadow-md transition-shadow`}
                            >
                                <kpi.icon className={`h-5 w-5 ${kpi.color} mb-2`} />
                                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                                <p className="text-xl font-bold">{kpi.value}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* 30-Day Views Chart */}
                    {overview.dailyViews.length > 0 && (
                        <AnimatedCard className="p-5" index={0}>
                            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                <Eye className="h-4 w-4 text-blue-500" />
                                Vistas Diarias (30 días)
                            </h3>
                            <div className="flex items-end gap-1 h-36">
                                {overview.dailyViews.map((d, idx) => {
                                    const max = Math.max(...overview.dailyViews.map(x => x.views), 1);
                                    const pct = (d.views / max) * 100;
                                    const day = d.date.split('-')[2];
                                    return (
                                        <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${Math.max(pct, 3)}%` }}
                                                transition={{ delay: idx * 0.02, duration: 0.4 }}
                                                className="w-full bg-gradient-to-t from-blue-500 to-indigo-400 rounded-t group-hover:from-blue-400 group-hover:to-indigo-300 transition-colors cursor-pointer min-h-[2px]"
                                                title={`${d.date}: ${d.views} vistas`}
                                            />
                                            {idx % 5 === 0 && (
                                                <span className="text-[9px] text-muted-foreground">{day}</span>
                                            )}
                                            {/* Hover Tooltip */}
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                {d.views} vistas
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </AnimatedCard>
                    )}

                    {/* Top 10 Rankings */}
                    {rankings.length > 0 && (
                        <AnimatedCard className="p-0 overflow-hidden" index={1}>
                            <div className="p-5 border-b">
                                <h3 className="text-sm font-semibold flex items-center gap-2">
                                    <Trophy className="h-4 w-4 text-amber-500" />
                                    Top Listados por Vistas
                                </h3>
                            </div>
                            <div className="divide-y">
                                {rankings.map((listing, idx) => (
                                    <motion.div
                                        key={listing.listingId}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors"
                                    >
                                        {/* Rank */}
                                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${idx === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                            idx === 1 ? 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400' :
                                                idx === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                    'bg-muted text-muted-foreground'
                                            }`}>
                                            {idx + 1}
                                        </span>

                                        {/* Image */}
                                        <div className="h-10 w-14 rounded-lg overflow-hidden bg-muted shrink-0">
                                            {listing.image ? (
                                                <img src={listing.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Building2 className="h-4 w-4 text-muted-foreground/30" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{listing.title || 'Sin título'}</p>
                                            <p className="text-xs text-muted-foreground">{fmtPrice(listing.price)}</p>
                                        </div>

                                        {/* Views */}
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-bold text-blue-600">{fmt(listing.views)}</p>
                                            <p className="text-[10px] text-muted-foreground">vistas</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </AnimatedCard>
                    )}

                    {/* Top Listing Highlight */}
                    {overview.topListing && (
                        <AnimatedCard className="p-5" index={2}>
                            <div className="flex items-center gap-2 mb-2">
                                <Trophy className="h-4 w-4 text-amber-500" />
                                <h3 className="text-sm font-semibold">Tu Listado Más Popular</h3>
                            </div>
                            <div className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                                <div>
                                    <p className="font-bold">{overview.topListing.title || 'Sin título'}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">La propiedad con más interés</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-amber-600">{fmt(overview.topListing.views)}</p>
                                    <p className="text-[10px] text-muted-foreground">vistas totales</p>
                                </div>
                            </div>
                        </AnimatedCard>
                    )}
                </>
            )}
        </PageTransition>
    );
}
