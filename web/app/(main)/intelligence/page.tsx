'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useSession } from 'next-auth/react';
import { authFetch } from '@/lib/api';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated';
import { SourceCard } from '@/components/intelligence/SourceCard';
import { ObservedListingCard } from '@/components/intelligence/ObservedListingCard';

export default function IntelligenceDashboard() {
    const { t } = useLanguage();
    const { data: session } = useSession();
    const [listings, setListings] = useState<any[]>([]);
    const [sources, setSources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            const token = (session as any)?.accessToken;

            // Parallel fetch
            const [listingsData, sourcesData] = await Promise.all([
                authFetch('/api/intelligence/observed', {}, token),
                authFetch('/api/intelligence/sources', {}, token)
            ]);

            if (Array.isArray(listingsData)) setListings(listingsData);
            if (Array.isArray(sourcesData)) setSources(sourcesData);

        } catch (error) {
            console.error('Failed to fetch intelligence data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [session]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    // Seed handler for demo purposes
    const handleSeed = async () => {
        setRefreshing(true);
        try {
            await authFetch('/api/intelligence/debug/seed?sourceId=', {}, (session as any)?.accessToken);
            setTimeout(fetchData, 1000); // Wait a bit for DB
        } catch (e) {
            console.error('Seed failed', e);
            setRefreshing(false);
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Inteligencia de Mercado</h2>
                    <p className="text-muted-foreground mt-1">
                        Propiedades detectadas automáticamente por crawlers y agentes de vigilancia.
                    </p>
                </div>
                <div className="flex gap-2">
                    <AnimatedButton
                        variant="secondary"
                        onClick={handleSeed}
                        disabled={refreshing}
                        className="text-sm"
                    >
                        + Simular Detección (Seed)
                    </AnimatedButton>
                    <AnimatedButton
                        variant="primary"
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-2 text-sm"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Actualizar
                    </AnimatedButton>
                </div>
            </div>

            {/* Sources Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Fuentes de Datos Activas</h3>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        {loading ? '...' : sources.length}
                    </span>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : sources.length === 0 ? (
                    <div className="p-6 border border-dashed border-slate-200 rounded-xl text-center text-slate-500 text-sm">
                        No hay fuentes configuradas.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {sources.map(source => (
                            <SourceCard key={source.id} source={source} />
                        ))}
                    </div>
                )}
            </section>

            <hr className="border-slate-100" />

            {/* Listings Section */}
            <section>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h3 className="text-lg font-semibold text-slate-800">Oportunidades Detectadas</h3>

                    {/* Filters / Search Bar */}
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar por dirección..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 text-sm hover:bg-slate-50">
                            <Filter className="w-4 h-4" /> Filtros
                        </button>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : listings.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-500">No se han detectado propiedades nuevas.</p>
                        <button onClick={handleSeed} className="text-blue-600 hover:underline mt-2 text-sm font-medium">
                            Generar datos de prueba
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map(item => (
                            <ObservedListingCard key={item.id} listing={item} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
