import crypto from 'crypto';

export class FingerprintService {

    /**
     * Generates a stable hash for a normalized address.
     * Case-insensitive, ignores whitespace and common punctuation.
     */
    generateAddressHash(address: string | null | undefined): string | null {
        if (!address) return null;

        // Normalize: lowercase, remove non-alphanumeric (except numbers), collapse spaces
        const normalized = address
            .toLowerCase()
            .replace(/[^\w\d\sñ]/g, '')
            .replace(/\s+/g, ' ')
            .trim();

        if (normalized.length < 5) return null; // Too short to be reliable

        return crypto.createHash('sha256').update(normalized).digest('hex');
    }

    /**
     * Generates a GeoHash-like string for coordinate matching.
     * Precision 4 decimal places gives ~11m precision, good for "same building" detection.
     */
    generateGeoHash(lat: number | null | undefined, lng: number | null | undefined): string | null {
        if (!lat || !lng) return null;

        // Round to 4 decimal places
        const latFixed = lat.toFixed(4);
        const lngFixed = lng.toFixed(4);

        return `${latFixed},${lngFixed}`;
    }

    /**
     * Generates a hash based on physical attributes (beds, baths, sqft).
     * Useful for finding duplicated listings with slightly different descriptions.
     */
    generateAttributeHash(attrs: {
        bedrooms?: number,
        bathrooms?: number,
        surface?: number,
        type?: string
    }): string {
        const parts = [
            attrs.type || 'unknown',
            attrs.bedrooms || 0,
            attrs.bathrooms || 0,
            Math.round(attrs.surface || 0) // Round sqft/sqm to nearest integer
        ];

        return crypto.createHash('md5').update(parts.join('|')).digest('hex');
    }
}

export const fingerprintService = new FingerprintService();
