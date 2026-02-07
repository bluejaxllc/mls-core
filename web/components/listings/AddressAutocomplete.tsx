'use client';

import { MapPin } from 'lucide-react';
import { useRef, forwardRef, useImperativeHandle } from 'react';

interface AddressAutocompleteProps {
    value: string;
    onChange: (val: string) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onPlaceSelected?: (place: any) => void;
    placeholder?: string;
    className?: string;
}

export type AddressAutocompleteRef = { focus: () => void; getValue: () => string };

/**
 * Plain address input - no Google Autocomplete on this field to avoid
 * DOM conflicts that cause typing to glitch. Use AddressSearchPopover
 * for Google Places suggestions.
 */
const AddressAutocompleteComponent = forwardRef<AddressAutocompleteRef, AddressAutocompleteProps>(({
    value,
    onChange,
    onBlur,
    onKeyDown,
    onPlaceSelected, // Kept in props interface but unused in plain input
    placeholder,
    className
}, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => inputRef.current?.focus(),
        getValue: () => inputRef.current?.value ?? ''
    }));

    return (
        <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 h-6 w-6 z-30 pointer-events-none" />
            <input
                ref={inputRef}
                type="text"
                required
                autoComplete="street-address"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                className={className}
            />
        </div>
    );
});

AddressAutocompleteComponent.displayName = 'AddressAutocomplete';

export const AddressAutocomplete = AddressAutocompleteComponent;
