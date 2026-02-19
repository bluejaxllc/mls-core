'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, BarChart3, TrendingUp, Building2, MapPin, DollarSign, Activity, ChevronRight, Wrench, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { PageTransition, AnimatedCard } from '@/components/ui/animated';

interface MarketStats {
    totalListings: number;
    activeListings: number;
    avgPrice: number;
    medianPrice: number;
    minPrice: number;
    maxPrice: number;
    byPropertyType: Record<string, { count: number; avgPrice: number }>;
    byCity: Record<string, number>;
    monthlyTrend: { month: string; count: number }[];
}

export default function ToolsPage() {
    const [stats, setStats] = useState<MarketStats | null>(null);
    const [loading, setLoading] = useState(true);

    const API_URL = '';

    useEffect(() => {
        fetch(`${API_URL}/api/public/market-stats`)
            .then(r => r.json())
            .then(setStats)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const fmt = (n: number) => `$${Math.round(n).toLocaleString('es-MX')}`;

    const TYPE_COLORS: Record<string, string> = {
        casa: '#3B82F6', departamento: '#8B5CF6', terreno: '#10B981',
        comercial: '#F59E0B', oficina: '#EF4444', bodega: '#06B6D4',
    };

    return (
        <PageTransition className="space-y-6">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 p-6 md:p-8 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Wrench className="h-5 w-5" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Herramientas</h1>
                    </div>
                    <p className="text-white/80 text-sm md:text-base max-w-xl">Calculadoras, análisis de mercado y herramientas de productividad</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/tools/calculator">
                    <motion.div
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white cursor-pointer h-full shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-shadow"
                    >
                        <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm mb-3">
                            <Calculator className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-1">Calculadora Hipotecaria</h3>
                        <p className="text-sm opacity-80">Calcula pagos mensuales, tasas y tabla de amortización</p>
                        <div className="flex items-center gap-1 mt-4 text-sm font-medium bg-white/15 w-fit px-4 py-1.5 rounded-full">
                            Abrir <ChevronRight className="h-4 w-4" />
                        </div>
                    </motion.div>
                </Link>
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white opacity-75 shadow-lg shadow-purple-500/10"
                >
                    <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm mb-3">
                        <BarChart3 className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">Análisis Comparativo (CMA)</h3>
                    <p className="text-sm opacity-80">Comparar valores de propiedades similares en la zona</p>
                    <div className="flex items-center gap-1 mt-4 text-sm font-medium opacity-60">
                        Próximamente
                    </div>
                </motion.div>
            </div>

            {/* Market Stats */}
            <div>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Panorama del Mercado
                </h2>

                {loading ? (
                    <div className="py-12 text-center text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-500" />
                        Cargando estadísticas...
                    </div>
                ) : !stats ? (
                    <p className="text-muted-foreground text-sm">No hay datos disponibles</p>
                ) : (
                    <div className="space-y-4">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { label: 'Listados Activos', value: stats.activeListings.toString(), icon: Building2, color: 'text-blue-500', bg: 'from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20' },
                                { label: 'Precio Promedio', value: fmt(stats.avgPrice), icon: DollarSign, color: 'text-emerald-500', bg: 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20' },
                                { label: 'Precio Mediano', value: fmt(stats.medianPrice), icon: TrendingUp, color: 'text-purple-500', bg: 'from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20' },
                                { label: 'Total Listados', value: stats.totalListings.toString(), icon: BarChart3, color: 'text-orange-500', bg: 'from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20' },
                            ].map((card, idx) => (
                                <motion.div
                                    key={card.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.08 }}
                                    className={`relative bg-gradient-to-br ${card.bg} border rounded-xl p-4 overflow-hidden group hover:shadow-md transition-shadow`}
                                >
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-current opacity-[0.03] rounded-full -mr-4 -mt-4 group-hover:scale-125 transition-transform" />
                                    <card.icon className={`h-5 w-5 ${card.color} mb-2`} />
                                    <p className="text-xs text-muted-foreground">{card.label}</p>
                                    <p className="text-lg font-bold">{card.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Property Type Distribution */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnimatedCard className="p-5" index={0}>
                                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-blue-500" />
                                    Por Tipo de Propiedad
                                </h3>
                                <div className="space-y-2.5">
                                    {Object.entries(stats.byPropertyType)
                                        .sort(([, a], [, b]) => b.count - a.count)
                                        .map(([type, data]) => {
                                            const pct = (data.count / stats.activeListings) * 100;
                                            return (
                                                <div key={type}>
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="capitalize font-medium">{type}</span>
                                                        <span className="text-muted-foreground">{data.count} • {fmt(data.avgPrice)}</span>
                                                    </div>
                                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${pct}%` }}
                                                            transition={{ duration: 0.6 }}
                                                            className="h-full rounded-full"
                                                            style={{ backgroundColor: TYPE_COLORS[type.toLowerCase()] || '#6B7280' }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </AnimatedCard>

                            <AnimatedCard className="p-5" index={1}>
                                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-red-500" />
                                    Por Ciudad
                                </h3>
                                <div className="space-y-2.5">
                                    {Object.entries(stats.byCity)
                                        .sort(([, a], [, b]) => b - a)
                                        .slice(0, 8)
                                        .map(([city, count]) => {
                                            const pct = (count / stats.activeListings) * 100;
                                            return (
                                                <div key={city}>
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="font-medium">{city}</span>
                                                        <span className="text-muted-foreground">{count} listados</span>
                                                    </div>
                                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${pct}%` }}
                                                            transition={{ duration: 0.6 }}
                                                            className="h-full bg-gradient-to-r from-red-400 to-pink-500 rounded-full"
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </AnimatedCard>
                        </div>

                        {/* Monthly Trend */}
                        {stats.monthlyTrend.length > 0 && (
                            <AnimatedCard className="p-5" index={2}>
                                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                                    Tendencia Mensual (Nuevos Listados)
                                </h3>
                                <div className="flex items-end gap-2 h-32">
                                    {stats.monthlyTrend.map((m, idx) => {
                                        const max = Math.max(...stats.monthlyTrend.map(x => x.count));
                                        const pct = max > 0 ? (m.count / max) * 100 : 0;
                                        return (
                                            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                                                <span className="text-xs font-bold">{m.count}</span>
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${pct}%` }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-md min-h-[4px]"
                                                />
                                                <span className="text-[10px] text-muted-foreground">{m.month.split('-')[1]}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </AnimatedCard>
                        )}

                        {/* Price Range */}
                        <AnimatedCard className="p-5" index={3}>
                            <h3 className="text-sm font-semibold mb-3">Rango de Precios</h3>
                            <div className="flex items-center gap-4">
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground">Mínimo</p>
                                    <p className="font-bold text-emerald-600">{fmt(stats.minPrice)}</p>
                                </div>
                                <div className="flex-1 h-3 bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-500 rounded-full shadow-inner" />
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground">Máximo</p>
                                    <p className="font-bold text-red-600">{fmt(stats.maxPrice)}</p>
                                </div>
                            </div>
                        </AnimatedCard>
                    </div>
                )}
            </div>
        </PageTransition>
    );
}
