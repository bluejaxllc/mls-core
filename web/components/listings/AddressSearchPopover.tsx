'use client';

import { MapPin, X } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

interface AddressSearchPopoverProps {
    open: boolean;
    onClose: () => void;
    onPlaceSelected: (place: { formatted_address?: string; address_components?: any[]; name?: string;[k: string]: any }) => void;
    className?: string;
}

/**
 * Separate input that has Google Places Autocomplete. Used in a popover
 * so the main address field stays a plain input (no typing glitches).
 */
export function AddressSearchPopover({ open, onClose, onPlaceSelected, className }: AddressSearchPopoverProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!open || !inputRef.current) return;

        const init = () => {
            if (typeof window === 'undefined' || !window.google?.maps?.places || !inputRef.current) return false;
            if (autoCompleteRef.current) return true;
            try {
                autoCompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
                    componentRestrictions: { country: 'mx' },
                    fields: ['formatted_address', 'geometry', 'address_components', 'name']
                });
                autoCompleteRef.current.addListener('place_changed', () => {
                    const place = autoCompleteRef.current?.getPlace();
                    if (place?.formatted_address) {
                        onPlaceSelected(place);
                        onClose();
                    }
                });
                setReady(true);
                return true;
            } catch (e) {
                console.error('AddressSearchPopover: init failed', e);
                return false;
            }
        };

        if (!init()) {
            const t = setInterval(() => {
                if (init()) clearInterval(t);
            }, 300);
            return () => clearInterval(t);
        }
    }, [open, onPlaceSelected, onClose]);

    // Reset autocomplete when popover closes so it's fresh next time
    useEffect(() => {
        if (!open) {
            autoCompleteRef.current = null;
            setReady(false);
        }
    }, [open]);

    if (!open) return null;

    return (
        <div className={`absolute top-full left-0 right-0 mt-2 p-3 bg-card border border-blue-500/20 rounded-lg shadow-lg z-50 ${className ?? ''}`}>
            <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
                <span className="text-sm font-medium text-foreground">Buscar dirección (Google)</span>
                <button type="button" onClick={onClose} className="ml-auto p-1 rounded hover:bg-muted" aria-label="Cerrar">
                    <X className="h-4 w-4" />
                </button>
            </div>
            <input
                ref={inputRef}
                type="text"
                autoComplete="off"
                placeholder="Escriba y seleccione una dirección..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
    );
}
