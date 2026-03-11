'use client';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useSession } from 'next-auth/react';
// authFetch removed — sources are now auto-generated from scraped data
import { RefreshCw, Search, CheckCircle2, XCircle, Radio, Filter, ChevronLeft, ChevronRight, Download, Heart } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated';
import { SourceCard } from '@/components/intelligence/SourceCard';
import { ObservedListingCard } from '@/components/intelligence/ObservedListingCard';

const API_URL = '';
const DEFAULT_PER_PAGE = 50;

export default function IntelligenceDashboard() {
    const { t } = useLanguage();
    const { data: session } = useSession();
    const [listings, setListings] = useState<any[]>([]);
    const [sources, setSources] = useState<{ name: string; count: number; enabled: boolean }[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Loading progress tracking
    const [loadProgress, setLoadProgress] = useState<{
        completed: number;
        total: number;
        sources: Record<string, 'pending' | 'loading' | 'done' | 'error'>;
    }>({ completed: 0, total: 5, sources: {} });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalListings, setTotalListings] = useState(0);

    // Filters State
    const [searchQuery, setSearchQuery] = useState('');
    const [offset, setOffset] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [city, setCity] = useState('All');
    const [listingType, setListingType] = useState('ALL');
    const [propertyType, setPropertyType] = useState('ALL');
    const [bedrooms, setBedrooms] = useState<number | 'Any'>('Any');
    const [bathrooms, setBathrooms] = useState<number | 'Any'>('Any');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [source, setSource] = useState('All');
    const [disabledSources, setDisabledSources] = useState<Set<string>>(new Set());
    const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);

    // ML Crawl state
    const [crawlStatus, setCrawlStatus] = useState<'idle' | 'crawling' | 'done' | 'error' | 'not_auth'>('idle');
    const [crawlResult, setCrawlResult] = useState<string>('');
    const crawlTriggered = useRef(false);

    // Facebook Crawl state
    const [fbStatus, setFbStatus] = useState<'idle' | 'crawling' | 'done' | 'error'>('idle');
    const [fbResult, setFbResult] = useState<string>('');
    const fbTriggered = useRef(false);

    const ITEMS_PER_PAGE = perPage;

    // Helper: update source cards from current listings
    const updateSourceCards = (allListings: any[]) => {
        const sourceNames = ['Facebook Marketplace', 'Mercado Libre', 'Inmuebles24', 'Lamudi', 'Vivanuncios'];
        const newSources = sourceNames
            .map(name => {
                const count = allListings.filter((l: any) => (l.source || '').includes(name.split(' ')[0])).length;
                return { name, count, enabled: !disabledSources.has(name) };
            })
            .filter(s => s.count > 0);
        setSources(newSources);
        setTotalListings(allListings.length);
    };

    const fetchData = async (page = currentPage) => {
        try {
            const token = (session as any)?.accessToken;

            // Reset progress
            setLoadProgress({
                completed: 0,
                total: 5,
                sources: {
                    'Facebook': 'loading',
                    'Mercado Libre': 'pending',
                    'Inmuebles24': 'pending',
                    'Lamudi': 'pending',
                    'Vivanuncios': 'pending',
                },
            });

            // Build query params from all active filters (source filter is client-side only)
            const params = new URLSearchParams();
            if (city !== 'All') params.set('city', city);
            if (listingType !== 'ALL') params.set('listingType', listingType.toUpperCase());
            if (propertyType !== 'ALL') params.set('propertyType', propertyType.toLowerCase());
            if (minPrice) params.set('minPrice', minPrice);
            if (maxPrice) params.set('maxPrice', maxPrice);
            params.set('page', page.toString());
            params.set('limit', ITEMS_PER_PAGE.toString());

            // Phase 1: Get FB data from Vercel API
            const liveData = await fetch(`${API_URL}/api/listings/live?${params.toString()}`)
                .then(r => r.ok ? r.json() : { listings: [] })
                .catch(() => ({ listings: [] }));

            // Ensure FB listings have source set
            const serverListings = (liveData?.listings || []).map((l: any) => ({
                ...l,
                source: l.source || 'Facebook Marketplace',
            }));

            setLoadProgress(prev => ({
                ...prev,
                completed: 1,
                sources: { ...prev.sources, 'Facebook': 'done' },
            }));

            // Show FB results immediately — stop the loading spinner
            if (serverListings.length > 0) {
                setListings(serverListings);
                setTotalListings(serverListings.length);
                setCurrentPage(page);
                updateSourceCards(serverListings);
            }
            setLoading(false);

            // Phase 2: Fetch proxy scrapers in parallel, appending results as each finishes
            const proxyUrl = liveData?.proxyUrl || 'https://bluejax-ml-proxy-2026.loca.lt';
            const proxySecret = liveData?.proxySecret || 'bluejax-ml-proxy-2026';

            // Build scraper URLs
            const op = listingType.toUpperCase() === 'RENT' ? 'renta' : 'venta';
            const citySlug = (city && city !== 'All' ? city : 'chihuahua').toLowerCase().replace(/\s+/g, '-');
            let mlPath = `inmuebles/${op}`;
            const typeMap: Record<string, string> = { house: `casas/${op}`, apartment: `departamentos/${op}`, land: `terrenos/${op}`, commercial: `locales-comerciales/${op}` };
            if (propertyType !== 'ALL' && typeMap[propertyType.toLowerCase()]) mlPath = typeMap[propertyType.toLowerCase()];
            let mlUrl = `https://inmuebles.mercadolibre.com.mx/${mlPath}/chihuahua/${citySlug}/`;
            if (page > 1) mlUrl += `_Desde_${(page - 1) * ITEMS_PER_PAGE + 1}`;

            const i24TypeMap: Record<string, string> = { HOUSE: 'casas', APARTMENT: 'departamentos', LAND: 'terrenos', COMMERCIAL: 'locales-comerciales' };
            const i24TypeSlug = i24TypeMap[propertyType?.toUpperCase()] || 'inmuebles';
            const i24Url = `https://www.inmuebles24.com/${i24TypeSlug}-en-${op}-en-${citySlug}.html`;

            const lamudiOp = listingType.toUpperCase() === 'RENT' ? 'for-rent' : 'for-sale';
            const lamudiTypeMap: Record<string, string> = { HOUSE: 'house', APARTMENT: 'apartment', LAND: 'land', COMMERCIAL: 'commercial' };
            const lamudiTypeStr = propertyType !== 'ALL' ? lamudiTypeMap[propertyType.toUpperCase()] : '';
            const lamudiTypePath = lamudiTypeStr ? `${lamudiTypeStr}/` : '';
            const lamudiUrl = `https://www.lamudi.com.mx/chihuahua/${citySlug}-1/${lamudiTypePath}${lamudiOp}/`;

            const vivaTypeMap: Record<string, string> = { HOUSE: 'casas', APARTMENT: 'departamentos', LAND: 'terrenos', COMMERCIAL: 'locales-comerciales' };
            const vivaTypeSlug = vivaTypeMap[propertyType?.toUpperCase()] || 'inmuebles';
            const vivaUrl = `https://www.vivanuncios.com.mx/${vivaTypeSlug}-en-${op}-en-${citySlug}.html`;

            const fetchWithRetry = async (url: string, options: any, retries = 3): Promise<any> => {
                const cacheKey = `mls_cache_${url.split('portal=')[1]?.split('&')[0] || 'unknown'}`;
                for (let i = 0; i < retries; i++) {
                    try {
                        const res = await fetch(url, options);
                        if (res.ok) {
                            const data = await res.json();
                            try { localStorage.setItem(cacheKey, JSON.stringify({ data, ts: Date.now() })); } catch { }
                            return data;
                        }
                    } catch (e) {
                        console.log(`[PROXY] Fetch fail (${i + 1}/${retries}): ${url}`);
                    }
                    if (i < retries - 1) await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
                }
                try {
                    const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
                    if (cached && Date.now() - cached.ts < 30 * 60 * 1000) return cached.data;
                } catch { }
                return { listings: [] };
            };

            // Mark proxy sources as loading
            setLoadProgress(prev => ({
                ...prev,
                sources: { ...prev.sources, 'Mercado Libre': 'loading', 'Inmuebles24': 'loading', 'Lamudi': 'loading', 'Vivanuncios': 'loading' },
            }));

            // Normalizer for each source
            const normalize = (items: any[], sourceName: string) =>
                items.map((l: any) => ({
                    ...l,
                    id: l.id || `${sourceName.toLowerCase().replace(/\s/g, '-')}-${Math.random().toString(36).slice(2, 8)}`,
                    source: l.source || sourceName,
                    sourceUrl: l.url || l.sourceUrl || '',
                    state: 'Chihuahua',
                    city: l.city || citySlug,
                    address: l.address || l.location || '',
                    status: l.status || (l.listingType === 'RENT' ? 'DETECTED_RENT' : 'DETECTED_SALE'),
                    imageUrl: l.imageUrl || l.images?.[0] || '',
                    images: l.images || (l.imageUrl ? [l.imageUrl] : []),
                }));

            // Helper: fetch a source and immediately append results
            const fetchAndAppend = async (name: string, portal: string, url: string, timeout: number) => {
                try {
                    const data = await fetchWithRetry(
                        `${proxyUrl}/scrape?portal=${portal}&url=${encodeURIComponent(url)}`,
                        { headers: { 'x-proxy-secret': proxySecret, 'Bypass-Tunnel-Reminder': 'true' }, signal: AbortSignal.timeout(timeout) },
                    );
                    const items = normalize(data?.listings || [], name);
                    if (items.length > 0) {
                        setListings(prev => [...prev, ...items]);
                        // Update source cards with new totals
                        setListings(current => {
                            updateSourceCards(current);
                            return current;
                        });
                    }
                    setLoadProgress(prev => ({
                        ...prev,
                        completed: prev.completed + 1,
                        sources: { ...prev.sources, [name]: 'done' },
                    }));
                    console.log(`[Intelligence] ${name}: ${items.length} listings`);
                } catch (e) {
                    setLoadProgress(prev => ({
                        ...prev,
                        completed: prev.completed + 1,
                        sources: { ...prev.sources, [name]: 'error' },
                    }));
                    console.log(`[Intelligence] ${name}: failed`, e);
                }
            };

            // Fire all scrapers in parallel — each appends results as it finishes
            await Promise.all([
                fetchAndAppend('Mercado Libre', 'ml', mlUrl, 25000),
                fetchAndAppend('Inmuebles24', 'inmuebles24', i24Url, 50000),
                fetchAndAppend('Lamudi', 'lamudi', lamudiUrl, 50000),
                fetchAndAppend('Vivanuncios', 'vivanuncios', vivaUrl, 50000),
            ]);

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
            const statusRes = await fetch(`${API_URL}/api/integrations/mercadolibre/status`);
            if (!statusRes.ok) {
                // Status endpoint failed — skip auth check, ML listings still come via ZenRows in /api/listings/live
                setCrawlStatus('done');
                setCrawlResult('Usando API pública');
                return;
            }
            const statusData = await statusRes.json();

            if (!statusData.authenticated) {
                setCrawlStatus('not_auth');
                setCrawlResult('Mercado Libre no autenticado');
                return;
            }

            // Show public API mode info if not OAuth-connected
            if (!statusData.oauthConnected) {
                setCrawlResult('API pública (conectar OAuth para más velocidad)');
            }

            setCrawlStatus('crawling');

            const crawlRes = await fetch(`${API_URL}/api/integrations/mercadolibre/crawl`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            let crawlData: any = {};
            try {
                crawlData = await crawlRes.json();
            } catch {
                crawlData = { error: 'Invalid response' };
            }

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

    // Facebook status is now set automatically in fetchData
    const triggerFbCrawl = async () => {
        // FB data is already included in the live listings response
        // This function is kept for compatibility but the status is set in fetchData
        if (fbTriggered.current) return;
        fbTriggered.current = true;
        // Status already set by fetchData
    };

    // Page change handler
    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setLoading(true);
        setCurrentPage(page);
        fetchData(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        fetchData(1);
        triggerFbCrawl();
        triggerCrawl(); // Also trigger ML crawl
    }, [session]);

    // Re-fetch when filters change
    useEffect(() => {
        if (!loading) {
            setLoading(true);
            setCurrentPage(1);
            fetchData(1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [city, propertyType, minPrice, maxPrice, listingType, source, perPage]);

    const handleRefresh = () => {
        setRefreshing(true);
        setSearchQuery('');
        setOffset(0);
        setCrawlStatus('idle');
        setCrawlResult('');
        setCurrentPage(1);
        fbTriggered.current = false;
        triggerFbCrawl();
        fetchData(1);
    };



    // Client-side secondary filter (API already handles city/propertyType/price)
    const filteredListings = listings.filter((item) => {
        // Filter by source dropdown
        if (source && source !== 'All') {
            const itemSource = (item.source || '').toLowerCase();
            if (!itemSource.includes(source.toLowerCase())) return false;
        }
        // Filter by disabled sources
        if (disabledSources.size > 0) {
            const itemSource = (item.source || '').toLowerCase();
            const disabledArr = Array.from(disabledSources);
            for (const disabled of disabledArr) {
                if (itemSource.includes(disabled.toLowerCase())) return false;
            }
        }
        if (listingType !== 'ALL') {
            const status = (item.status || '').toUpperCase();
            if (status !== listingType && status !== `DETECTED_${listingType}`) return false;
        }
        if (bedrooms !== 'Any' && (item.bedrooms || 0) < Number(bedrooms)) return false;
        if (bathrooms !== 'Any' && (item.bathrooms || 0) < Number(bathrooms)) return false;
        return true;
    });

    // Toggle source handler (now uses source name directly)
    const handleToggleSource = (sourceName: string) => {
        setSources(prev => prev.map(s => s.name === sourceName ? { ...s, enabled: !s.enabled } : s));
        setDisabledSources(prev => {
            const next = new Set(prev);
            if (next.has(sourceName)) {
                next.delete(sourceName);
            } else {
                next.add(sourceName);
            }
            return next;
        });
    };

    // Slice to perPage for display
    const paginatedListings = filteredListings.slice(0, perPage);
    const filteredTotalPages = Math.max(totalPages, Math.ceil(filteredListings.length / ITEMS_PER_PAGE) || 1);

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
                <div className="flex items-center gap-2">

                    <AnimatedButton
                        variant="secondary"
                        onClick={() => {
                            const rows = filteredListings.map((l: any) => ({
                                Título: (l.title || '').replace(/,/g, ' '),
                                Precio: l.price || 0,
                                Moneda: l.currency || 'MXN',
                                Fuente: l.source || '',
                                Ciudad: l.city || '',
                                Dirección: (l.address || '').replace(/,/g, ' '),
                                URL: l.sourceUrl || '',
                                Tipo: l.propertyType || '',
                                Estado: l.status || '',
                            }));
                            if (rows.length === 0) return;
                            const headers = Object.keys(rows[0]);
                            const csv = [headers.join(','), ...rows.map(r => headers.map(h => `"${(r as any)[h]}"`).join(','))].join('\n');
                            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `propiedades_${new Date().toISOString().slice(0, 10)}.csv`;
                            a.click();
                            URL.revokeObjectURL(url);
                        }}
                        className="flex items-center gap-2 text-sm"
                        disabled={filteredListings.length === 0}
                    >
                        <Download className="w-4 h-4" />
                        Exportar CSV
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

            {/* Loading Progress Bar */}
            {loading && Object.keys(loadProgress.sources).length > 0 && (
                <div className="bg-card border border-blue-500/10 rounded-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">
                            Recopilando datos de {loadProgress.total} fuentes...
                        </p>
                        <span className="text-xs text-muted-foreground font-mono">
                            {loadProgress.completed}/{loadProgress.total}
                        </span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 ease-out"
                            style={{ width: `${(loadProgress.completed / loadProgress.total) * 100}%` }}
                        />
                    </div>
                    {/* Source status chips */}
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(loadProgress.sources).map(([name, status]) => (
                            <span
                                key={name}
                                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                                    status === 'done' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                    status === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                    status === 'loading' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                    'bg-muted/50 text-muted-foreground border border-transparent'
                                }`}
                            >
                                {status === 'done' && '✓'}
                                {status === 'error' && '✗'}
                                {status === 'loading' && (
                                    <span className="inline-block w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                )}
                                {status === 'pending' && '○'}
                                {name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
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
                            <XCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{crawlResult} — <a href="/api/integrations/mercadolibre/auth" className="underline font-semibold">Conectar OAuth</a></span>
                        </>
                    )}
                </div>
            )}

            {/* Facebook Crawl Status Banner */}
            {fbStatus !== 'idle' && (
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${fbStatus === 'crawling' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                    fbStatus === 'done' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                        'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                    {fbStatus === 'crawling' && (
                        <>
                            <Radio className="w-4 h-4 animate-pulse flex-shrink-0" />
                            <span>Rastreando Facebook Marketplace...</span>
                            <div className="ml-auto flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </>
                    )}
                    {fbStatus === 'done' && (
                        <>
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                            <span>Facebook — {fbResult}</span>
                        </>
                    )}
                    {fbStatus === 'error' && (
                        <>
                            <XCircle className="w-4 h-4 flex-shrink-0" />
                            <span>Facebook: {fbResult}</span>
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
                        {sources.map(src => (
                            <SourceCard key={src.name} source={src} onToggle={handleToggleSource} />
                        ))}
                    </div>
                )}
            </section>

            <hr className="border-slate-100" />

            {/* Listings Section */}
            <section>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <h3 className="text-lg font-semibold">Oportunidades Detectadas</h3>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${showFilters ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'border-blue-500/20 text-muted-foreground hover:bg-muted/50'}`}
                    >
                        <Filter className="w-4 h-4" /> Filtros
                    </button>
                </div>

                {/* Advanced Filters Panel */}
                {showFilters && (
                    <div className="bg-card border border-blue-500/10 rounded-xl p-4 mb-6 shadow-sm animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Fuente</label>
                                <select value={source} onChange={(e) => setSource(e.target.value)} className="w-full h-8 text-xs border border-blue-500/20 rounded-md px-2 bg-muted/50 text-foreground">
                                    <option value="All">Todas</option>
                                    <option value="Facebook">Facebook</option>
                                    <option value="Mercado Libre">Mercado Libre</option>
                                    <option value="Inmuebles24">Inmuebles24</option>
                                    <option value="Lamudi">Lamudi</option>
                                    <option value="Vivanuncios">Vivanuncios</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Ciudad</label>
                                <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full h-8 text-xs border border-blue-500/20 rounded-md px-2 bg-muted/50 text-foreground">
                                    <option value="All">Todas</option>
                                    <option value="Chihuahua">Chihuahua</option>
                                    <option value="Juárez">Juárez</option>
                                    <option value="Delicias">Delicias</option>
                                    <option value="Cuauhtémoc">Cuauhtémoc</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Operación</label>
                                <select value={listingType} onChange={(e) => setListingType(e.target.value)} className="w-full h-8 text-xs border border-blue-500/20 rounded-md px-2 bg-muted/50 text-foreground">
                                    <option value="ALL">Todo</option>
                                    <option value="RENT">Renta</option>
                                    <option value="SALE">Venta</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Tipo</label>
                                <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="w-full h-8 text-xs border border-blue-500/20 rounded-md px-2 bg-muted/50 text-foreground">
                                    <option value="ALL">Todos</option>
                                    <option value="HOUSE">Casas</option>
                                    <option value="APARTMENT">Depas</option>
                                    <option value="LAND">Terrenos</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Recámaras</label>
                                <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value as any)} className="w-full h-8 text-xs border border-blue-500/20 rounded-md px-2 bg-muted/50 text-foreground">
                                    <option value="Any">Cualquiera</option>
                                    <option value={1}>1+</option>
                                    <option value={2}>2+</option>
                                    <option value={3}>3+</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Precio Min</label>
                                <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min $" className="w-full h-8 text-xs border border-blue-500/20 rounded-md px-2 bg-muted/50 text-foreground placeholder:text-muted-foreground" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Precio Max</label>
                                <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max $" className="w-full h-8 text-xs border border-blue-500/20 rounded-md px-2 bg-muted/50 text-foreground placeholder:text-muted-foreground" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-muted/50 animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : filteredListings.length === 0 ? (
                    <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed border-blue-500/10">
                        <p className="text-muted-foreground">No se encontraron propiedades con estos filtros {listings.length > 0 && `(Total sin filtros: ${listings.length})`}.</p>
                        <p className="text-sm text-muted-foreground mt-2">Los crawlers se actualizan automáticamente al cargar la página.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedListings.map((item, idx) => (
                                <ObservedListingCard key={`${item.id}-${idx}`} listing={item} />
                            ))}
                        </div>

                        {/* Pagination Bar */}
                        {filteredTotalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 pt-6 pb-2">
                                {/* Anterior */}
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage <= 1 || loading}
                                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-card border border-blue-500/20 hover:border-blue-500/40 text-blue-400 hover:text-blue-300"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Anterior
                                </button>

                                {/* Numbered Pages */}
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: filteredTotalPages }, (_, i) => i + 1)
                                        .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                                        .reduce((acc: (number | string)[], p, i, arr) => {
                                            if (i > 0 && typeof arr[i - 1] === 'number' && (p as number) - (arr[i - 1] as number) > 1) {
                                                acc.push('...');
                                            }
                                            acc.push(p);
                                            return acc;
                                        }, [])
                                        .map((p, i) =>
                                            p === '...' ? (
                                                <span key={`dots-${i}`} className="px-2 py-1 text-muted-foreground text-sm">…</span>
                                            ) : (
                                                <button
                                                    key={p}
                                                    onClick={() => goToPage(p as number)}
                                                    className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all ${currentPage === p
                                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                                                        : 'bg-card border border-blue-500/10 text-muted-foreground hover:text-foreground hover:border-blue-500/30'
                                                        }`}
                                                >
                                                    {p}
                                                </button>
                                            )
                                        )
                                    }
                                </div>

                                {/* Siguiente */}
                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage >= filteredTotalPages || loading}
                                    className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-card border border-blue-500/20 hover:border-blue-500/40 text-blue-400 hover:text-blue-300"
                                >
                                    Siguiente <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Page Info + Per-Page Selector */}
                        <div className="flex items-center justify-center gap-4 pt-1">
                            <span className="text-xs text-muted-foreground">
                                Página {currentPage} de {filteredTotalPages} • {filteredListings.length} propiedades
                                {fbStatus === 'done' && ` • ${fbResult}`}
                            </span>
                            <select
                                value={perPage}
                                onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                className="h-7 text-xs border border-blue-500/20 rounded-md px-2 bg-muted/50 text-foreground"
                                title="Propiedades por página"
                            >
                                <option value={25}>25 / página</option>
                                <option value={50}>50 / página</option>
                                <option value={100}>100 / página</option>
                            </select>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
