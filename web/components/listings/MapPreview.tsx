import { useState, useEffect, memo } from 'react';

interface MapPreviewProps {
    address: string;
    onUpdateStart?: () => void;
}

const MapPreviewComponent = ({ address, onUpdateStart }: MapPreviewProps) => {
    const [debouncedAddress, setDebouncedAddress] = useState(address);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (address && address !== debouncedAddress) {
                // Signal start of update (e.g. to activate focus shield)
                onUpdateStart?.();
                setDebouncedAddress(address);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [address, debouncedAddress, onUpdateStart]);

    if (!debouncedAddress) return null;

    return (
        <div className="mt-4 h-64 rounded-lg border-2 border-white shadow-md overflow-hidden bg-gray-100">
            <iframe
                width="100%"
                height="100%"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(debouncedAddress)}&t=&z=18&ie=UTF8&iwloc=&output=embed`}
                frameBorder="0"
                scrolling="no"
                sandbox="allow-scripts allow-same-origin allow-popups"
                loading="lazy"
            ></iframe>
        </div>
    );
};

export const MapPreview = memo(MapPreviewComponent);
