'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowRight, Percent, ChevronLeft, ChevronRight, Eye, ExternalLink, Heart } from 'lucide-react';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated';

interface ObservedListingProps {
    listing: {
        id: string;
        title?: string | null;
        description?: string | null;
        price?: number | null;
        currency?: string;
        address?: string | null;
        city?: string | null;
        confidenceScore?: number;
        imageUrl?: string | null;
        images?: string[];
        source?: string | null;
        sourceUrl?: string | null;
        propertyType?: string | null;
        status?: string | null;
        snapshot?: {
            url?: string;
            source?: {
                name: string;
                type: string;
            };
        };
    };
}

// Source-specific color config
const SOURCE_THEMES: Record<string, {
    badge: string;
    badgeBg: string;
    border: string;
    gradient: string;
    icon: string;
    label: string;
    btnPrimary: string;
    btnSecondary: string;
    priceColor: string;
}> = {
    facebook: {
        badge: 'text-white',
        badgeBg: 'bg-[#1877F2]',
        border: 'border-l-[#1877F2]',
        gradient: 'from-[#1877F2]/20 to-indigo-500/10',
        icon: '📘',
        label: 'Facebook',
        btnPrimary: 'bg-gradient-to-r from-[#1877F2] to-indigo-600 hover:from-[#166FE5] hover:to-indigo-700 text-white border-0',
        btnSecondary: 'border-[#1877F2]/30 text-[#1877F2] hover:bg-[#1877F2]/5',
        priceColor: 'text-[#1877F2]',
    },
    mercadolibre: {
        badge: 'text-slate-900',
        badgeBg: 'bg-[#FFE600]',
        border: 'border-l-[#FFE600]',
        gradient: 'from-[#FFE600]/20 to-amber-500/10',
        icon: '🟡',
        label: 'Mercado Libre',
        btnPrimary: 'bg-gradient-to-r from-[#FFE600] to-amber-500 hover:from-[#FFD700] hover:to-amber-600 text-slate-900 border-0 font-semibold',
        btnSecondary: 'border-amber-400/30 text-amber-700 hover:bg-amber-50',
        priceColor: 'text-amber-600',
    },
    inmuebles24: {
        badge: 'text-white',
        badgeBg: 'bg-[#E4002B]',
        border: 'border-l-[#E4002B]',
        gradient: 'from-[#E4002B]/20 to-rose-500/10',
        icon: '🏠',
        label: 'Inmuebles24',
        btnPrimary: 'bg-gradient-to-r from-[#E4002B] to-rose-600 hover:from-[#CC0027] hover:to-rose-700 text-white border-0',
        btnSecondary: 'border-rose-400/30 text-rose-600 hover:bg-rose-50',
        priceColor: 'text-rose-600',
    },
    lamudi: {
        badge: 'text-white',
        badgeBg: 'bg-[#00A651]',
        border: 'border-l-[#00A651]',
        gradient: 'from-[#00A651]/20 to-emerald-500/10',
        icon: '🏡',
        label: 'Lamudi',
        btnPrimary: 'bg-gradient-to-r from-[#00A651] to-emerald-600 hover:from-[#008F45] hover:to-emerald-700 text-white border-0',
        btnSecondary: 'border-emerald-400/30 text-emerald-600 hover:bg-emerald-50',
        priceColor: 'text-emerald-600',
    },
    vivanuncios: {
        badge: 'text-white',
        badgeBg: 'bg-[#7B2D8E]',
        border: 'border-l-[#7B2D8E]',
        gradient: 'from-[#7B2D8E]/20 to-purple-500/10',
        icon: '🏘️',
        label: 'Vivanuncios',
        btnPrimary: 'bg-gradient-to-r from-[#7B2D8E] to-purple-600 hover:from-[#6A2679] hover:to-purple-700 text-white border-0',
        btnSecondary: 'border-purple-400/30 text-purple-600 hover:bg-purple-50',
        priceColor: 'text-purple-600',
    },
    default: {
        badge: 'text-white',
        badgeBg: 'bg-teal-500',
        border: 'border-l-teal-500',
        gradient: 'from-teal-500/20 to-cyan-500/10',
        icon: '🌐',
        label: 'Otra Fuente',
        btnPrimary: 'bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white border-0',
        btnSecondary: 'border-teal-400/30 text-teal-600 hover:bg-teal-50',
        priceColor: 'text-teal-600',
    }
};

