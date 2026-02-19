'use client';
import { useLanguage } from '@/lib/i18n';
import { Search, Filter, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
import { FiltersModal } from '@/components/filters/FiltersModal';
import { useState, useEffect } from 'react';
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
    const [listings, setListings] = useState<any[]>([]); // Contains status, propertyType, mapUrl, currency
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination & Filters State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50); // Default to 50 as requested
    const [city, setCity] = useState('Chihuahua'); // Default City
    const [listingType, setListingType] = useState('ALL'); // ALL, RENT, SALE
    const [bedrooms, setBedrooms] = useState<number | 'Any'>('Any');
    const [bathrooms, setBathrooms] = useState<number | 'Any'>('Any');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [total, setTotal] = useState(0);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        fetchListings();
    }, [page, limit, city, listingType, bedrooms, bathrooms, minPrice, maxPrice]);

    const fetchListings = async () => {
        try {
            setLoading(true);

            // Build query params for the real search API
            const params = new URLSearchParams();
            if (city !== 'All') params.set('city', city);
            if (listingType !== 'ALL') params.set('listingType', listingType);
            if (searchQuery.trim()) params.set('q', searchQuery.trim());
            params.set('page', String(page));
            params.set('limit', String(limit));

            const res = await fetch(`${API_URL}/api/public/search?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to load properties');

            const result = await res.json();
            let data = result.data || [];

            // Client-side filters for bedrooms/bathrooms/price (not yet server-side)
            if (bedrooms !== 'Any') {
                data = data.filter((p: any) => (p.bedrooms || 0) >= bedrooms);
            }
            if (bathrooms !== 'Any') {
                data = data.filter((p: any) => (p.bathrooms || 0) >= bathrooms);
            }
            if (minPrice) {
                data = data.filter((p: any) => (p.price || 0) >= Number(minPrice));
            }
            if (maxPrice) {
                data = data.filter((p: any) => (p.price || 0) <= Number(maxPrice));
            }

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

    const saveSearch = async () => {
        if (!session?.accessToken) {
            toast.error('Inicia sesión para guardar búsquedas');
            return;
        }
        try {
            const criteria = JSON.stringify({ city, listingType, searchQuery, bedrooms, bathrooms, minPrice, maxPrice });
            const name = `${city !== 'All' ? city : 'Todas'} — ${listingType === 'RENT' ? 'Renta' : listingType === 'SALE' ? 'Venta' : 'Todo'}${searchQuery ? ` — "${searchQuery}"` : ''}`;

            const res = await fetch(`${API_URL}/api/protected/saved-searches`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, criteria })
            });
            if (res.ok) {
                toast.success('Búsqueda guardada correctamente');
            } else {
                toast.error('Error al guardar búsqueda');
            }
        } catch (error) {
            toast.error('Error al guardar búsqueda');
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1); // Reset to page 1
        fetchListings();
    };

    return (
        <PageTransition className="space-y-6">
            {/* Header mejorado */}
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Buscar Propiedad
                </h2>
                <p className="text-muted-foreground">
                    Explora {total > 0 ? `${total.toLocaleString()}` : ''} propiedades detectadas en el mercado en tiempo real
                </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-4 bg-card p-4 rounded-lg border">

                {/* Top Bar: Basic Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">

                    {/* Primary Filters Group */}
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                        {/* City Selector */}
                        <select
                            value={city}
                            onChange={(e) => {
                                setCity(e.target.value);
                                setPage(1);
                            }}
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-32 flex-shrink-0"
                        >
                            <option value="All">Todas</option>
                            <option value="Chihuahua">Chihuahua</option>
                            <option value="Juárez">Juárez</option>
                            <option value="Delicias">Delicias</option>
                            <option value="Cuauhtémoc">Cuauhtémoc</option>
                            <option value="Parral">Parral</option>
                        </select>

                        {/* Rent/Sale Filter */}
                        <select
                            value={listingType}
                            onChange={(e) => {
                                setListingType(e.target.value);
                                setPage(1);
                            }}
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-32 flex-shrink-0"
                        >
                            <option value="ALL">Todos</option>
                            <option value="RENT">En Renta</option>
                            <option value="SALE">En Venta</option>
                        </select>

                        {/* More Filters Toggle */}
                        <AnimatedButton
                            onClick={() => setShowFilters(!showFilters)}
                            variant={showFilters ? "primary" : "secondary"}
                            className="h-9 px-3 flex items-center gap-2 flex-shrink-0"
                        >
                            <Filter className="h-4 w-4" />
                            <span className="hidden sm:inline">{showFilters ? 'Menos Filtros' : 'Más Filtros'}</span>
                        </AnimatedButton>

                        <AnimatedButton
                            onClick={saveSearch}
                            variant="secondary"
                            className="h-9 px-3 flex items-center gap-2 flex-shrink-0"
                            title="Guardar esta búsqueda"
                        >
                            <Bookmark className="h-4 w-4" />
                            <span className="hidden sm:inline">Guardar</span>
                        </AnimatedButton>
                    </div>

                    {/* Search & Pagination */}
                    <div className="flex-1 w-full flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                            <AnimatedInput
                                placeholder="Buscar por dirección, colonia..."
                                className="w-full pl-9 h-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        setPage(1);
                                        fetchListings();
                                    }
                                }}
                            />
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                            <select
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-20 sm:w-auto"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>

                            <div className="flex items-center gap-1 bg-muted rounded-md p-0.5 h-9">
                                <AnimatedButton
                                    variant="ghost"
                                    disabled={page <= 1}
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    className="h-8 w-8 p-0 hover:bg-background"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </AnimatedButton>
                                <span className="text-sm font-medium w-6 text-center tabular-nums">{page}</span>
                                <AnimatedButton
                                    variant="ghost"
                                    onClick={() => setPage(p => p + 1)}
                                    className="h-8 w-8 p-0 hover:bg-background"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </AnimatedButton>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Advanced Filters Panel */}
                {showFilters && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t animate-in fade-in slide-in-from-top-2">
                        {/* Bedrooms */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Recámaras</label>
                            <div className="flex rounded-md shadow-sm">
                                {['Any', 1, 2, 3, 4].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => { setBedrooms(num as any); setPage(1); }}
                                        className={`flex-1 h-8 text-xs font-medium border first:rounded-l-md last:rounded-r-md -ml-px first:ml-0 focus:z-10 focus:ring-2 focus:ring-primary ${bedrooms === num
                                            ? 'bg-primary text-primary-foreground border-primary z-10'
                                            : 'bg-background text-muted-foreground hover:bg-muted'
                                            }`}
                                    >
                                        {num === 'Any' ? 'Todas' : `${num}+`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Bathrooms */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Baños</label>
                            <div className="flex rounded-md shadow-sm">
                                {['Any', 1, 2, 3].map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => { setBathrooms(num as any); setPage(1); }}
                                        className={`flex-1 h-8 text-xs font-medium border first:rounded-l-md last:rounded-r-md -ml-px first:ml-0 focus:z-10 focus:ring-2 focus:ring-primary ${bathrooms === num
                                            ? 'bg-primary text-primary-foreground border-primary z-10'
                                            : 'bg-background text-muted-foreground hover:bg-muted'
                                            }`}
                                    >
                                        {num === 'Any' ? 'Todos' : `${num}+`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Min */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Precio Min</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                                <input
                                    type="number"
                                    placeholder="Min"
                                    className="h-8 w-full rounded-md border border-input bg-background pl-6 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={minPrice}
                                    onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                                />
                            </div>
                        </div>

                        {/* Price Max */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Precio Max</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    className="h-8 w-full rounded-md border border-input bg-background pl-6 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                                    value={maxPrice}
                                    onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-3 py-20 text-center animate-pulse text-muted-foreground">
                        Cargando...
                    </div>
                ) : listings.length === 0 ? (
                    <div className="col-span-3 py-10 text-center border rounded-lg bg-muted/20 border-dashed">
                        <p className="text-muted-foreground">No se encontraron propiedades.</p>
                    </div>
                ) : (
                    listings.map((listing, index) => (
                        <AnimatedCard key={listing.id} className="overflow-hidden group flex flex-col h-full bg-card" index={index}>
                            <div className="h-48 bg-muted relative overflow-hidden">
                                {listing.image ? (
                                    <img
                                        src={listing.image}
                                        alt={listing.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                ) : null}
                                <div className={`w-full h-full flex items-center justify-center text-muted-foreground absolute inset-0 bg-muted ${listing.image ? 'hidden' : ''}`}>
                                    <span className="text-xs">Sin Imagen</span>
                                </div>

                                <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                                    <div className="bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
                                        {listing.source}
                                    </div>
                                    {/* Rent/Sale Badge */}
                                    {listing.status === 'RENT' && (
                                        <div className="bg-purple-500/90 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm font-semibold">
                                            EN RENTA
                                        </div>
                                    )}
                                    {listing.status === 'SALE' && (
                                        <div className="bg-blue-500/90 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm font-semibold">
                                            EN VENTA
                                        </div>
                                    )}
                                    {/* Land/Terreno Badge */}
                                    {listing.propertyType === 'LAND' && (
                                        <div className="bg-amber-600/90 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm font-semibold">
                                            TERRENO
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-bold shadow-sm">
                                    {listing.price ? `$${listing.price.toLocaleString()}` : 'N/A'}
                                </div>
                            </div>

                            <div className="p-4 flex-1 flex flex-col gap-2">
                                <h3 className="font-semibold text-sm line-clamp-2" title={listing.title}>
                                    {listing.title}
                                </h3>
                                {/* Property Features */}
                                {(listing.propertyType === 'HOUSE' || listing.propertyType === 'APARTMENT') && (
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">• {listing.bedrooms || 0} Recs</span>
                                        <span className="flex items-center gap-1">• {listing.bathrooms || 0} Baños</span>
                                        <span className="flex items-center gap-1">• {listing.parking || 0} Autos</span>
                                    </div>
                                )}
                                <div className="flex items-start gap-1 text-xs text-muted-foreground mt-auto">
                                    <Globe className="h-3 w-3 mt-0.5" />
                                    <span className="line-clamp-2">{listing.address}</span>
                                </div>
                            </div>

                            <div className="p-3 border-t bg-muted/10 flex justify-between items-center">
                                <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full">
                                    {Math.round((listing.confidence || 0) * 100)}% Confianza
                                </span>
                                <div className="flex gap-2">
                                    <AnimatedButton
                                        onClick={() => router.push(`/properties/${listing.id}`)}
                                        className="text-xs bg-muted text-foreground px-3 py-1.5 rounded-md hover:bg-muted/80 transition-colors"
                                    >
                                        Ver Detalle
                                    </AnimatedButton>
                                    <AnimatedButton
                                        onClick={() => router.push(`/listings/new?import=${listing.id}`)}
                                        className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors"
                                    >
                                        Importar
                                    </AnimatedButton>
                                </div>
                            </div>
                        </AnimatedCard>
                    ))
                )}
            </div>

            <div className="flex justify-center text-xs text-muted-foreground pt-4">
                Mostrando {listings.length} resultados
            </div>

        </PageTransition>
    );
}
