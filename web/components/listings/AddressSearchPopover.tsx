'use client';

import { MapPin, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface AddressSearchPopoverProps {
    open: boolean;
    onClose: () => void;
    onPlaceSelected: (place: { formatted_address?: string; address_components?: any[]; name?: string; [k: string]: any }) => void;
    className?: string;
}

/** Manual address fallback retained after Google Places was disabled. */
export function AddressSearchPopover({ open, onClose, onPlaceSelected, className }: AddressSearchPopoverProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState('');

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    if (!open) return null;

    const useAddress = () => {
        const address = value.trim();
        if (!address) return;
        onPlaceSelected({ formatted_address: address, name: address });
        onClose();
    };

    return (
        <div className={`absolute top-full left-0 right-0 mt-2 p-3 bg-card border border-blue-500/20 rounded-lg shadow-lg z-50 ${className ?? ''}`}>
            <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
                <span className="text-sm font-medium text-foreground">Ingresar dirección manualmente</span>
                <button type="button" onClick={onClose} className="ml-auto p-1 rounded hover:bg-muted" aria-label="Cerrar">
                    <X className="h-4 w-4" />
                </button>
            </div>
            <div className="flex gap-2">
                <input
                    ref={inputRef}
                    type="text"
                    autoComplete="street-address"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            useAddress();
                        }
                    }}
                    placeholder="Escriba la dirección completa..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button type="button" onClick={useAddress} className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700">
                    Usar
                </button>
            </div>
        </div>
    );
}
