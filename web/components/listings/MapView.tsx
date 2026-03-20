'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';

interface MapViewProps {
    listings: any[];
    center?: { lat: number; lng: number };
    zoom?: number;
}

export function MapView({ listings, center, zoom = 12 }: MapViewProps) {
    const [apiKey] = useState(process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY);
    const mapRef = useRef<HTMLDivElement>(null);

    const firstListing = listings[0];

    // Build a better geocoding query using city/state context
    const buildQuery = () => {
        if (!firstListing?.address) return 'Chihuahua, Mexico';
        const parts = [firstListing.address];
        if (firstListing.city) parts.push(firstListing.city);
        if (firstListing.state) parts.push(firstListing.state);
        else parts.push('Chihuahua');
        parts.push('Mexico');
        return parts.join(', ');
    };
    const locationQuery = buildQuery();

    const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(locationQuery)}&t=&z=${zoom}&ie=UTF8&iwloc=&output=embed`;

    return (
        <div className="w-full h-full min-h-[400px] bg-card rounded-xl overflow-hidden shadow-sm border relative">
            <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={mapUrl}
            ></iframe>
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-md text-xs font-medium shadow-sm border">
                Mostrando {listings.length} propiedades cerca de {firstListing ? 'destino' : 'Chihuahua'}
            </div>
        </div>
    );
}
