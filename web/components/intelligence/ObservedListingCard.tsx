'use client';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowRight, Activity, Percent, Globe } from 'lucide-react';
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

    const handleImport = () => {
        // Pass listing data as query params so the form can prefill
        // even if the listing isn't in the intelligence database
        const params = new URLSearchParams();
        params.set('import', listing.id);
        if (listing.title) params.set('title', listing.title);
        if (listing.price) params.set('price', String(listing.price));
        if (listing.address) params.set('address', listing.address);
        if (listing.city) params.set('city', listing.city);
        if (listing.imageUrl) params.set('imageUrl', listing.imageUrl);
        if (listing.source) params.set('source', listing.source);
        if (listing.propertyType) params.set('type', listing.propertyType);
        if (listing.sourceUrl) params.set('sourceUrl', listing.sourceUrl);
        router.push(`/listings/new?${params.toString()}`);
    };

    return (
        <AnimatedCard className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
            {/* Header / Image Placeholder */}
            <div className={`h-40 relative flex flex-col justify-end p-4 bg-slate-800`}>
                {listing.imageUrl ? (
                    <img
                        src={listing.imageUrl}
                        alt={listing.title || 'Propiedad'}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 hover:opacity-80 transition-opacity"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-700" />
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

                <AnimatedButton
                    onClick={handleImport}
                    className="w-full flex items-center justify-center gap-2 text-sm"
                    variant="primary"
                >
                    Importar a MLS <ArrowRight className="w-4 h-4" />
                </AnimatedButton>
            </div>
        </AnimatedCard>
    );
}
