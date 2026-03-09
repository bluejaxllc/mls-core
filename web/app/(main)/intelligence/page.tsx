'use client';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useSession } from 'next-auth/react';
import { authFetch } from '@/lib/api';
import { RefreshCw, Search, CheckCircle2, XCircle, Radio, Filter, ChevronLeft, ChevronRight, Download, Heart } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated';
import { SourceCard } from '@/components/intelligence/SourceCard';
import { ObservedListingCard } from '@/components/intelligence/ObservedListingCard';

const API_URL = '';
const ITEMS_PER_PAGE = 12;

export default function IntelligenceDashboard() {
    const { t } = useLanguage();
    const { data: session } = useSession();
    const [listings, setListings] = useState<any[]>([]);
    const [sources, setSources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

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

    // ML Crawl state
    const [crawlStatus, setCrawlStatus] = useState<'idle' | 'crawling' | 'done' | 'error' | 'not_auth'>('idle');
    const [crawlResult, setCrawlResult] = useState<string>('');
    const crawlTriggered = useRef(false);

    // Facebook Crawl state
    const [fbStatus, setFbStatus] = useState<'idle' | 'crawling' | 'done' | 'error'>('idle');
    const [fbResult, setFbResult] = useState<string>('');
    const fbTriggered = useRef(false);

    const ITEMS_PER_PAGE = 12;

    const fetchData = async (page = currentPage) => {
        try {
            const token = (session as any)?.accessToken;

            // Build query params from all active filters
            const params = new URLSearchParams();
            if (city !== 'All') params.set('city', city);
            if (source !== 'All') params.set('source', source);
            if (listingType !== 'ALL') params.set('listingType', listingType.toUpperCase());
            if (propertyType !== 'ALL') params.set('propertyType', propertyType.toLowerCase());
            if (minPrice) params.set('minPrice', minPrice);
            if (maxPrice) params.set('maxPrice', maxPrice);
            params.set('page', page.toString());
            params.set('limit', ITEMS_PER_PAGE.toString());

            // Phase 1: Get FB data from Vercel API + sources (in parallel)
            const [liveData, sourcesData] = await Promise.all([
                fetch(`${API_URL}/api/listings/live?${params.toString()}`).then(r => r.ok ? r.json() : { listings: [] }).catch(() => ({ listings: [] })),
                authFetch('/api/intelligence/sources', {}, token).catch(() => []),
            ]);

            // Phase 2: Fetch ML + I24 directly from home proxy via browser
            // (Vercel functions CAN'T reach Cloudflare tunnels — must use client-side)
            const proxyUrl = liveData?.proxyUrl || 'https://bluejax-ml-proxy-2026.loca.lt';
            const proxySecret = liveData?.proxySecret || 'bluejax-ml-proxy-2026';

            // Build ML URL for the proxy
            const op = listingType.toUpperCase() === 'RENT' ? 'renta' : 'venta';
            const citySlug = (city && city !== 'All' ? city : 'chihuahua').toLowerCase().replace(/\s+/g, '-');
            let mlPath = `inmuebles/${op}`;
            const typeMap: Record<string, string> = { house: `casas/${op}`, apartment: `departamentos/${op}`, land: `terrenos/${op}`, commercial: `locales-comerciales/${op}` };
            if (propertyType !== 'ALL' && typeMap[propertyType.toLowerCase()]) mlPath = typeMap[propertyType.toLowerCase()];
            let mlUrl = `https://inmuebles.mercadolibre.com.mx/${mlPath}/chihuahua/${citySlug}/`;
            if (page > 1) mlUrl += `_Desde_${(page - 1) * ITEMS_PER_PAGE + 1}`;

            // Build I24 URL
            const i24TypeMap: Record<string, string> = { HOUSE: 'casas', APARTMENT: 'departamentos', LAND: 'terrenos', COMMERCIAL: 'locales-comerciales' };
            const i24TypeSlug = i24TypeMap[propertyType?.toUpperCase()] || 'inmuebles';
            const i24Url = `https://www.inmuebles24.com/${i24TypeSlug}-en-${op}-en-${citySlug}.html`;

            // Build Lamudi URL
            const lamudiOp = listingType.toUpperCase() === 'RENT' ? 'for-rent' : 'for-sale';
            const lamudiTypeMap: Record<string, string> = { HOUSE: 'house', APARTMENT: 'apartment', LAND: 'land', COMMERCIAL: 'commercial' };
            const lamudiTypeStr = propertyType !== 'ALL' ? lamudiTypeMap[propertyType.toUpperCase()] : '';
            const lamudiTypePath = lamudiTypeStr ? `${lamudiTypeStr}/` : '';
            const lamudiUrl = `https://www.lamudi.com.mx/chihuahua/${citySlug}-1/${lamudiTypePath}${lamudiOp}/`;

            // Build Vivanuncios URL
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
                            // Cache successful results
                            try {
                                localStorage.setItem(cacheKey, JSON.stringify({ data, ts: Date.now() }));
                            } catch { }
                            return data;
                        }
                    } catch (e) {
                        console.log(`[PROXY] Fetch fail (${i + 1}/${retries}): ${url}`);
                    }
                    if (i < retries - 1) await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
                }
                // Fallback to cached data (max 30 min old)
                try {
                    const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
                    if (cached && Date.now() - cached.ts < 30 * 60 * 1000) {
                        console.log(`[PROXY] Using cached data for ${cacheKey} (${Math.round((Date.now() - cached.ts) / 60000)}min old)`);
                        return cached.data;
                    }
                } catch { }
                return { listings: [] };
            };

            // Fetch ML, I24, Lamudi, Vivanuncios from proxy in parallel (direct browser-to-proxy)
            const [mlData, i24Data, lamudiData, vivaData] = await Promise.allSettled([
                fetchWithRetry(`${proxyUrl}/scrape?portal=ml&url=${encodeURIComponent(mlUrl)}`, {
                    headers: { 'x-proxy-secret': proxySecret, 'Bypass-Tunnel-Reminder': 'true' },
                    signal: AbortSignal.timeout(25000),
                }),
                fetchWithRetry(`${proxyUrl}/scrape?portal=inmuebles24&url=${encodeURIComponent(i24Url)}`, {
                    headers: { 'x-proxy-secret': proxySecret, 'Bypass-Tunnel-Reminder': 'true' },
                    signal: AbortSignal.timeout(50000),
                }),
                fetchWithRetry(`${proxyUrl}/scrape?portal=lamudi&url=${encodeURIComponent(lamudiUrl)}`, {
                    headers: { 'x-proxy-secret': proxySecret, 'Bypass-Tunnel-Reminder': 'true' },
                    signal: AbortSignal.timeout(50000),
                }),
                fetchWithRetry(`${proxyUrl}/scrape?portal=vivanuncios&url=${encodeURIComponent(vivaUrl)}`, {
                    headers: { 'x-proxy-secret': proxySecret, 'Bypass-Tunnel-Reminder': 'true' },
                    signal: AbortSignal.timeout(50000),
                }),
            ]);

            const mlListings = (mlData.status === 'fulfilled' ? mlData.value?.listings : []) || [];
            const i24Listings = (i24Data.status === 'fulfilled' ? i24Data.value?.listings : []) || [];
            const lamudiListings = (lamudiData.status === 'fulfilled' ? lamudiData.value?.listings : []) || [];
            const vivaListings = (vivaData.status === 'fulfilled' ? vivaData.value?.listings : []) || [];
            console.log(`[Intelligence] Sources loaded: ML=${mlListings.length}, I24=${i24Listings.length}, Lamudi=${lamudiListings.length}, Viva=${vivaListings.length}`);

            // Normalize ML listings
            const normalizedML = mlListings.map((l: any) => ({
                id: l.id, title: l.title, price: l.price, currency: l.currency || 'MXN',
                address: l.location || citySlug, city: citySlug, state: 'Chihuahua',
                status: listingType.toUpperCase() === 'RENT' ? 'DETECTED_RENT' : 'DETECTED_SALE',
                imageUrl: l.imageUrl || l.images?.[0] || '', images: l.images || [],
                source: 'Mercado Libre', sourceUrl: l.url || '',
                propertyType: propertyType !== 'ALL' ? propertyType.toUpperCase() : 'HOUSE',
                attributes: l.attributes || [], fetchedAt: new Date().toISOString(),
            }));

            // Normalize I24 listings
            const normalizedI24 = i24Listings.map((l: any) => ({
                ...l, source: l.source || 'Inmuebles24', state: 'Chihuahua', city: l.city || citySlug,
            }));

            // Normalize Lamudi listings
            const normalizedLamudi = lamudiListings.map((l: any) => ({
                ...l, source: l.source || 'Lamudi', state: 'Chihuahua', city: l.city || citySlug,
            }));

            // Normalize Vivanuncios listings
            const normalizedViva = vivaListings.map((l: any) => ({
                ...l, source: l.source || 'Vivanuncios', state: 'Chihuahua', city: l.city || citySlug,
            }));

            // Merge all sources
            const serverListings = liveData?.listings || [];
            let allListings = [...serverListings, ...normalizedML, ...normalizedI24, ...normalizedLamudi, ...normalizedViva];

            // Shuffle listings so all sources show up mixed on the first page
            allListings = allListings.sort(() => Math.random() - 0.5);

            if (allListings.length > 0) {
                setListings(allListings);
                const hasMore = normalizedML.length >= ITEMS_PER_PAGE || normalizedI24.length >= ITEMS_PER_PAGE || normalizedLamudi.length >= ITEMS_PER_PAGE || normalizedViva.length >= ITEMS_PER_PAGE;
                const pages = hasMore ? Math.max(liveData?.totalPages || 1, page + 3) : (liveData?.totalPages || Math.ceil(allListings.length / ITEMS_PER_PAGE) || 1);
                setTotalPages(pages);
                setTotalListings(allListings.length);
                setCurrentPage(page);


                const getLabel = () => {
                    let label = 'propiedades';
                    if (propertyType === 'HOUSE') label = 'casas';
                    if (propertyType === 'APARTMENT') label = 'departamentos';
                    if (propertyType === 'COMMERCIAL') label = 'propiedades comerciales';
                    if (propertyType === 'LAND') label = 'terrenos';

                    let opLabel = '';
                    if (listingType === 'SALE') opLabel = 'en venta';
                    if (listingType === 'RENT') opLabel = 'en renta';

                    return `${label} ${opLabel}`.trim();
                };

                const fbCount = allListings.filter((l: any) => l.source === 'Facebook Marketplace').length;
                if (fbCount > 0) {
                    setFbStatus('done');
                    setFbResult(`${fbCount} ${getLabel()} Facebook`);
                }

                const mlCount = allListings.filter((l: any) => l.source === 'Mercado Libre').length;
                if (mlCount > 0) {
                    setCrawlStatus('done');
                    setCrawlResult(`${mlCount} ${getLabel()} Mercado Libre`);
                }

                const i24Count = liveData.listings.filter((l: any) => l.source === 'Inmuebles24').length;
                if (i24Count > 0) {
                    console.log(`[Intelligence] Inmuebles24: ${i24Count} listings`);
                }
            }
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
    }, [city, propertyType, minPrice, maxPrice, listingType, source]);

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

    // Toggle source handler
    const handleToggleSource = (sourceId: string) => {
        setSources(prev => prev.map(s => s.id === sourceId ? { ...s, isEnabled: !s.isEnabled } : s));
        // Find the source name by its id and toggle in disabledSources
        const src = sources.find(s => s.id === sourceId);
        if (src) {
            setDisabledSources(prev => {
                const next = new Set(prev);
                if (src.isEnabled) {
                    next.add(src.name);
                } else {
                    next.delete(src.name);
                }
                return next;
            });
        }
    };

    // We no longer slice the list for paginated requests (since server handles it),
    // but we still apply client-side filtering on the returned chunk if any
    const paginatedListings = filteredListings;
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
                <div className="flex gap-2">
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
                            <SourceCard key={src.id} source={src} onToggle={handleToggleSource} />
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
                                placeholder="Buscar propiedades..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-blue-500/20 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm placeholder:text-muted-foreground"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={async (e) => {
                                    if (e.key === 'Enter') {
                                        const query = e.currentTarget.value.trim();
                                        setOffset(0);
                                        if (!query) return fetchData();

                                        setLoading(true);
                                        try {
                                            const token = (session as any)?.accessToken;
                                            const results = await authFetch(`/api/intelligence/search_live?q=${encodeURIComponent(query)}&offset=0`, {}, token);
                                            if (Array.isArray(results)) {
                                                setListings(results);
                                            } else {
                                                setListings([]);
                                            }
                                        } catch (err) {
                                            console.error('Failed live search:', err);
                                        } finally {
                                            setLoading(false);
                                        }
                                    }
                                }}
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors ${showFilters ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'border-blue-500/20 text-muted-foreground hover:bg-muted/50'}`}
                        >
                            <Filter className="w-4 h-4" /> Filtros
                        </button>
                    </div>
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
                                    <option value="Propiedades.com">Propiedades.com</option>
                                    <option value="Inmuebles24">Inmuebles24</option>
                                    <option value="Lamudi">Lamudi</option>
                                    <option value="Vivanuncios">Vivanuncios</option>
                                    <option value="Century21">Century 21</option>
                                    <option value="Remax">RE/MAX</option>
                                    <option value="Coldwell Banker">Coldwell Banker</option>
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

                        {/* Page Info */}
                        <div className="text-center text-xs text-muted-foreground pt-1">
                            Página {currentPage} de {filteredTotalPages} • {filteredListings.length} propiedades
                            {fbStatus === 'done' && ` • ${fbResult}`}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
