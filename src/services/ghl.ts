
const GHL_API_URL = 'https://services.leadconnectorhq.com';
const API_VERSION = '2021-07-28';

export interface CreateLocationPayload {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    timezone?: string;
    firstName?: string;
    lastName?: string;
}

export class GHLService {
    private agencyKey: string;

    constructor(agencyKey: string) {
        this.agencyKey = agencyKey;
    }

    async createLocation(payload: CreateLocationPayload): Promise<any> {
        console.log('[GHL] Creating Location:', payload.name);

        const response = await fetch(`${GHL_API_URL}/locations/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.agencyKey}`,
                'Version': API_VERSION,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('[GHL] Create Location Failed:', JSON.stringify(data, null, 2));
            throw new Error(data.message || 'Failed to create location in GHL');
        }

        return data;
    }
}

// Singleton instance if env is available
export const ghlService = process.env.BLUE_JAX_AGENCY_KEY
    ? new GHLService(process.env.BLUE_JAX_AGENCY_KEY)
    : null;
