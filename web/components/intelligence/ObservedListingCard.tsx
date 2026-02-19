'use client';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowRight, Activity, Percent, Globe } from 'lucide-react';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated';

interface ObservedListingProps {
    listing: {
        id: string;
        title: string;
        description: string;
        price: number;
        currency: string;
        address: string;
        source: string;
        confidenceScore: number;
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
        router.push(`/listings/new?import=${listing.id}`);
    };

    return (
        <AnimatedCard className="overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
            {/* Header / Image Placeholder */}
            <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-700 relative flex items-center justify-center p-4">
                <div className="text-center">
                    <h3 className="text-white font-medium line-clamp-2">{listing.title}</h3>
                    <p className="text-slate-300 text-xs mt-1 flex items-center justify-center gap-1">
                        <Globe className="w-3 h-3" />
                        {listing.snapshot?.source?.name || 'Fuente Desconocida'}
                    </p>
                </div>
                <div className="absolute top-2 right-2 bg-green-500/20 text-green-300 text-xs px-2 py-0.5 rounded-full border border-green-500/30 flex items-center gap-1">
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
                            ${listing.price.toLocaleString()} <span className="text-xs text-muted-foreground">{listing.currency}</span>
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
