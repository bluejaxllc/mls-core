'use client';

import { MapPin } from 'lucide-react';

interface Listing {
    id: string;
    title: string;
    price: number;
    address: string;
    image?: string;
    source?: string;
    sourceUrl?: string;
    propertyType?: string;
    lat?: number | null;
    lng?: number | null;
    city?: string;
    state?: string;
    [key: string]: any;
}

interface MapViewProps {
    listings: Listing[];
    selectedId?: string | null;
    onSelectListing?: (id: string) => void;
    center?: { lat: number; lng: number };
    zoom?: number;
}

export function MapView(_props: MapViewProps) {
    return (
        <div className="w-full h-full min-h-[400px] bg-card rounded-xl overflow-hidden shadow-sm border relative flex items-center justify-center">
            <div className="text-center text-muted-foreground px-6">
                <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Mapa desactivado</p>
                <p className="text-xs opacity-60 mt-1">Google Maps se retiró para detener cargos de API.</p>
            </div>
        </div>
    );
}
