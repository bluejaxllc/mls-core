'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Building2, DollarSign, Loader2, List, Map as MapIcon, Eye } from 'lucide-react';
import { PageTransition, AnimatedCard } from '@/components/ui/animated';
import Link from 'next/link';

interface Listing {
    id: string;
    title: string | null;
    address: string | null;
    city: string | null;
    price: number | null;
    propertyType: string;
    images: string;
    status: string;
}

export default function MapPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchCity, setSearchCity] = useState('');
    const [view, setView] = useState<'split' | 'list' | 'map'>('split');

    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const params = new URLSearchParams({ status: 'ACTIVE' });
                if (searchCity) params.set('city', searchCity);
                const res = await fetch(`${API}/api/search?${params}`);
                if (res.ok) {
                    const data = await res.json();
                    setListings(Array.isArray(data) ? data : data.listings || []);
                }
            } catch (err) {
                console.error('Error fetching listings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, [searchCity]);

    const parseImages = (s: string): string[] => {
        try { return JSON.parse(s); } catch { return []; }
    };

    const fmtPrice = (n: number) => `$${Math.round(n).toLocaleString('es-MX')}`;

    const selectedListing = listings.find(l => l.id === selectedId);
    const mapQuery = selectedListing?.address
        ? encodeURIComponent(selectedListing.address + ', Chihuahua, Mexico')
        : encodeURIComponent('Chihuahua, Mexico');

    return (
        <PageTransition className="space-y-4 h-[calc(100vh-6rem)]">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 p-5 md:p-6 text-white">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24" />
                <div className="relative z-10 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Mapa de Propiedades</h1>
                            <p className="text-white/70 text-xs">{listings.length} propiedades activas</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* City Search */}
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/50" />
                            <input
                                type="text"
                                value={searchCity}
                                onChange={e => setSearchCity(e.target.value)}
                                placeholder="Filtrar por ciudad..."
                                className="pl-8 pr-3 py-2 bg-white/15 border border-white/20 rounded-lg text-xs placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 w-40 md:w-52"
                            />
                        </div>
                        {/* View Toggle */}
                        <div className="flex bg-white/15 rounded-lg p-0.5">
                            {(['split', 'list', 'map'] as const).map(v => (
                                <button
                                    key={v}
                                    onClick={() => setView(v)}
                                    className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${view === v ? 'bg-white text-blue-700 shadow' : 'text-white/70 hover:text-white'
                                        }`}
                                >
                                    {v === 'split' ? 'Split' : v === 'list' ? <List className="h-3.5 w-3.5" /> : <MapIcon className="h-3.5 w-3.5" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="py-16 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-500" />
                    <p className="text-muted-foreground text-sm">Cargando propiedades...</p>
                </div>
            ) : (
                <div className={`flex gap-4 flex-1 min-h-0 ${view === 'map' ? 'flex-col' : view === 'list' ? 'flex-col' : 'flex-col md:flex-row'}`} style={{ height: 'calc(100vh - 14rem)' }}>
                    {/* Listing Sidebar */}
                    {view !== 'map' && (
                        <div className={`${view === 'split' ? 'md:w-80 lg:w-96' : 'w-full'} overflow-y-auto space-y-2 pr-1 shrink-0`}>
                            {listings.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Building2 className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
                                    <p className="text-sm text-muted-foreground">Sin propiedades en esta zona</p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {listings.map((listing, idx) => {
                                        const images = parseImages(listing.images);
                                        const isSelected = selectedId === listing.id;
                                        return (
                                            <motion.div
                                                key={listing.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.03 }}
                                                onClick={() => setSelectedId(isSelected ? null : listing.id)}
                                                className={`flex gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:shadow-md ${isSelected
                                                    ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700 ring-1 ring-blue-400'
                                                    : 'bg-card border-border hover:border-blue-200'
                                                    }`}
                                            >
                                                <div className="h-16 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                                                    {images[0] ? (
                                                        <img src={images[0]} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Building2 className="h-5 w-5 text-muted-foreground/30" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-xs font-bold truncate">{listing.title || 'Sin título'}</h4>
                                                    {listing.address && (
                                                        <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5 truncate">
                                                            <MapPin className="h-2.5 w-2.5 shrink-0" />
                                                            {listing.address}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center justify-between mt-1.5">
                                                        {listing.price ? (
                                                            <span className="text-xs font-bold text-blue-600">{fmtPrice(listing.price)}</span>
                                                        ) : (
                                                            <span className="text-[10px] text-muted-foreground">Sin precio</span>
                                                        )}
                                                        <Link
                                                            href={`/listings/${listing.id}`}
                                                            onClick={e => e.stopPropagation()}
                                                            className="text-[10px] text-blue-500 hover:underline flex items-center gap-0.5"
                                                        >
                                                            <Eye className="h-2.5 w-2.5" />
                                                            Ver
                                                        </Link>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            )}
                        </div>
                    )}

                    {/* Map */}
                    {view !== 'list' && (
                        <div className="flex-1 min-h-[300px] rounded-xl overflow-hidden border shadow-inner">
                            <iframe
                                src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                className="w-full h-full border-0"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    )}
                </div>
            )}
        </PageTransition>
    );
}
