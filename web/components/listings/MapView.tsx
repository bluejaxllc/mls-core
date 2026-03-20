'use client';

import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MapPin, Home, Building, Trees, Store } from 'lucide-react';

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

const CHIHUAHUA_CENTER = { lat: 28.6353, lng: -106.0889 };

const PROPERTY_COLORS: Record<string, string> = {
    HOUSE: '#10B981',
    APARTMENT: '#6366F1',
    LAND: '#F59E0B',
    COMMERCIAL: '#EF4444',
    residential: '#10B981',
};

const PROPERTY_ICONS: Record<string, typeof Home> = {
    HOUSE: Home,
    APARTMENT: Building,
    LAND: Trees,
    COMMERCIAL: Store,
    residential: Home,
};

function formatPrice(price: number): string {
    if (!price) return '';
    if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(1)}M`;
    if (price >= 1_000) return `$${(price / 1_000).toFixed(0)}K`;
    return `$${price}`;
}

function MapContent({ listings, selectedId, onSelectListing }: Omit<MapViewProps, 'center' | 'zoom'>) {
    const map = useMap();
    const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);

    // Pan to selected listing when it changes
    useEffect(() => {
        if (!map || !selectedId) return;
        const listing = listings.find(l => l.id === selectedId);
        if (listing?.lat && listing?.lng) {
            map.panTo({ lat: listing.lat, lng: listing.lng });
            map.setZoom(16);
            setActiveMarkerId(selectedId);
        }
    }, [selectedId, map, listings]);

    const geoListings = useMemo(
        () => listings.filter(l => l.lat && l.lng),
        [listings]
    );

    const handleMarkerClick = useCallback((listing: Listing) => {
        setActiveMarkerId(listing.id);
        onSelectListing?.(listing.id);
        if (map) {
            map.panTo({ lat: listing.lat!, lng: listing.lng! });
        }
    }, [map, onSelectListing]);

    return (
        <>
            {geoListings.map((listing) => {
                const color = PROPERTY_COLORS[listing.propertyType || 'HOUSE'] || '#6B7280';
                const isSelected = listing.id === selectedId;
                const isActive = listing.id === activeMarkerId;

                return (
                    <AdvancedMarker
                        key={listing.id}
                        position={{ lat: listing.lat!, lng: listing.lng! }}
                        onClick={() => handleMarkerClick(listing)}
                        zIndex={isSelected ? 100 : 1}
                    >
                        {/* Custom marker pin */}
                        <div
                            className={`relative cursor-pointer transition-all duration-200 ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}`}
                            style={{ filter: isSelected ? 'drop-shadow(0 0 8px rgba(99,102,241,0.6))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                        >
                            <div
                                className="rounded-full flex items-center justify-center text-white font-bold text-[10px] border-2 border-white"
                                style={{
                                    backgroundColor: color,
                                    width: listing.price ? 'auto' : '28px',
                                    height: '28px',
                                    padding: listing.price ? '0 8px' : '0',
                                    minWidth: '28px',
                                }}
                            >
                                {listing.price ? formatPrice(listing.price) : <MapPin className="h-3.5 w-3.5" />}
                            </div>
                            {/* Arrow */}
                            <div
                                className="w-0 h-0 mx-auto"
                                style={{
                                    borderLeft: '6px solid transparent',
                                    borderRight: '6px solid transparent',
                                    borderTop: `6px solid ${color}`,
                                }}
                            />
                        </div>

                        {/* Info Window */}
                    </AdvancedMarker>
                );
            })}

            {/* Info Window for active marker */}
            {activeMarkerId && (() => {
                const listing = listings.find(l => l.id === activeMarkerId);
                if (!listing?.lat || !listing?.lng) return null;
                return (
                    <InfoWindow
                        position={{ lat: listing.lat, lng: listing.lng }}
                        onCloseClick={() => setActiveMarkerId(null)}
                        pixelOffset={[0, -40]}
                    >
                        <div className="max-w-[280px] p-1">
                            {listing.image && (
                                <img
                                    src={listing.image}
                                    alt={listing.title}
                                    className="w-full h-32 object-cover rounded-md mb-2"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                            )}
                            <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
                                {listing.title || 'Propiedad'}
                            </h3>
                            {listing.price > 0 && (
                                <p className="text-base font-bold text-emerald-600 mb-1">
                                    ${listing.price.toLocaleString()} MXN
                                </p>
                            )}
                            <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                                {listing.address}
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                    {listing.source}
                                </span>
                                {listing.sourceUrl && (
                                    <a
                                        href={listing.sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-500 hover:underline"
                                    >
                                        Ver →
                                    </a>
                                )}
                            </div>
                        </div>
                    </InfoWindow>
                );
            })()}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 border text-[11px] space-y-1">
                <div className="font-semibold text-gray-700 mb-1">
                    {geoListings.length} de {listings.length} con ubicación
                </div>
                {Object.entries({ Casa: '#10B981', Depto: '#6366F1', Terreno: '#F59E0B', Comercial: '#EF4444' }).map(([label, c]) => (
                    <div key={label} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                        <span className="text-gray-600">{label}</span>
                    </div>
                ))}
            </div>
        </>
    );
}

export function MapView({ listings, selectedId, onSelectListing, center, zoom = 12 }: MapViewProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

    if (!apiKey) {
        return (
            <div className="w-full h-full min-h-[400px] bg-card rounded-xl overflow-hidden shadow-sm border relative flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Clave de Google Maps no configurada</p>
                    <p className="text-xs opacity-60 mt-1">Agrega NEXT_PUBLIC_GOOGLE_MAPS_KEY en .env.local</p>
                </div>
            </div>
        );
    }

    // Calculate center from listings with coords, fallback to Chihuahua
    const mapCenter = useMemo(() => {
        if (center) return center;
        const geo = listings.filter(l => l.lat && l.lng);
        if (geo.length === 0) return CHIHUAHUA_CENTER;
        const avgLat = geo.reduce((sum, l) => sum + l.lat!, 0) / geo.length;
        const avgLng = geo.reduce((sum, l) => sum + l.lng!, 0) / geo.length;
        return { lat: avgLat, lng: avgLng };
    }, [center, listings]);

    return (
        <div className="w-full h-full min-h-[400px] bg-card rounded-xl overflow-hidden shadow-sm border relative">
            <APIProvider apiKey={apiKey}>
                <Map
                    defaultCenter={mapCenter}
                    defaultZoom={zoom}
                    mapId="mls-properties-map"
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                    zoomControl={true}
                    mapTypeControl={false}
                    streetViewControl={false}
                    fullscreenControl={true}
                    style={{ width: '100%', height: '100%' }}
                >
                    <MapContent
                        listings={listings}
                        selectedId={selectedId}
                        onSelectListing={onSelectListing}
                    />
                </Map>
            </APIProvider>
        </div>
    );
}
