'use client';
import { useLanguage } from '@/lib/i18n';
import { Plus, Building2, Globe, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState, Suspense } from 'react';
import { PageTransition, AnimatedCard, AnimatedButton } from '@/components/ui/animated';
import { GovernanceMenu } from '@/components/listings/GovernanceMenu';
import { motion } from 'framer-motion';

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

function ListingsContent() {
    const { t } = useLanguage();
    const router = useRouter();
    const { data: session }: any = useSession();
    const [activeTab, setActiveTab] = useState<'active' | 'drafts' | 'observed'>('active');
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [listings, setListings] = useState<UnifiedListing[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (session?.accessToken) {
            fetchListings();
        }
    }, [session, activeTab]);

    const fetchListings = async () => {
        try {
            setLoading(true);
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

            // Map tab to API status/params
            // active -> status=ACTIVE
            // drafts -> status=DRAFT
            // observed -> status=OBSERVED (handled by backend unification)

            let status = 'ACTIVE';
            if (activeTab === 'drafts') status = 'DRAFT';
            if (activeTab === 'observed') status = 'OBSERVED';

            const res = await fetch(`${API_URL}/api/protected/search?status=${status}&q=${encodeURIComponent(searchQuery)}`, {
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`
                }
            });

            if (res.ok) {
                const response = await res.json();
                // Handle both old format (array) and new format (object with data property)
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

    return (
        <PageTransition className="space-y-6">
            {/* Header mejorado */}
            {/* Header mejorado - RESPONSIVE */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        {t.sections.listings.title}
                    </h2>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">{t.sections.listings.subtitle}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
                        <div className="relative group flex-1 sm:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar propiedades..."
                                className="h-10 pl-10 pr-3 rounded-lg border border-input bg-background text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all w-full sm:w-64"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <AnimatedButton variant="secondary" className="h-10 px-4" type="submit">
                            Buscar
                        </AnimatedButton>
                    </form>
                    <AnimatedButton
                        variant="primary"
                        onClick={() => router.push('/listings/new')}
                        className="text-sm font-medium flex items-center justify-center gap-2 h-10 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4" /> {t.sections.listings.create}
                    </AnimatedButton>
                </div>
            </div>

            {/* Tabs mejorados */}
            {/* Tabs mejorados - SCROLLABLE */}
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
                        Detected / External
                        <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] px-2 py-0.5 rounded-full">New</span>
                    </span>
                </button>
            </div>

            {/* Inventory Grid mejorado */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-muted-foreground col-span-3 py-10 text-center">Cargando listados...</p>
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
                                        <span className="text-blue-400">{Math.round(listing.confidence * 100)}%</span> Match
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
                                        {listing.title || 'Untitled Property'}
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
                                <div className="flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full ${listing.trustScore < 40 ? 'bg-red-500' : listing.trustScore < 70 ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`} />
                                    <span className="font-semibold">
                                        {listing.trustScore} Trust
                                    </span>
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
