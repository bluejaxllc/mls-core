'use client';
import { useLanguage } from '@/lib/i18n';
import { authFetch } from '@/lib/api';
import { Save, X, MapPin, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
// import { usePlacesWidget } from 'react-google-autocomplete'; // Removed unused
import { AddressAutocomplete, type AddressAutocompleteRef } from '@/components/listings/AddressAutocomplete';
import { AddressSearchPopover } from '@/components/listings/AddressSearchPopover';
import { MapPreview } from '@/components/listings/MapPreview';
import { CHIHUAHUA_CITIES, CHIHUAHUA_ZIP_CODES } from '@/lib/chihuahua-locations';
import { AnimatedCard, AnimatedButton, AnimatedInput } from '@/components/ui/animated';
import { ImageCarousel } from '@/components/ui/ImageCarousel';
import { AnimatePresence } from 'framer-motion';

export default function NewListingPage() {
    const { t } = useLanguage();
    const router = useRouter();
    // Fix: access searchParams via hook in Next.js 13+ client components if needed, or window.location
    // simplified for client-side usage
    const { data: session }: any = useSession();
    const [loading, setLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [formData, setFormData] = useState<{
        title: string;
        price: string;
        description: string;
        address: string;
        city?: string;
        zipCode?: string;
        type: string;
        mapUrl?: string;
        images?: string[];
    }>({
        title: '',
        price: '',
        description: '',
        address: '',
        city: '',
        zipCode: '',
        type: 'commercial',
        mapUrl: '',
        images: []
    });

    // Handle Import Param
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const importId = searchParams.get('import');
        if (importId) {
            setLoading(true);
            fetch('/data/properties.json')
                .then(res => res.json())
                .then((data: any[]) => {
                    const found = data.find(p => p.id === importId);
                    if (found) {
                        setFormData(prev => ({
                            ...prev,
                            title: found.title,
                            description: found.description,
                            price: found.price?.toString() || '',
                            address: found.address,
                            city: found.city,
                            type: found.propertyType?.toLowerCase() || 'commercial',
                            images: found.image ? [found.image] : [],
                            mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(found.address)}`
                        }));
                        // Trigger AI analysis for the imported address
                        if (found.address) {
                            runAddressAI(found.address);
                        }
                    }
                })
                .finally(() => setLoading(false));
        }
    }, []);

    const buildStreetViewAndSatelliteUrls = useCallback((lat: number, lng: number): string[] => {
        const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
        if (!key) return [];
        const size = '800x600';
        const streetView0 = `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${lat},${lng}&fov=90&heading=0&key=${key}`;
        const streetView180 = `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${lat},${lng}&fov=90&heading=180&key=${key}`;
        const satellite = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=20&size=${size}&maptype=satellite&key=${key}`;
        return [streetView0, streetView180, satellite];
    }, []);

    const generateAIContent = useCallback(async (
        currentAddress: string,
        currentType: string,
        opts?: { lat?: number; lng?: number; city?: string; zipCode?: string; forceOverwrite?: boolean }
    ) => {
        console.log('[DEBUG] generateAIContent called', { currentAddress, opts });
        setIsGenerating(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const body: { address: string; type: string; lat?: number; lng?: number; city?: string; zipCode?: string } = {
                address: currentAddress,
                type: currentType
            };
            if (opts?.lat != null) body.lat = opts.lat;
            if (opts?.lng != null) body.lng = opts.lng;
            if (opts?.city) body.city = opts.city;
            if (opts?.zipCode) body.zipCode = opts.zipCode;

            if (opts?.city) body.city = opts.city;
            if (opts?.zipCode) body.zipCode = opts.zipCode;

            // Use authFetch to properly attach headers (including dev fallback)
            // Note: authFetch returns parsed JSON directly
            const data = await authFetch('/api/ai/generate', {
                method: 'POST',
                body: JSON.stringify(body)
            }, (session as any)?.accessToken);

            // Legacy check if authFetch returned null or failed silently (it usually throws)
            if (!data) return;

            /* 
            // OLD FETCH LOGIC REMOVED
            const res = await fetch(`${API_URL}/api/ai/generate`, { ... });
            */

            console.log('[DEBUG] AI Response Data:', data);

            let images: string[] = [];
            const lat = data.lat ?? opts?.lat;
            const lng = data.lng ?? opts?.lng;
            console.log('[DEBUG] Using Coordinates for Images:', { lat, lng });

            if (lat != null && lng != null) {
                images = buildStreetViewAndSatelliteUrls(lat, lng);
                console.log('[DEBUG] Built Image URLs:', images);
            }
            if (images.length === 0) {
                console.log('[DEBUG] No images built, falling back to Unsplash');
                const fallback = [
                    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=800&q=80'
                ];
                images = fallback;
            }

            let cityValue = (data.city || '').trim();
            if (cityValue) {
                const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
                const nCity = normalize(cityValue);
                if (!CHIHUAHUA_CITIES.some(c => c.value === cityValue)) {
                    const matched = CHIHUAHUA_CITIES.find(c => {
                        const nName = normalize(c.name);
                        const nVal = normalize(c.value);
                        return nName === nCity || nVal === nCity || nName.includes(nCity) || nCity.includes(nName) || nVal.includes(nCity) || nCity.includes(nVal);
                    });
                    if (matched) cityValue = matched.value;
                }
            }

            const force = opts?.forceOverwrite ?? false;

            setFormData(prev => ({
                ...prev,
                // Logic: Only overwrite with NEW data if it exists. If new data is missing, KEEP OLD.
                title: (force && data.title) ? data.title : (prev.title || data.title),
                description: (force && data.description) ? data.description : (prev.description || data.description),
                price: (force && data.price != null) ? String(data.price) : (prev.price || (data.price != null ? String(data.price) : '')),
                type: data.detectedType ?? prev.type,
                city: (force && cityValue) ? cityValue : (prev.city || cityValue),
                zipCode: (force && data.zipCode) ? data.zipCode : (prev.zipCode || data.zipCode),

                // Fix: Force overwrite if current images are stock (unsplash) or missing
                images: (images.length > 0 &&
                    (force || !prev.images || prev.images.length === 0 || prev.images.some(img => img.includes('unsplash') || img.includes('maps.googleapis'))))
                    ? images
                    : (prev.images || [])
            }));
        } catch (error) {
            console.error('AI Gen failed', error);
        } finally {
            setIsGenerating(false);
        }
    }, [buildStreetViewAndSatelliteUrls]);

    const [inputValue, setInputValue] = useState(formData.address);

    // Fix: Sync inputValue with formData.address (crucial for Import functionality)
    useEffect(() => {
        if (formData.address && formData.address !== inputValue) {
            setInputValue(formData.address);
        }
    }, [formData.address]);

    const [showAddressSearch, setShowAddressSearch] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [debugInfo, setDebugInfo] = useState<string>('Ready');
    const addressInputRef = useRef<AddressAutocompleteRef>(null);
    const formTypeRef = useRef(formData.type);
    formTypeRef.current = formData.type;

    const handleAddressChange = useCallback((val: string) => {
        setInputValue(val);
    }, []);

    const geocodeAddress = useCallback((address: string): Promise<{ city: string; zipCode: string; lat: number; lng: number } | null> => {
        return new Promise((resolve) => {
            try {
                if (typeof window === 'undefined' || !(window as any).google?.maps?.Geocoder) {
                    console.warn('Google Maps Geocoder not available');
                    resolve(null);
                    return;
                }
                const geocoder = new (window as any).google.maps.Geocoder();
                geocoder.geocode({ address }, (results: any[] | null, status: string) => {
                    if (status !== 'OK' || !results?.[0]) {
                        console.warn('Geocoding failed status:', status);
                        resolve(null);
                        return;
                    }
                    const r = results[0];
                    let city = '';
                    let zipCode = '';
                    if (r.address_components) {
                        for (const c of r.address_components) {
                            if (c.types.includes('locality')) city = city || c.long_name;
                            if (!city && c.types.includes('sublocality')) city = c.long_name;
                            if (!city && c.types.includes('administrative_area_level_2')) city = c.long_name;
                            if (!city && c.types.includes('administrative_area_level_1')) city = c.long_name;
                            if (c.types.includes('postal_code')) zipCode = zipCode || c.short_name;
                        }
                    }
                    const loc = r.geometry?.location;
                    const lat = typeof loc?.lat === 'function' ? loc.lat() : loc?.lat;
                    const lng = typeof loc?.lng === 'function' ? loc.lng() : loc?.lng;
                    if (lat != null && lng != null) {
                        resolve({ city, zipCode, lat, lng });
                    } else {
                        resolve(city || zipCode ? { city, zipCode, lat: 0, lng: 0 } : null);
                    }
                });
            } catch (error) {
                console.error('Geocode crash:', error);
                resolve(null);
            }
        });
    }, []);

    const matchCityToChihuahua = useCallback((rawCity: string): string => {
        if (!rawCity.trim()) return '';
        const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
        const nCity = normalize(rawCity);
        if (CHIHUAHUA_CITIES.some(c => c.value === rawCity)) return rawCity;
        const matched = CHIHUAHUA_CITIES.find(c => {
            const nName = normalize(c.name);
            const nVal = normalize(c.value);
            return nName === nCity || nVal === nCity || nName.includes(nCity) || nCity.includes(nName) || nVal.includes(nCity) || nCity.includes(nVal);
        });
        return matched ? matched.value : rawCity;
    }, []);

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setFormData(prev => ({ ...prev, type: val }));
        formTypeRef.current = val; // Sync ref for AI generation

        // Fix: Re-run AI generator if we already have an address
        const currentAddr = inputValue || formData.address;
        if (currentAddr) {
            console.log('[DEBUG] Type changed, regenerating content for:', val);
            generateAIContent(currentAddr, val, { forceOverwrite: true });
        }
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCity = e.target.value;
        setFormData(prev => ({
            ...prev,
            city: newCity,
            zipCode: '' // Reset zip on city change
        }));
    };

    const availableZipCodes = useMemo(() => {
        if (!formData.city) return [];
        const baseCodes = CHIHUAHUA_ZIP_CODES[formData.city] || [];
        // Ensure the current zipCode (e.g. from Google) is available in the list
        if (formData.zipCode && !baseCodes.includes(formData.zipCode)) {
            return [...baseCodes, formData.zipCode].sort();
        }
        return baseCodes;
    }, [formData.city, formData.zipCode]);

    const runAddressAI = useCallback(async (val: string) => {
        console.log('[DEBUG] runAddressAI started for:', val);
        if (!val) return;
        setFormData(prev => ({ ...prev, address: val, mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(val)}` }));

        // STRATEGY: Fire AI generation IMMEDIATELY (Do not wait for Google)
        console.log('[DEBUG] Triggering Immediate AI Generation');
        generateAIContent(val, formTypeRef.current);

        // Check Google Maps in background for precise City/Zip (Non-blocking enhancement)
        console.log('[DEBUG] Starting background geocode...');
        geocodeAddress(val).then(geo => {
            console.log('[DEBUG] Background geocode result:', geo);
            if (geo) {
                const finalCity = geo.city ? (matchCityToChihuahua(geo.city) || geo.city) : '';

                // Generate Images from Coordinates
                let newImages: string[] = [];
                if (geo.lat && geo.lng) {
                    newImages = buildStreetViewAndSatelliteUrls(geo.lat, geo.lng);
                }

                setFormData(prev => ({
                    ...prev,
                    city: finalCity || prev.city || (geo.city ?? ''),
                    zipCode: geo.zipCode || prev.zipCode,
                    // Logic: Overwrite if current images are missing, OR if they are Unsplash (stock), OR if they are Maps (refresh)
                    // Do NOT overwrite if user uploaded something else (e.g. from local blob or other source)
                    images: (newImages.length > 0 &&
                        (!prev.images || prev.images.length === 0 || prev.images.some(img => img.includes('unsplash') || img.includes('maps.googleapis'))))
                        ? newImages
                        : (prev.images || [])
                }));
            }
        }).catch(err => {
            console.warn('[DEBUG] Background geocode failed/timed out', err);
        });

    }, [geocodeAddress, matchCityToChihuahua, generateAIContent]);

    const handleAddressBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        const val = e.target.value?.trim() ?? '';
        setInputValue(val);
        if (!val) return;
        runAddressAI(val);
    }, [runAddressAI]);

    const handleAddressKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = e.currentTarget.value?.trim() ?? '';
            setInputValue(val);
            if (!val) return;
            runAddressAI(val);
        }
    }, [runAddressAI]);

    const onPlaceSelected = useCallback((place: any) => {
        console.log('NewListingPage: Place Selected', place); // DEBUG LOG
        setDebugInfo(`Place Selected: ${place.name || 'Unnamed'}`);

        let extractedCity = '';
        let extractedZip = '';
        let newAddr = '';
        let newUrl = '';

        if (place.formatted_address) {
            newAddr = place.formatted_address;
            newUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(newAddr)}`;
        }

        if (place.address_components) {
            const compLog = place.address_components.map((c: any) => `${c.types[0]}:${c.short_name}`).join(', ');
            setDebugInfo(prev => prev + ' | Components: ' + compLog);

            console.log('Place Components:', place.address_components); // DEBUG
            for (const comp of place.address_components) {
                if (comp.types.includes('locality')) extractedCity = comp.long_name;
                // Fallbacks for city if locality is missing
                if (!extractedCity && comp.types.includes('sublocality')) extractedCity = comp.long_name;
                if (!extractedCity && comp.types.includes('administrative_area_level_2')) extractedCity = comp.long_name; // Municipality
                if (!extractedCity && comp.types.includes('administrative_area_level_1')) extractedCity = comp.long_name; // State (often City name matches State in Chihuahua)

                if (comp.types.includes('postal_code')) extractedZip = comp.short_name;
            }
        }

        // HELPER: Normalize string (remove accents, lowercase)
        const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

        // Define rawCity
        const rawCity = extractedCity || '';

        // RELAXED MATCHING: Compare normalized versions
        const normalizedRawCity = normalize(rawCity);

        const matchedCity = CHIHUAHUA_CITIES.find(c => {
            const normName = normalize(c.name);
            const normValue = normalize(c.value);
            return normName === normalizedRawCity ||
                normValue === normalizedRawCity ||
                normalizedRawCity.includes(normName) ||
                normName.includes(normalizedRawCity);
        })?.value;

        // Use matched city if found, otherwise use the raw city from Google
        // This ensures we always display what Google tells us
        const finalCity = matchedCity || rawCity;

        setInputValue(newAddr); // Update UI
        setFormData(prev => ({
            ...prev,
            address: newAddr,
            mapUrl: newUrl,
            city: finalCity || prev.city,
            zipCode: extractedZip || prev.zipCode
        }));

        // Auto-fill title, price, type, city, zip, description and Street View + Birds Eye photos via AI
        const loc = place.geometry?.location;
        const lat = typeof loc?.lat === 'function' ? loc.lat() : loc?.lat;
        const lng = typeof loc?.lng === 'function' ? loc.lng() : loc?.lng;
        generateAIContent(newAddr, formData.type, {
            lat: lat ?? undefined,
            lng: lng ?? undefined,
            city: finalCity || undefined,
            zipCode: extractedZip || undefined
        });
    }, [formData.type, generateAIContent]);

    // usePlacesWidget logic moved to child component

    const handleSubmit = async (e: React.FormEvent) => {
        // e.preventDefault();

        // Manual validation check to ensure browser UI shows up if needed
        const form = e.currentTarget as HTMLFormElement;
        if (!form.checkValidity()) {
            // form.reportValidity(); // Optional: trigger browser default tooltip
            e.preventDefault();
            return;
        }
        e.preventDefault();

        setLoading(true);
        try {
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            // Use current inputs
            const currentAddress = addressInputRef.current?.getValue() ?? inputValue ?? formData.address;

            // Validate required fields explicitly
            if (!formData.title || !formData.price || !formData.description) {
                toast.error('Por favor complete los campos requeridos (Título, Precio, Descripción).');
                setLoading(false);
                return;
            }

            const payload = { ...formData, address: currentAddress };

            // AUTH FIX: Use session token if available, otherwise use a fallback mock token for dev
            const token = session?.accessToken || 'mock-jwt-token';
            console.log('[DEBUG] Using Auth Token:', token === 'mock-jwt-token' ? 'MOCK_TOKEN' : 'SESSION_TOKEN');

            const res = await fetch(`${API_URL}/api/protected/listings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errTxt = await res.text();
                throw new Error('Failed to create listing: ' + errTxt);
            }
            const data = await res.json();
            router.push('/listings/' + data.id);
        } catch (error) {
            console.error('Submit error:', error);
            toast.error('Error al crear la propiedad. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    // const setRefs = ... moved to child

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-10">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Nueva Propiedad</h2>
                    <p className="text-muted-foreground">Crear un nuevo listado comercial</p>
                </div>
                <AnimatedButton
                    variant="secondary"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm"
                >
                    <X className="h-4 w-4" /> Cancelar
                </AnimatedButton>
            </div>

            <form
                onSubmit={handleSubmit}
                className="max-w-4xl mx-auto space-y-8 relative z-10 pb-20"
            >

                {/* HERO ADDRESS INPUT - plain input (no Google here) to avoid typing glitches */}
                <div className="space-y-4 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 p-4 md:p-8 rounded-xl border border-blue-500/15 shadow-sm relative z-20">
                    <label className="text-lg font-semibold text-blue-400 flex flex-wrap justify-between items-center gap-2">
                        <span>Dirección de la Propiedad (Comience aquí)</span>
                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                type="button"
                                onClick={() => setShowAddressSearch((v) => !v)}
                                className="text-sm text-blue-600 hover:text-blue-800 underline"
                            >
                                Buscar dirección con Google
                            </button>
                            {isGenerating && (
                                <span className="text-blue-600 text-sm font-mono flex items-center gap-2 animate-pulse">
                                    <Sparkles className="h-4 w-4" /> Analizando Mercado...
                                </span>
                            )}
                        </div>
                    </label>
                    <div className="relative">
                        <AddressAutocomplete
                            ref={addressInputRef}
                            value={inputValue}
                            onChange={handleAddressChange}
                            onBlur={handleAddressBlur}
                            onKeyDown={handleAddressKeyDown}
                            placeholder="Ingrese la dirección completa..."
                            className="w-full pl-8 md:pl-12 pr-4 py-3 md:py-4 text-base md:text-xl bg-card text-foreground border-2 border-blue-500/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40 focus:shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)] placeholder:text-muted-foreground/50"
                        />
                        <AddressSearchPopover
                            open={showAddressSearch}
                            onClose={() => setShowAddressSearch(false)}
                            onPlaceSelected={onPlaceSelected}
                        />
                        <MapPreview address={inputValue} />
                    </div>
                </div>

                {/* HERO CAROUSEL SECTION */}
                <div className="w-full">
                    {formData.images && formData.images.length > 0 && (
                        <div className="relative w-full rounded-xl overflow-hidden shadow-lg border-2 border-blue-500/10 bg-card group animate-in fade-in zoom-in duration-500">
                            <ImageCarousel
                                images={formData.images}
                                onRemove={(idx) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        images: prev.images?.filter((_, i) => i !== idx)
                                    }));
                                }}
                                className="aspect-[21/9] h-[250px] sm:h-[350px] md:h-[500px]"
                            />
                            {/* File Upload Overlay Button */}
                            <div className="absolute top-4 right-4 z-40">
                                <label className="cursor-pointer bg-card/90 hover:bg-card text-foreground px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-md text-xs md:text-sm font-medium flex items-center gap-2 transition-all backdrop-blur-sm border border-blue-500/20">
                                    <Sparkles className="w-4 h-4 text-blue-500" />
                                    <span>Agregar Fotos</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                            if (!e.target.files?.[0]) return;
                                            const file = e.target.files[0];
                                            const form = new FormData();
                                            form.append('file', file);
                                            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                                            const res = await fetch(`${API_URL}/api/upload`, { method: 'POST', body: form });
                                            const data = await res.json();
                                            setFormData(prev => ({ ...prev, images: [...(prev.images || []), data.url] }));
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Form Area - Takes up 2/3 space now if we want, or full width */}
                    <div className="md:col-span-3 space-y-6">
                        <AnimatedCard className="p-4 md:p-6 space-y-6">
                            {/* Row 1: Title & Type */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-medium">Título de la Propiedad</label>
                                    <AnimatedInput
                                        type="text"
                                        required
                                        autoComplete="off"
                                        value={formData.title || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full bg-card relative z-20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Tipo de Propiedad</label>
                                    <select
                                        value={formData.type || 'commercial'}
                                        onChange={handleTypeChange}
                                        className="w-full px-4 py-3 bg-card border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 relative z-20"
                                    >
                                        <option value="commercial">Comercial</option>
                                        <option value="residential">Residencial</option>
                                        <option value="industrial">Industrial</option>
                                        <option value="land">Terreno</option>
                                        <option value="office">Oficina</option>
                                    </select>
                                </div>
                            </div>

                            {/* Manual AI Trigger Button */}
                            <div className="flex justify-end -mt-4 mb-2">
                                <button
                                    type="button"
                                    onClick={() => generateAIContent(inputValue || formData.address, formData.type, { forceOverwrite: true })}
                                    disabled={isGenerating || !formData.address}
                                    className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 disabled:opacity-50 font-medium transition-colors"
                                >
                                    <Sparkles className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                                    {isGenerating ? 'Generando...' : 'Re-generar con IA'}
                                </button>
                            </div>

                            {/* Row 2: Price & Location */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Precio (MXN)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                        <AnimatedInput
                                            type="number"
                                            required
                                            autoComplete="off"
                                            value={formData.price || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                            className="w-full pl-7 bg-card relative z-20"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Ciudad</label>
                                    <select
                                        value={formData.city || ''}
                                        onChange={handleCityChange}
                                        className="w-full px-4 py-3 bg-card border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 relative z-20"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {formData.city && !CHIHUAHUA_CITIES.find(c => c.value === formData.city) && (
                                            <option value={formData.city}>{formData.city} (Detectada)</option>
                                        )}
                                        {CHIHUAHUA_CITIES.map(c => (
                                            <option key={c.value} value={c.value}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Código Postal</label>
                                    <select
                                        value={formData.zipCode || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                                        className="w-full px-4 py-3 bg-card border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 relative z-20"
                                        disabled={!formData.city}
                                    >
                                        <option value="">{formData.city ? 'Seleccionar...' : '...'}</option>
                                        {availableZipCodes.map(code => (
                                            <option key={code} value={code}>{code}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Row 3: Description & Map URL */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">Descripción</label>
                                    <textarea
                                        required
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        rows={6}
                                        className="w-full px-4 py-3 bg-card border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 relative z-20"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-muted-foreground">URL del Mapa (Referencia)</label>
                                    <AnimatedInput
                                        type="url"
                                        value={formData.mapUrl || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, mapUrl: e.target.value }))}
                                        className="w-full bg-muted/30 text-xs text-muted-foreground relative z-20"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </AnimatedCard>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <AnimatedButton
                        type="button"
                        variant="secondary"
                        onClick={() => router.back()}
                        className="text-sm relative z-20"
                    >
                        Cancelar
                    </AnimatedButton>
                    <AnimatedButton
                        type="submit"
                        variant="primary"
                        isLoading={loading}
                        className="text-sm font-medium flex items-center gap-2 relative z-20"
                    >
                        {!loading && <Save className="h-4 w-4" />} Crear Propiedad
                    </AnimatedButton>
                </div>
                {/* Full Screen Image Modal */}
                {
                    selectedImage && (
                        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedImage(null)}>
                            <button
                                type="button"
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 rounded-full bg-white/10 p-2 backdrop-blur-sm"
                            >
                                <X className="h-8 w-8" />
                            </button>
                            <img
                                src={selectedImage}
                                className="max-h-[90vh] max-w-[90vw] object-contain rounded-md shadow-2xl"
                                onClick={(e) => e.stopPropagation()} // Prevent clicking image from closing
                            />
                        </div>
                    )
                }
            </form >



            <Script
                src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`}
                strategy="afterInteractive"
            />
        </div >
    );
}