function getSourceTheme(source?: string | null) {
    const s = (source || '').toLowerCase();
    if (s.includes('facebook')) return SOURCE_THEMES.facebook;
    if (s.includes('mercado') || s === 'ml' || s.includes('meli')) return SOURCE_THEMES.mercadolibre;
    if (s.includes('inmuebles24') || s.includes('i24')) return SOURCE_THEMES.inmuebles24;
    if (s.includes('lamudi')) return SOURCE_THEMES.lamudi;
    if (s.includes('vivanuncios') || s.includes('viva')) return SOURCE_THEMES.vivanuncios;
    // For unknown sources, use default theme but with actual source name
    const theme = { ...SOURCE_THEMES.default };
    if (source && source.length > 0 && source !== 'default') {
        theme.label = source;
    }
    return theme;
}

export function ObservedListingCard({ listing }: ObservedListingProps) {
    const router = useRouter();
    const sourceName = listing.snapshot?.source?.name || listing.source || '';
    const theme = getSourceTheme(sourceName);

    // Build images array
    const allImages: string[] = [];
    if (listing.images && listing.images.length > 0) {
        allImages.push(...listing.images.filter(Boolean));
    } else if (listing.imageUrl) {
        allImages.push(listing.imageUrl);
    }

    const [currentImg, setCurrentImg] = useState(0);
    const [saved, setSaved] = useState(false);

    // Check localStorage on mount
    useState(() => {
        try {
            const savedItems = JSON.parse(localStorage.getItem('mls_saved_listings') || '[]');
            if (savedItems.some((s: any) => s.id === listing.id)) setSaved(true);
        } catch { }
    });

    const handleImport = (e: React.MouseEvent) => {
        e.stopPropagation();
        const params = new URLSearchParams();
        params.set('import', listing.id);
        if (listing.title) params.set('title', listing.title);
        if (listing.price) params.set('price', String(listing.price));
        if (listing.address) params.set('address', listing.address);
        if (listing.city) params.set('city', listing.city);
        if (allImages[0]) params.set('imageUrl', allImages[0]);
        if (listing.source) params.set('source', listing.source);
        if (listing.propertyType) params.set('type', listing.propertyType);
        if (listing.sourceUrl) params.set('sourceUrl', listing.sourceUrl);
        router.push(`/listings/new?${params.toString()}`);
    };

    const handleCardClick = () => {
        router.push(`/listings/${listing.id}`);
    };

    const handleSourceLink = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (listing.sourceUrl) {
            window.open(listing.sourceUrl, '_blank');
        }
    };

    const prevImg = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImg(p => (p === 0 ? allImages.length - 1 : p - 1));
    };

    const nextImg = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImg(p => (p + 1 === allImages.length ? 0 : p + 1));
    };

    const toggleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const savedItems = JSON.parse(localStorage.getItem('mls_saved_listings') || '[]');
            if (saved) {
                const filtered = savedItems.filter((s: any) => s.id !== listing.id);
                localStorage.setItem('mls_saved_listings', JSON.stringify(filtered));
                setSaved(false);
            } else {
                savedItems.push({
                    id: listing.id,
                    title: listing.title,
                    price: listing.price,
                    currency: listing.currency,
                    address: listing.address,
                    city: listing.city,
                    imageUrl: allImages[0] || listing.imageUrl,
                    source: listing.source,
                    sourceUrl: listing.sourceUrl,
                    propertyType: listing.propertyType,
                    status: listing.status,
                    savedAt: new Date().toISOString(),
                });
                localStorage.setItem('mls_saved_listings', JSON.stringify(savedItems));
                setSaved(true);
            }
        } catch { }
    };

    return (
        <div onClick={handleCardClick} className="cursor-pointer">
            <AnimatedCard
                className={`overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300 group border-l-4 ${theme.border}`}
            >
                {/* Image Section */}
                <div className="h-48 relative flex flex-col justify-end p-4 bg-slate-800">
                    {allImages.length > 0 ? (
                        <img
                            src={allImages[currentImg]}
                            alt={listing.title || 'Propiedad'}
                            className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                        />
                    ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`} />
                    )}

                    {/* Image Navigation */}
                    {allImages.length > 1 && (
                        <>
                            <button onClick={prevImg} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button onClick={nextImg} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1">
                                {allImages.map((_, idx) => (
                                    <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImg ? 'bg-white scale-125' : 'bg-white/40'}`} />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Image count */}
                    {allImages.length > 1 && (
                        <div className="absolute top-2 right-2 z-10 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm font-medium">
                            {currentImg + 1}/{allImages.length}
                        </div>
                    )}

                    {/* Source Badge — top left, color-coded */}
                    <div className={`absolute top-2 left-2 z-10 ${theme.badgeBg} ${theme.badge} text-[10px] px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 font-semibold backdrop-blur-sm`}>
                        <span className="text-[10px]">{theme.icon}</span>
                        {theme.label}
                    </div>

                    {/* Metadata Badges (Rent/Sale & Property Type) */}
                    <div className="absolute top-8 left-2 z-10 flex flex-col gap-1.5 items-start">
                        {/* Status (Rent / Sale) */}
                        {listing.status && (
                            <div className={`text-[9px] px-2 py-0.5 rounded shadow-sm font-bold uppercase tracking-wider text-white backdrop-blur-md ${(listing.status.includes('RENT') || listing.status === 'RENT') ? 'bg-purple-500/80 border border-purple-400/30' :
                                (listing.status.includes('SALE') || listing.status === 'SALE') ? 'bg-emerald-500/80 border border-emerald-400/30' :
                                    'bg-slate-700/80 border border-slate-500/30'
                                }`}>
                                {(listing.status.includes('RENT') || listing.status === 'RENT') ? 'RENTA' : 'VENTA'}
                            </div>
                        )}

                        {/* Property Type */}
                        {listing.propertyType && (
                            <div className="text-[9px] px-2 py-0.5 rounded shadow-sm font-bold uppercase tracking-wider bg-black/60 text-slate-200 border border-white/20 backdrop-blur-md">
                                {
                                    listing.propertyType === 'HOUSE' ? 'Casa' :
                                        listing.propertyType === 'APARTMENT' ? 'Departamento' :
                                            listing.propertyType === 'COMMERCIAL' ? 'Comercial' :
                                                listing.propertyType === 'LAND' ? 'Terreno' :
                                                    listing.propertyType === 'INDUSTRIAL' ? 'Industrial' :
                                                        listing.propertyType
                                }
                            </div>
                        )}
                    </div>

                    {/* Title overlay */}
                    <div className="relative z-10">
                        <h3 className="text-white font-semibold line-clamp-2 drop-shadow-lg text-sm">{listing.title || 'Propiedad Detectada'}</h3>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col space-y-3">
                    <div className="space-y-2 flex-1">
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                            <span className="line-clamp-1 text-xs">{listing.address || 'Sin dirección'}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className={`font-bold text-xl ${theme.priceColor}`}>
                                ${(listing.price ?? 0).toLocaleString()}
                                <span className="text-xs text-muted-foreground font-normal ml-1">{listing.currency || 'MXN'}</span>
                            </span>
                            {listing.confidenceScore && (
                                <div className="flex items-center gap-1 text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                    <Percent className="w-2.5 h-2.5" />
                                    {Math.round(listing.confidenceScore * 100)}%
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-1">
                        <button
                            onClick={toggleSave}
                            className={`flex items-center justify-center p-2 rounded-lg border transition-all ${saved ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'border-slate-200 dark:border-slate-700 text-muted-foreground hover:text-rose-500 hover:border-rose-500/30'}`}
                            title={saved ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                        >
                            <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
                        </button>
                        <button
                            onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleCardClick(); }}
                            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 px-3 rounded-lg border transition-all ${theme.btnSecondary}`}
                        >
                            <Eye className="w-3.5 h-3.5" /> Ver Detalle
                        </button>
                        <button
                            onClick={handleImport}
                            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 px-3 rounded-lg transition-all shadow-sm hover:shadow-md ${theme.btnPrimary}`}
                        >
                            Importar <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Source link */}
                    {listing.sourceUrl && (
                        <button
                            onClick={handleSourceLink}
                            className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors pt-1"
                        >
                            <ExternalLink className="w-3 h-3" />
                            Ver en {theme.label}
                        </button>
                    )}
                </div>
            </AnimatedCard>
        </div>
    );
}

