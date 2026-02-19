'use client';
import { useLanguage } from '@/lib/i18n';
import { Plus, Building2, Globe, Search, Bell, BarChart3, DollarSign, Home, SlidersHorizontal, ChevronDown, X as XIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { useEffect, useState, Suspense } from 'react';
import { PageTransition, AnimatedCard, AnimatedButton } from '@/components/ui/animated';
import { GovernanceMenu } from '@/components/listings/GovernanceMenu';
import { motion } from 'framer-motion';
import { useComparison } from '@/lib/comparison-context';

// Assuming we have a unified type or an "any" soup for now
interface UnifiedListing {
    id: string;
    type: 'CANONICAL' | 'OBSERVED';
    title: string;
    price: number | null;
    address: string | null;
    status: string;
    image: string | null;
    trustScore: number;
    source: string;
    sourceUrl?: string;
    updatedAt: string;
    confidence?: number;
}

import { MapView } from '@/components/listings/MapView';
import { CHIHUAHUA_CITIES } from '@/lib/chihuahua-locations';
import { LayoutGrid, Map as MapIcon, Filter } from 'lucide-react';

const PROPERTY_TYPES = [
    { value: '', label: 'Todos los Tipos' },
    { value: 'residential', label: 'Residencial' },
    { value: 'commercial', label: 'Comercial' },
    { value: 'land', label: 'Terreno' },
    { value: 'industrial', label: 'Industrial' },
];

function ListingsContent() {
    const { t } = useLanguage();
    const router = useRouter();
    const { data: session }: any = useSession();
    const [activeTab, setActiveTab] = useState<'active' | 'drafts' | 'observed'>('active');
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
    const [cityFilter, setCityFilter] = useState<string>('');
    const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>('');
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [showFilters, setShowFilters] = useState(false);
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [listings, setListings] = useState<UnifiedListing[]>([]);
    const [loading, setLoading] = useState(false);
    const { addItem, removeItem, isInComparison, isFull } = useComparison();

    useEffect(() => {
        if (session?.accessToken) {
            fetchListings();
        }
    }, [session, activeTab, cityFilter, propertyTypeFilter]); // Refetch on filter change

    const fetchListings = async () => {
        try {
            setLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

            let status = 'ACTIVE';
            if (activeTab === 'drafts') status = 'DRAFT';
            if (activeTab === 'observed') status = 'OBSERVED';

            // Construct query params
            const params = new URLSearchParams({
                status: status,
                q: searchQuery,
                ...(cityFilter && { city: cityFilter }),
                ...(propertyTypeFilter && { propertyType: propertyTypeFilter }),
                ...(minPrice && { minPrice }),
                ...(maxPrice && { maxPrice })
            });

            const res = await fetch(`${API_URL}/api/protected/search?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`
                }
            });

            if (res.ok) {
                const response = await res.json();
                const listingsData = Array.isArray(response) ? response : (response.data || []);
                setListings(listingsData);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchListings();
    }

    // SAVED SEARCH LOGIC
    const [isSaveSearchOpen, setIsSaveSearchOpen] = useState(false);
    const [searchName, setSearchName] = useState('');
    const [frequency, setFrequency] = useState('INSTANT');

    const openSaveSearchModal = () => {
        setSearchName(`${cityFilter || 'Todas las ciudades'} - ${searchQuery || 'General'}`);
        setIsSaveSearchOpen(true);
    };

    const submitSaveSearch = async () => {
        try {
            const criteria = {
                status: activeTab === 'active' ? 'ACTIVE' : activeTab,
                q: searchQuery,
                city: cityFilter
            };

            await fetch('/api/protected/saved-searches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: searchName,
                    criteria: criteria,
                    frequency
                })
            });

            setIsSaveSearchOpen(false);
            toast.success('Búsqueda guardada exitosamente');
        } catch (error) {
            console.error('Failed to save search', error);
            toast.error('Error al guardar búsqueda');
        }
    };

    return (
        <PageTransition className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        {t.sections.listings.title}
                    </h2>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">{t.sections.listings.subtitle}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
                    {/* VIEW TOGGLE */}
                    <div className="flex p-1 bg-muted/50 rounded-lg border">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'map' ? 'bg-white shadow-sm text-blue-600' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <MapIcon className="h-4 w-4" />
                        </button>
                    </div>

                    <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                        <div className="relative group flex-1 sm:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar propiedades..."
                                className="h-10 pl-10 pr-3 rounded-lg border border-input bg-background text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all w-full sm:w-48"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* City Filter */}
                        <div className="relative">
                            <select
                                className="h-10 pl-3 pr-8 rounded-lg border border-input bg-background text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                                value={cityFilter}
                                onChange={(e) => setCityFilter(e.target.value)}
                            >
                                <option value="">Todas las Ciudades</option>
                                {CHIHUAHUA_CITIES.map(city => (
                                    <option key={city.value} value={city.value}>{city.name}</option>
                                ))}
                            </select>
                            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                        </div>

                        <AnimatedButton variant="secondary" className="h-10 px-4" type="submit">
                            Buscar
                        </AnimatedButton>

                        <button
                            type="button"
                            onClick={openSaveSearchModal}
                            className="h-10 w-10 flex items-center justify-center rounded-lg border border-input bg-background hover:bg-muted text-muted-foreground hover:text-blue-600 transition-colors"
                            title="Guardar esta búsqueda"
                        >
                            <Bell className="h-4 w-4" />
                        </button>
                    </form>

                    {/* Advanced Filters Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`h-10 flex items-center gap-1.5 px-3 rounded-lg border text-sm font-medium transition-all ${showFilters || propertyTypeFilter || minPrice || maxPrice
                            ? 'border-blue-500 text-blue-600 bg-blue-500/5'
                            : 'border-input text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        <span className="hidden sm:inline">Filtros</span>
                        {(propertyTypeFilter || minPrice || maxPrice) && (
                            <span className="h-4 w-4 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                                {[propertyTypeFilter, minPrice, maxPrice].filter(Boolean).length}
                            </span>
                        )}
                    </button>

                    <AnimatedButton
                        variant="primary"
                        onClick={() => router.push('/listings/new')}
                        className="text-sm font-medium flex items-center justify-center gap-2 h-10 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4" /> <span className="hidden lg:inline">{t.sections.listings.create}</span>
                    </AnimatedButton>
                </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden"
                >
                    <div className="border border-blue-500/20 rounded-xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold flex items-center gap-2">
                                <SlidersHorizontal className="h-3.5 w-3.5 text-blue-500" />
                                Filtros Avanzados
                            </h4>
                            <button onClick={() => setShowFilters(false)} className="p-1 rounded hover:bg-muted/50">
                                <XIcon className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                    <Home className="h-3 w-3" /> Tipo de Propiedad
                                </label>
                                <select
                                    value={propertyTypeFilter}
                                    onChange={e => { setPropertyTypeFilter(e.target.value); }}
                                    className="w-full h-9 px-3 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                >
                                    {PROPERTY_TYPES.map(pt => (
                                        <option key={pt.value} value={pt.value}>{pt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" /> Precio Mínimo
                                </label>
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={e => setMinPrice(e.target.value)}
                                    placeholder="Ej: 500000"
                                    className="w-full h-9 px-3 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" /> Precio Máximo
                                </label>
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={e => setMaxPrice(e.target.value)}
                                    placeholder="Ej: 5000000"
                                    className="w-full h-9 px-3 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-3">
                            <button
                                onClick={() => { setPropertyTypeFilter(''); setMinPrice(''); setMaxPrice(''); }}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Limpiar filtros
                            </button>
                            <AnimatedButton
                                variant="primary"
                                onClick={fetchListings}
                                className="text-xs px-4 py-1.5"
                            >
                                Aplicar
                            </AnimatedButton>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Tabs SCROLLABLE */}
            <div className="border-b flex gap-6 text-sm font-medium text-muted-foreground overflow-x-auto pb-1 scrollbar-hide">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`pb-2 border-b-2 transition-all duration-200 whitespace-nowrap ${activeTab === 'active'
                        ? 'border-blue-500 text-blue-600 font-semibold'
                        : 'border-transparent hover:text-foreground hover:border-border'
                        }`}
                >
                    {t.sections.listings.tabs.active}
                </button>
                <button
                    onClick={() => setActiveTab('drafts')}
                    className={`pb-2 border-b-2 transition-all duration-200 whitespace-nowrap ${activeTab === 'drafts'
                        ? 'border-blue-500 text-blue-600 font-semibold'
                        : 'border-transparent hover:text-foreground hover:border-border'
                        }`}
                >
                    {t.sections.listings.tabs.drafts}
                </button>
                <button
                    onClick={() => setActiveTab('observed')}
                    className={`pb-2 border-b-2 transition-all duration-200 whitespace-nowrap ${activeTab === 'observed'
                        ? 'border-blue-500 text-blue-600 font-semibold'
                        : 'border-transparent hover:text-foreground hover:border-border'
                        }`}
                >
                    <span className="flex items-center gap-2">
                        Detectados / Externos
                        <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] px-2 py-0.5 rounded-full">Nuevo</span>
                    </span>
                </button>
            </div>

            {/* CONTENT AREA */}
            {viewMode === 'map' ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground bg-blue-50 border border-blue-100 p-3 rounded-md">
                        <MapIcon className="h-4 w-4 text-blue-500" />
                        Mostrando <strong>{listings.length}</strong> propiedades en el mapa.
                    </div>
                    <MapView listings={listings} />
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p className="text-muted-foreground col-span-3 py-10 text-center flex flex-col items-center gap-2">
                            <span className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></span>
                            Cargando listados...
                        </p>
                    ) : listings.length === 0 ? (
                        <div className="col-span-3 py-16 text-center border-2 rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 border-dashed">
                            <Building2 className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                            <p className="text-lg font-semibold mb-1">No se encontraron listados</p>
                            <p className="text-sm text-muted-foreground mb-4">Intenta ajustar tus filtros o crea un nuevo listado</p>
                            <AnimatedButton
                                variant="primary"
                                onClick={() => router.push('/listings/new')}
                                className="mt-2"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Crear Primer Listado
                            </AnimatedButton>
                        </div>
                    ) : (
                        listings.map((listing, index) => (
                            <AnimatedCard
                                key={listing.id}
                                className="overflow-hidden group flex flex-col h-full border-2 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
                                index={index}
                            >
                                {/* Image with hover effect */}
                                <div className="h-48 bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                                    {listing.image ? (
                                        <>
                                            <img
                                                src={listing.image}
                                                alt={listing.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                                            <Building2 className="h-16 w-16 opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-300" />
                                        </div>
                                    )}

                                    {/* Status badge con gradient */}
                                    <div className={`absolute top-3 left-3 px-3 py-1.5 text-[10px] font-bold rounded-lg backdrop-blur-md shadow-lg
                                         ${listing.type === 'OBSERVED'
                                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                                            : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'}
                                    `}>
                                        {listing.status} • {listing.source}
                                    </div>

                                    {/* Confidence badge mejorado */}
                                    {listing.confidence && (
                                        <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/70 text-white text-[10px] font-bold rounded-lg backdrop-blur-md shadow-lg">
                                            <span className="text-blue-400">{Math.round(listing.confidence * 100)}%</span> Coincidencia
                                        </div>
                                    )}

                                    {/* Quick action overlay */}
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <motion.button
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            whileHover={{ scale: 1.1 }}
                                            className="bg-white text-black px-6 py-2 rounded-lg font-semibold text-sm shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            onClick={() => router.push(`/listings/${listing.id}`)}
                                        >
                                            Ver Detalles →
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-lg truncate pr-4 flex-1 group-hover:text-blue-600 transition-colors" title={listing.title}>
                                            {listing.title || 'Propiedad Sin Título'}
                                        </h3>
                                        <GovernanceMenu
                                            listingId={listing.id}
                                            sourceType={listing.type}
                                            sourceName={listing.source}
                                        />
                                    </div>

                                    {/* Price */}
                                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                                        {listing.price ? `$${listing.price.toLocaleString()}` : 'Precio no detectado'}
                                        {listing.price && <span className="text-xs text-muted-foreground ml-2">MXN</span>}
                                    </p>

                                    {/* Address */}
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground border-t pt-3 mt-auto">
                                        <Globe className="h-4 w-4 text-blue-500" />
                                        <span className="truncate">{listing.address || 'Dirección no disponible'}</span>
                                    </div>
                                </div>

                                {/* Footer con trust score y action */}
                                <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-5 py-3 text-sm flex justify-between items-center border-t">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <div className={`h-2 w-2 rounded-full ${listing.trustScore < 40 ? 'bg-red-500' : listing.trustScore < 70 ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`} />
                                            <span className="font-semibold">
                                                {listing.trustScore} Confianza
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (isInComparison(listing.id)) {
                                                    removeItem(listing.id);
                                                } else {
                                                    addItem({
                                                        id: listing.id,
                                                        title: listing.title,
                                                        price: listing.price,
                                                        address: listing.address,
                                                        image: listing.image,
                                                        propertyType: listing.type === 'CANONICAL' ? 'canonical' : 'observed',
                                                        status: listing.status,
                                                        source: listing.source,
                                                        trustScore: listing.trustScore,
                                                    });
                                                }
                                            }}
                                            disabled={!isInComparison(listing.id) && isFull}
                                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all ${isInComparison(listing.id)
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-muted hover:bg-blue-100 text-muted-foreground hover:text-blue-600'
                                                } disabled:opacity-40 disabled:cursor-not-allowed`}
                                            title={isInComparison(listing.id) ? 'Quitar de comparación' : 'Agregar a comparación'}
                                        >
                                            <BarChart3 className="h-3 w-3" />
                                            {isInComparison(listing.id) ? '✓' : '+'}
                                        </button>
                                    </div>

                                    {listing.type === 'CANONICAL' ? (
                                        <motion.a
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            href={`/listings/${listing.id}`}
                                            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                        >
                                            Editar →
                                        </motion.a>
                                    ) : (
                                        <motion.a
                                            whileHover={{ scale: 1.05, x: 2 }}
                                            whileTap={{ scale: 0.95 }}
                                            href={`/listings/${listing.id}`}
                                            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                                        >
                                            Ver Detalles →
                                        </motion.a>
                                    )}
                                </div>
                            </AnimatedCard>
                        ))
                    )}
                </div>
            )}
            {/* Save Search Modal */}
            {isSaveSearchOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-background border rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
                        <h3 className="text-lg font-bold">Guardar Búsqueda</h3>
                        <p className="text-sm text-muted-foreground">
                            Recibe notificaciones cuando aparezcan nuevas propiedades con estos criterios.
                        </p>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nombre de la búsqueda</label>
                                <input
                                    type="text"
                                    className="w-full p-2 rounded border bg-muted/50"
                                    placeholder="Ej: Departamentos en Polanco"
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Frecuencia de Notificación</label>
                                <select
                                    className="w-full p-2 rounded border bg-muted/50"
                                    value={frequency}
                                    onChange={(e) => setFrequency(e.target.value)}
                                >
                                    <option value="INSTANT">Instantánea (Email)</option>
                                    <option value="DAILY">Resumen Diario</option>
                                    <option value="WEEKLY">Resumen Semanal</option>
                                    <option value="OFF">Solo guardar (Sin notificaciones)</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setIsSaveSearchOpen(false)}
                                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                            >
                                Cancelar
                            </button>
                            <AnimatedButton
                                variant="primary"
                                onClick={submitSaveSearch}
                                className="px-4 py-2 text-sm"
                            >
                                Guardar Alerta
                            </AnimatedButton>
                        </div>
                    </div>
                </div>
            )}
        </PageTransition>
    )
}

export default function Page() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Cargando buscador...</div>}>
            <ListingsContent />
        </Suspense>
    );
}
