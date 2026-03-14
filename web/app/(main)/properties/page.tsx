'use client';
import { useLanguage } from '@/lib/i18n';
import { Search, Filter, ChevronLeft, ChevronRight, Bookmark, RefreshCw, List, Map as MapIcon, Columns, MapPin, Loader2, Building2 } from 'lucide-react';
import { FiltersModal } from '@/components/filters/FiltersModal';
import { useState, useEffect, useRef } from 'react';
import { PageTransition, AnimatedCard, AnimatedButton, AnimatedInput } from '@/components/ui/animated';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { GovernanceMenu } from '@/components/listings/GovernanceMenu';
import { Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PropertiesPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const { data: session }: any = useSession();
    const [showFilters, setShowFilters] = useState(false);
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // View mode (list, map, split)
    const [view, setView] = useState<'list' | 'map' | 'split'>('list');

    // Sync state
    const [syncing, setSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState('');

    // Pagination & Filters State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [city, setCity] = useState('Chihuahua');
    const [listingType, setListingType] = useState('ALL');
    const [propertyType, setPropertyType] = useState('ALL');
    const [bedrooms, setBedrooms] = useState<number | 'Any'>('Any');
    const [bathrooms, setBathrooms] = useState<number | 'Any'>('Any');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [total, setTotal] = useState(0);
    const [source, setSource] = useState('ALL');

    // Selected listing for map
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const API_URL = '';

    useEffect(() => {
        fetchListings();
    }, [page, limit, city, listingType, propertyType, bedrooms, bathrooms, minPrice, maxPrice, source]);

    const fetchListings = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (city !== 'All') params.set('city', city);
            if (listingType !== 'ALL') params.set('listingType', listingType);
            if (propertyType !== 'ALL') params.set('propertyType', propertyType);
            if (source !== 'ALL') params.set('source', source);
            if (searchQuery.trim()) params.set('q', searchQuery.trim());
            params.set('page', String(page));
            params.set('limit', String(limit));

            const res = await fetch(`${API_URL}/api/search?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to load properties');

            const result = await res.json();
            let data = result.data || [];

            if (bedrooms !== 'Any') data = data.filter((p: any) => (p.bedrooms || 0) >= bedrooms);
            if (bathrooms !== 'Any') data = data.filter((p: any) => (p.bathrooms || 0) >= bathrooms);
            if (minPrice) data = data.filter((p: any) => (p.price || 0) >= Number(minPrice));
            if (maxPrice) data = data.filter((p: any) => (p.price || 0) <= Number(maxPrice));

            setListings(data);
            setTotal(result.total || data.length);
        } catch (error) {
            console.error('Error loading properties:', error);
            setListings([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    // Sync: triggers the cron scrape endpoint
    const handleSync = async () => {
        setSyncing(true);
        setSyncResult('');
        try {
            const res = await fetch(`${API_URL}/api/cron/scrape?secret=bluejax-cron-2026`);
            if (res.ok) {
                const data = await res.json();
                setSyncResult(`âœ“ ${data.saved} nuevas, ${data.skipped} existentes`);
                toast.success(`SincronizaciÃ³n completa: ${data.saved} nuevas propiedades`);
                // Refresh listings from DB
                fetchListings();
            } else {
                setSyncResult('Error al sincronizar');
                toast.error('Error al sincronizar. Â¿EstÃ¡ el proxy corriendo?');
            }
        } catch (e: any) {
            setSyncResult('Sin conexiÃ³n al proxy');
            toast.error('No se pudo conectar al proxy de scraping');
        } finally {
            setSyncing(false);
        }
    };

    const saveSearch = async () => {
        if (!session?.accessToken) {
            toast.error('Inicia sesiÃ³n para guardar bÃºsquedas');
            return;
        }
        try {
            const criteria = JSON.stringify({ city, listingType, searchQuery, bedrooms, bathrooms, minPrice, maxPrice });
            const name = `${city !== 'All' ? city : 'Todas'} â€” ${listingType === 'RENT' ? 'Renta' : listingType === 'SALE' ? 'Venta' : 'Todo'}${searchQuery ? ` â€” "${searchQuery}"` : ''}`;

            const res = await fetch(`${API_URL}/api/protected/saved-searches`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, criteria })
            });
            if (res.ok) {
                toast.success('BÃºsqueda guardada correctamente');
            } else {
                toast.error('Error al guardar bÃºsqueda');
            }
        } catch (error) {
            toast.error('Error al guardar bÃºsqueda');
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchListings();
    };

    const selectedListing = listings.find(l => l.id === selectedId);
    const mapQuery = selectedListing?.address
        ? encodeURIComponent(selectedListing.address + ', Chihuahua, Mexico')
        : encodeURIComponent((city !== 'All' ? city : 'Chihuahua') + ', Chihuahua, Mexico');

    const parseImages = (s: any): string[] => {
        if (Array.isArray(s)) return s;
        try { return JSON.parse(s); } catch { return []; }
    };

    return (
        <PageTransition className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            Buscar Propiedad
                        </h2>
                        <p className="text-muted-foreground">
                            Explora {total > 0 ? `${total.toLocaleString()}` : ''} propiedades detectadas en el mercado
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Sync Button */}
                        <AnimatedButton
                            onClick={handleSync}
                            disabled={syncing}
                            variant="primary"
                            className="flex items-center gap-2 text-sm h-9 px-3"
                        >
                            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">{syncing ? 'Sincronizando...' : 'Sincronizar'}</span>
                        </AnimatedButton>

                        {/* View Toggle */}
                        <div className="flex bg-muted rounded-lg p-0.5 h-9">
                            {([
                                { v: 'list' as const, icon: List, label: 'Lista' },
                                { v: 'split' as const, icon: Columns, label: 'Split' },
                                { v: 'map' as const, icon: MapIcon, label: 'Mapa' },
                            ]).map(({ v, icon: Icon, label }) => (
                                <button
                                    key={v}
                                    onClick={() => setView(v)}
                                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${view === v ? 'bg-background text-foreground shadow' : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    title={label}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                    <span className="hidden md:inline">{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Sync result indicator */}
                {syncResult && (
                    <div className={`text-xs px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 w-fit ${syncResult.startsWith('âœ“') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-400'}`}>
                        {syncResult}
                    </div>
                )}
            </div>

            {/* Controls / Filters */}
            <div className="flex flex-col gap-4 bg-card p-4 rounded-lg border">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    {/* Primary Filters */}
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                        <select value={city} onChange={(e) => { setCity(e.target.value); setPage(1); }}
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-32 flex-shrink-0">
                            <option value="All">Todas</option>
                            <option value="Chihuahua">Chihuahua</option>
                            <option value="JuÃ¡rez">JuÃ¡rez</option>
                            <option value="Delicias">Delicias</option>
                            <option value="CuauhtÃ©moc">CuauhtÃ©moc</option>
                            <option value="Parral">Parral</option>
                        </select>

                        <select value={listingType} onChange={(e) => { setListingType(e.target.value); setPage(1); }}
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-32 flex-shrink-0">
                            <option value="ALL">Todos</option>
                            <option value="RENT">En Renta</option>
                            <option value="SALE">En Venta</option>
                        </select>

                        <select value={propertyType} onChange={(e) => { setPropertyType(e.target.value); setPage(1); }}
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-32 flex-shrink-0">
                            <option value="ALL">Todo Tipo</option>
                            <option value="HOUSE">Casas</option>
                            <option value="APARTMENT">Departamentos</option>
                            <option value="LAND">Terrenos</option>
                            <option value="COMMERCIAL">Comercial</option>
                        </select>

                        <select value={source} onChange={(e) => { setSource(e.target.value); setPage(1); }}
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-36 flex-shrink-0">
                            <option value="ALL">Todas Fuentes</option>
                            <option value="Lamudi">Lamudi</option>
                            <option value="Mercado Libre">Mercado Libre</option>
                            <option value="Inmuebles24">Inmuebles24</option>
                            <option value="Vivanuncios">Vivanuncios</option>
                            <option value="Facebook Marketplace">Facebook</option>
                        </select>

                        <AnimatedButton onClick={() => setShowFilters(!showFilters)} variant={showFilters ? "primary" : "secondary"} className="h-9 px-3 flex items-center gap-2 flex-shrink-0">
                            <Filter className="h-4 w-4" />
                            <span className="hidden sm:inline">{showFilters ? 'Menos' : 'MÃ¡s'}</span>
                        </AnimatedButton>

                        <AnimatedButton onClick={saveSearch} variant="secondary" className="h-9 px-3 flex items-center gap-2 flex-shrink-0" title="Guardar esta bÃºsqueda">
                            <Bookmark className="h-4 w-4" />
                            <span className="hidden sm:inline">Guardar</span>
                        </AnimatedButton>
                    </div>

                    <div className="flex-1 w-full">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                            <AnimatedInput
                                placeholder="Buscar por direcciÃ³n, colonia..."
                                className="w-full pl-9 h-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { setPage(1); fetchListings(); } }}
                            />
                        </div>
                    </div>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">RecÃ¡maras</label>
                            <div className="flex rounded-md shadow-sm">
                                {['Any', 1, 2, 3, 4].map((num) => (
                                    <button key={num} onClick={() => { setBedrooms(num as any); setPage(1); }}
                                        className={`flex-1 h-8 text-xs font-medium border first:rounded-l-md last:rounded-r-md -ml-px first:ml-0 ${bedrooms === num ? 'bg-primary text-primary-foreground border-primary z-10' : 'bg-background text-muted-foreground hover:bg-muted'}`}>
                                        {num === 'Any' ? 'Todas' : `${num}+`}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">BaÃ±os</label>
                            <div className="flex rounded-md shadow-sm">
                                {['Any', 1, 2, 3].map((num) => (
                                    <button key={num} onClick={() => { setBathrooms(num as any); setPage(1); }}
                                        className={`flex-1 h-8 text-xs font-medium border first:rounded-l-md last:rounded-r-md -ml-px first:ml-0 ${bathrooms === num ? 'bg-primary text-primary-foreground border-primary z-10' : 'bg-background text-muted-foreground hover:bg-muted'}`}>
                                        {num === 'Any' ? 'Todos' : `${num}+`}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Precio Min</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                                <input type="number" placeholder="Min" className="h-8 w-full rounded-md border border-input bg-background pl-6 pr-3 text-xs" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(1); }} />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Precio Max</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                                <input type="number" placeholder="Max" className="h-8 w-full rounded-md border border-input bg-background pl-6 pr-3 text-xs" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Area: List + Map based on view mode */}
            <div className={`flex gap-4 ${view === 'split' ? 'flex-col md:flex-row' : 'flex-col'}`} style={view !== 'list' ? { height: 'calc(100vh - 20rem)' } : undefined}>
                {/* Listings Grid/List */}
                {view !== 'map' && (
                    <div className={`${view === 'split' ? 'md:w-1/2 overflow-y-auto' : 'w-full'}`}>
                        <div className={`grid ${view === 'split' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-4`}>
                            {loading ? (
                                <div className="col-span-3 py-20 text-center animate-pulse text-muted-foreground">
                                    Cargando...
                                </div>
                            ) : listings.length === 0 ? (
                                <div className="col-span-3 py-10 text-center border rounded-lg bg-muted/20 border-dashed">
                                    <p className="text-muted-foreground">No se encontraron propiedades.</p>
                                    <p className="text-xs text-muted-foreground mt-1">Presiona "Sincronizar" para obtener propiedades de todas las fuentes.</p>
                                </div>
                            ) : (
                                listings.map((listing, index) => {
                                    const images = parseImages(listing.images);
                                    const imgSrc = listing.image || listing.imageUrl || images[0] || '';
                                    const isSelected = selectedId === listing.id;
                                    return (
                                        <AnimatedCard
                                            key={listing.id}
                                            className={`overflow-hidden group flex flex-col h-full bg-card cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                                            index={index}
                                            onClick={() => { setSelectedId(isSelected ? null : listing.id); }}
                                        >
                                            <div className="h-48 bg-muted relative overflow-hidden">
                                                {imgSrc ? (
                                                    <img src={imgSrc} alt={listing.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }} />
                                                ) : null}
                                                <div className={`w-full h-full flex items-center justify-center text-muted-foreground absolute inset-0 bg-muted ${imgSrc ? 'hidden' : ''}`}>
                                                    <span className="text-xs">Sin Imagen</span>
                                                </div>

                                                <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                                                    <div className="bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
                                                        {listing.source}
                                                    </div>
                                                    {(listing.status === 'RENT' || listing.status === 'DETECTED_RENT') && (
                                                        <div className="bg-purple-500/90 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm font-semibold">EN RENTA</div>
                                                    )}
                                                    {(listing.status === 'SALE' || listing.status === 'DETECTED_SALE') && (
                                                        <div className="bg-blue-500/90 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm font-semibold">EN VENTA</div>
                                                    )}
                                                    {listing.propertyType === 'LAND' && (
                                                        <div className="bg-amber-600/90 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm font-semibold">TERRENO</div>
                                                    )}
                                                </div>
                                                <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-bold shadow-sm">
                                                    {listing.price ? `$${listing.price.toLocaleString()}` : 'N/A'}
                                                </div>
                                            </div>

                                            <div className="p-4 flex-1 flex flex-col gap-2">
                                                <h3 className="font-semibold text-sm line-clamp-2" title={listing.title}>{listing.title}</h3>
                                                {(listing.propertyType === 'HOUSE' || listing.propertyType === 'APARTMENT') && (
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <span>â€¢ {listing.bedrooms || 0} Recs</span>
                                                        <span>â€¢ {listing.bathrooms || 0} BaÃ±os</span>
                                                        <span>â€¢ {listing.parking || 0} Autos</span>
                                                    </div>
                                                )}
                                                <div className="flex items-start gap-1 text-xs text-muted-foreground mt-auto">
                                                    <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                                                    <span className="line-clamp-2">{listing.address || 'Sin direcciÃ³n'}</span>
                                                </div>
                                            </div>

                                            <div className="p-3 border-t bg-muted/10 flex justify-between items-center">
                                                {listing.sourceUrl ? (
                                                    <a href={listing.sourceUrl} target="_blank" rel="noopener noreferrer"
                                                        className="text-[10px] text-blue-500 hover:underline"
                                                        onClick={(e) => e.stopPropagation()}>
                                                        Ver original â†—
                                                    </a>
                                                ) : (
                                                    <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full">
                                                        {Math.round((listing.confidence || listing.trustScore / 100 || 0.3) * 100)}% Confianza
                                                    </span>
                                                )}
                                                <AnimatedButton
                                                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); router.push(`/properties/${listing.id}`); }}
                                                    className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90"
                                                >
                                                    Ver Detalle
                                                </AnimatedButton>
                                            </div>
                                        </AnimatedCard>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

                {/* Map Panel */}
                {view !== 'list' && (
                    <div className={`${view === 'split' ? 'md:w-1/2' : 'w-full'} min-h-[400px] rounded-xl overflow-hidden border shadow-inner`}>
                        <iframe
                            src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                            className="w-full h-full border-0"
                            style={{ minHeight: '400px' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                )}
            </div>

            {/* Bottom Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-lg border">
                <span className="text-sm text-muted-foreground">
                    Mostrando {listings.length} de {total.toLocaleString()} resultados
                </span>
                <div className="flex items-center gap-3">
                    <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value={10}>10 por página</option>
                        <option value={20}>20 por página</option>
                        <option value={50}>50 por página</option>
                    </select>
                    <div className="flex items-center gap-1 bg-muted rounded-md p-0.5 h-9">
                        <AnimatedButton variant="ghost" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="h-8 w-8 p-0 hover:bg-background">
                            <ChevronLeft className="h-4 w-4" />
                        </AnimatedButton>
                        <span className="text-sm font-medium px-2 text-center tabular-nums">
                            Página {page} de {Math.max(1, Math.ceil(total / limit))}
                        </span>
                        <AnimatedButton variant="ghost" disabled={page >= Math.ceil(total / limit)} onClick={() => setPage(p => p + 1)} className="h-8 w-8 p-0 hover:bg-background">
                            <ChevronRight className="h-4 w-4" />
                        </AnimatedButton>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
