import { fingerprintService } from './fingerprint';

// Types for Raw Extracted Data (before strict typing)
export interface RawListingData {
    externalId: string;
    url: string;
    rawJson?: any;
    title: string;
    description?: string;
    price?: string | number; // May be strings like "$1,500,000"
    address?: string;
    lat?: number | string;
    lng?: number | string;
    images?: string[];
    attributes?: {
        bedrooms?: number | string;
        bathrooms?: number | string;
        surface?: number | string;
        type?: string;
    };
}

export interface NormalizedData {
    title: string;
    description: string | null;
    price: number | null;
    address: string | null;
    lat: number | null;
    lng: number | null;
    geoHash: string | null;
    addressHash: string | null;
}

export class NormalizerService {

    normalize(data: RawListingData): NormalizedData {
        const price = this.parsePrice(data.price);
        const lat = this.parseCoord(data.lat);
        const lng = this.parseCoord(data.lng);
        const address = data.address?.trim() || null;

        return {
            title: data.title.trim(),
            description: data.description?.trim() || null,
            price,
            address,
            lat,
            lng,
            geoHash: fingerprintService.generateGeoHash(lat, lng),
            addressHash: fingerprintService.generateAddressHash(address),
        };
    }

    private parsePrice(raw: string | number | undefined): number | null {
        if (raw === undefined || raw === null) return null;
        if (typeof raw === 'number') return raw;

        // Remove non-numeric chars except period
        const clean = raw.replace(/[^0-9.]/g, '');
        const float = parseFloat(clean);
        return isNaN(float) ? null : float;
    }

    private parseCoord(raw: string | number | undefined): number | null {
        if (raw === undefined || raw === null) return null;
        if (typeof raw === 'number') return raw;

        const float = parseFloat(raw);
        return isNaN(float) ? null : float;
    }
}

export const normalizerService = new NormalizerService();
