'use client';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useSession } from 'next-auth/react';
import { authFetch } from '@/lib/api';
import { Search, Filter, RefreshCw, Radio, CheckCircle2, XCircle } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated';
import { SourceCard } from '@/components/intelligence/SourceCard';
import { ObservedListingCard } from '@/components/intelligence/ObservedListingCard';

const API_URL = '';

export default function IntelligenceDashboard() {
    const { t } = useLanguage();
    const { data: session } = useSession();
    const [listings, setListings] = useState<any[]>([]);
    const [sources, setSources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Crawl state
    const [crawlStatus, setCrawlStatus] = useState<'idle' | 'crawling' | 'done' | 'error' | 'not_auth'>('idle');
    const [crawlResult, setCrawlResult] = useState<string>('');
    const crawlTriggered = useRef(false);

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

    // Auto-trigger MercadoLibre crawl on page load
    const triggerCrawl = async () => {
        if (crawlTriggered.current) return;
        crawlTriggered.current = true;

        try {
            // Check if ML is authenticated first
            const statusRes = await fetch(`${API_URL}/api/auth/mercadolibre/status`);
            const statusData = await statusRes.json();

            if (!statusData.authenticated) {
                setCrawlStatus('not_auth');
                setCrawlResult('Mercado Libre no autenticado');
                return;
            }

            setCrawlStatus('crawling');

            const crawlRes = await fetch(`${API_URL}/api/auth/mercadolibre/crawl`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const crawlData = await crawlRes.json();

            if (crawlData.success) {
                setCrawlStatus('done');
                setCrawlResult(`${crawlData.count} propiedades procesadas`);
                // Refresh data to show new listings
                fetchData();
            } else if (crawlRes.status === 401) {
                setCrawlStatus('not_auth');
                setCrawlResult('Token expirado — necesita re-autenticación');
            } else {
                // Check if it's a token/auth-related failure
                const detail = crawlData.detail || crawlData.error || '';
                if (detail.toLowerCase().includes('token') || detail.toLowerCase().includes('auth') || detail.toLowerCase().includes('refresh')) {
                    setCrawlStatus('not_auth');
                    setCrawlResult('Token expirado — necesita re-autenticación');
                } else {
                    setCrawlStatus('error');
                    setCrawlResult(crawlData.detail || crawlData.error || 'Error en crawl');
                }
            }
        } catch (e: any) {
            setCrawlStatus('error');
            setCrawlResult(e.message || 'Error de conexión');
        }
    };

    useEffect(() => {
        fetchData();
        triggerCrawl();
    }, [session]);

    const handleRefresh = () => {
        setRefreshing(true);
        crawlTriggered.current = false;
        triggerCrawl();
        fetchData();
    };

    // Seed handler for demo purposes
    const handleSeed = async () => {
        setRefreshing(true);
        try {
            await authFetch('/api/intelligence/debug/seed', {}, (session as any)?.accessToken);
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
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Inteligencia de Mercado</h2>
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
                        disabled={refreshing || crawlStatus === 'crawling'}
                        className="flex items-center gap-2 text-sm"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing || crawlStatus === 'crawling' ? 'animate-spin' : ''}`} />
                        Actualizar
                    </AnimatedButton>
                </div>
            </div>

            {/* Crawl Status Banner */}
            {crawlStatus !== 'idle' && (
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${crawlStatus === 'crawling' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                    crawlStatus === 'done' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        crawlStatus === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                            'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                    {crawlStatus === 'crawling' && (
                        <>
                            <Radio className="w-4 h-4 animate-pulse" />
                            <span>Rastreando Mercado Libre en tiempo real...</span>
                            <div className="ml-auto flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </>
                    )}
                    {crawlStatus === 'done' && (
                        <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Crawl completado — {crawlResult}</span>
                        </>
                    )}
                    {crawlStatus === 'error' && (
                        <>
                            <XCircle className="w-4 h-4" />
                            <span>Error: {crawlResult}</span>
                        </>
                    )}
                    {crawlStatus === 'not_auth' && (
                        <>
                            <XCircle className="w-4 h-4" />
                            <span>{crawlResult} — <a href="/api/auth/mercadolibre" className="underline font-semibold">Conectar</a></span>
                        </>
                    )}
                </div>
            )}

            {/* Sources Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-lg font-semibold">Fuentes de Datos Activas</h3>
                    <span className="bg-blue-500/10 text-blue-500 text-xs px-2 py-0.5 rounded-full font-medium">
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
                    <h3 className="text-lg font-semibold">Oportunidades Detectadas</h3>

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
