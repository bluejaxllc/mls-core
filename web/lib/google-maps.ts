/**
 * Google Maps is intentionally disabled for this application.
 *
 * Keep the URL helpers centralized so historical listing data cannot trigger
 * billable Google Maps image requests when it is rendered.
 */
export const GOOGLE_MAPS_DISABLED = true;

export function isGoogleMapsUrl(value?: string | null): boolean {
    if (!value) return false;

    try {
        const url = new URL(value, 'https://mls.bluejax.ai');
        const host = url.hostname.toLowerCase();
        const path = url.pathname.toLowerCase();

        return host === 'maps.googleapis.com'
            || host === 'maps.google.com'
            || host === 'maps.gstatic.com'
            || host === 'streetviewpixels-pa.googleapis.com'
            || ((host === 'google.com' || host === 'www.google.com') && path.startsWith('/maps'));
    } catch {
        const normalized = value.toLowerCase();
        return normalized.includes('maps.googleapis.com')
            || normalized.includes('maps.google.com')
            || normalized.includes('google.com/maps');
    }
}

export function withoutGoogleMaps(values?: Array<string | null | undefined>): string[] {
    return (values ?? []).filter((value): value is string => Boolean(value) && !isGoogleMapsUrl(value));
}
