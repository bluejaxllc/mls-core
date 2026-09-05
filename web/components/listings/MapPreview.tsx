import { memo } from 'react';
import { MapPin } from 'lucide-react';

interface MapPreviewProps {
    address: string;
    onUpdateStart?: () => void;
}

const MapPreviewComponent = ({ address }: MapPreviewProps) => {
    if (!address) return null;

    return (
        <div className="mt-4 h-24 rounded-lg border-2 border-border bg-muted/40 flex items-center justify-center text-muted-foreground">
            <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 opacity-60" />
                <span>Vista de mapa desactivada</span>
            </div>
        </div>
    );
};

export const MapPreview = memo(MapPreviewComponent);
