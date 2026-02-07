'use client';
import { useLanguage } from '@/lib/i18n';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { FiltersModal } from '@/components/filters/FiltersModal';
import { useState, useEffect } from 'react';
import { PageTransition, AnimatedCard, AnimatedButton, AnimatedInput } from '@/components/ui/animated';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { GovernanceMenu } from '@/components/listings/GovernanceMenu';
import { Globe } from 'lucide-react';

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
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchListings(); // No auth check - endpoint is public
    }, [page, limit, city, listingType]); // Re-fetch on filter change

    const fetchListings = async () => {
        try {
            setLoading(true);

            // Cargar dummy data from local file
            const res = await fetch('/data/properties.json');
            if (!res.ok) throw new Error('Failed to load properties');

            const allProperties: any[] = await res.json();

            // Aplicar filtros
            let filtered = allProperties;

            // Filter by city
            if (city !== 'All') {
                filtered = filtered.filter(p => p.city === city);
            }

            // Filter by listing type (RENT/SALE)
            if (listingType !== 'ALL') {
                filtered = filtered.filter(p => p.status === listingType);
            }

            // Filter by search query
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                filtered = filtered.filter(p =>
                    p.title?.toLowerCase().includes(query) ||
                    p.address?.toLowerCase().includes(query) ||
                    p.city?.toLowerCase().includes(query) ||
                    p.description?.toLowerCase().includes(query)
                );
            }

            // Aplicar paginación
            const start = (page - 1) * limit;
            const end = start + limit;
            const paginated = filtered.slice(start, end);

            setListings(paginated);
            setTotal(filtered.length);

            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
            console.error('Error loading properties:', error);
            setListings([]);
            setTotal(0);
        } finally {
            setLoading(false);
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
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-lg border">

                {/* Filters Group */}
                <div className="flex items-center gap-3">
                    {/* City Selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Ciudad:</span>
                        <select
                            value={city}
                            onChange={(e) => {
                                setCity(e.target.value);
                                setPage(1);
                            }}
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-32"
                        >
                            <option value="All">Todas</option>
                            <option value="Chihuahua">Chihuahua</option>
                            <option value="Juárez">Juárez</option>
                            <option value="Delicias">Delicias</option>
                            <option value="Cuauhtémoc">Cuauhtémoc</option>
                            <option value="Parral">Parral</option>
                        </select>
                    </div>

                    {/* Rent/Sale Filter */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Tipo:</span>
                        <select
                            value={listingType}
                            onChange={(e) => {
                                setListingType(e.target.value);
                                setPage(1);
                            }}
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-32"
                        >
                            <option value="ALL">Todos</option>
                            <option value="RENT">Para Rentar</option>
                            <option value="SALE">Para Vender</option>
                        </select>
                    </div>
                </div>

                <div className="flex-1 w-full flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                        <AnimatedInput
                            placeholder="Buscar por dirección, colonia..."
                            className="w-full pl-9"
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
                    <AnimatedButton
                        onClick={() => {
                            setPage(1);
                            fetchListings();
                        }}
                        variant="secondary"
                    >
                        <Search className="h-4 w-4" />
                    </AnimatedButton>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setPage(1);
                        }}
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value={10}>10 por pág</option>
                        <option value={20}>20 por pág</option>
                        <option value={50}>50 por pág</option>
                    </select>

                    <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
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
                            <div className="h-48 bg-gray-100 relative overflow-hidden">
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
                                <div className={`w-full h-full flex items-center justify-center text-muted-foreground absolute inset-0 bg-gray-100 ${listing.image ? 'hidden' : ''}`}>
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
                                <div className="flex items-start gap-1 text-xs text-muted-foreground mt-auto">
                                    <Globe className="h-3 w-3 mt-0.5" />
                                    <span className="line-clamp-2">{listing.address}</span>
                                </div>
                            </div>

                            <div className="p-3 border-t bg-muted/10 flex justify-between items-center">
                                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                    {Math.round((listing.confidence || 0) * 100)}% Confianza
                                </span>
                                <AnimatedButton
                                    onClick={() => router.push(`/listings/${listing.id}`)}
                                    className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors"
                                >
                                    Ver e Importar
                                </AnimatedButton>
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
