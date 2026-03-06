'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowRight, Activity, Percent, Globe, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
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
        snapshot?: {
            url?: string;
            source?: {
                name: string;
                type: string;
            };
        };
    };
}

export function ObservedListingCard({ listing }: ObservedListingProps) {
    const router = useRouter();

    // Build images array from both imageUrl and images props
    const allImages: string[] = [];
    if (listing.images && listing.images.length > 0) {
        allImages.push(...listing.images.filter(Boolean));
    } else if (listing.imageUrl) {
        allImages.push(listing.imageUrl);
    }

    const [currentImg, setCurrentImg] = useState(0);

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

    const prevImg = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImg(p => (p === 0 ? allImages.length - 1 : p - 1));
    };

    const nextImg = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImg(p => (p + 1 === allImages.length ? 0 : p + 1));
    };

    return (
        <AnimatedCard
            className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
            onClick={handleCardClick}
        >
            {/* Image Section with Mini Carousel */}
            <div className="h-48 relative flex flex-col justify-end p-4 bg-slate-800">
                {allImages.length > 0 ? (
                    <img
                        src={allImages[currentImg]}
                        alt={listing.title || 'Propiedad'}
                        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-700" />
                )}

                {/* Image Navigation Arrows */}
                {allImages.length > 1 && (
                    <>
                        <button
                            onClick={prevImg}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={nextImg}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        {/* Image counter */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1">
                            {allImages.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImg ? 'bg-white scale-125' : 'bg-white/40'}`}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Image count badge */}
                {allImages.length > 1 && (
                    <div className="absolute top-2 left-2 z-10 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm font-medium">
                        {currentImg + 1}/{allImages.length}
                    </div>
                )}

                <div className="relative z-10">
                    <h3 className="text-white font-medium line-clamp-2 drop-shadow-md">{listing.title || 'Propiedad Detectada'}</h3>
                    <p className="text-slate-200 text-xs mt-1 flex items-center gap-1 drop-shadow-md">
                        <Globe className="w-3 h-3" />
                        {listing.snapshot?.source?.name || listing.source || 'Fuente Desconocida'}
                    </p>
                </div>
                <div className="absolute top-2 right-2 z-10 bg-green-500/90 text-white text-xs px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    Detectado
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col space-y-4">
                <div className="space-y-2 flex-1">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{listing.address}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-lg text-blue-600">
                            ${(listing.price ?? 0).toLocaleString()} <span className="text-xs text-muted-foreground">{listing.currency || 'MXN'}</span>
                        </span>
                        {listing.confidenceScore && (
                            <div className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
                                <Percent className="w-3 h-3" />
                                {Math.round(listing.confidenceScore * 100)}% Confianza
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    <AnimatedButton
                        onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleCardClick(); }}
                        className="flex-1 flex items-center justify-center gap-2 text-sm"
                        variant="secondary"
                    >
                        <Eye className="w-4 h-4" /> Ver Detalle
                    </AnimatedButton>
                    <AnimatedButton
                        onClick={handleImport}
                        className="flex-1 flex items-center justify-center gap-2 text-sm"
                        variant="primary"
                    >
                        Importar <ArrowRight className="w-4 h-4" />
                    </AnimatedButton>
                </div>
            </div>
        </AnimatedCard>
    );
}
