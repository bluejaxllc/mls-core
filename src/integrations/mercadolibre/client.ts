import axios from 'axios';
import { MercadoLibreAuth } from './auth';

export interface MLLocation {
    city: { name: string };
    state: { name: string; id: string };
    address_line?: string;
}

export interface MLPicture {
    id: string;
    url: string;
    secure_url: string;
    size: string;
    max_size: string;
}

export interface MLAttribute {
    id: string;
    name: string;
    value_id?: string;
    value_name?: string;
    value_struct?: any;
}

export interface MLRealEstateItem {
    id: string;
    title: string;
    price: number;
    currency_id: string;
    location: MLLocation;
    pictures: MLPicture[];
    attributes: MLAttribute[];
    permalink: string;
    seller_address?: {
        city: { name: string };
        state: { name: string };
        address_line?: string;
    };
}

export interface MLSearchResponse {
    site_id: string;
    query: string;
    paging: {
        total: number;
        offset: number;
        limit: number;
    };
    results: MLRealEstateItem[];
}

export class MercadoLibreClient {
    private auth: MercadoLibreAuth;
    private baseUrl = 'https://api.mercadolibre.com';

    constructor(auth: MercadoLibreAuth) {
        this.auth = auth;
    }

    // Search real estate in specific city and state
    async searchRealEstate(
        city: string = 'Chihuahua',
        stateCode: string = 'MLM-CHH', // Chihuahua state code
        limit: number = 50,
        offset: number = 0
    ): Promise<MLSearchResponse> {
        try {
            const token = await this.auth.getValidToken();

            const params: any = {
                category: 'MLM1459', // Real Estate category in Mexico
                limit: Math.min(limit, 50), // Max 50 per request
                offset: offset
            };

            // Add location filters
            if (stateCode) {
                params.state = stateCode;
            }

            if (city) {
                params.city = city;
            }

            console.log('[ML Client] Searching with params:', params);

            const { data }: any = await axios.get(`${this.baseUrl}/sites/MLM/search`, {
                params
            });

            console.log(`[ML Client] ✅ Found ${data.results.length} items (${data.paging.total} total)`);
            return data;

        } catch (error: unknown) {
            const err = error as any;
            console.error('[ML Client] ❌ Search failed!');
            if (err.response) {
                console.error('   Status:', err.response.status);
                console.error('   Data:', JSON.stringify(err.response.data, null, 2));
            } else {
                console.error('   Error:', err.message);
            }
            throw new Error('Failed to search real estate listings');
        }
    }

    // Get detailed information for a specific item
    async getItemDetails(itemId: string): Promise<MLRealEstateItem> {
        try {
            const token = await this.auth.getValidToken();

            const { data }: any = await axios.get(`${this.baseUrl}/items/${itemId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return data;

        } catch (error: unknown) {
            const err = error as any;
            console.error(`[ML Client] ❌ Failed to get item ${itemId}:`, err.response?.data || err.message);
            throw new Error(`Failed to get item details for ${itemId}`);
        }
    }

    // Get item description (separate endpoint)
    async getItemDescription(itemId: string): Promise<string> {
        try {
            const token = await this.auth.getValidToken();

            const { data }: any = await axios.get(`${this.baseUrl}/items/${itemId}/description`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            return data.plain_text || data.text || '';

        } catch (error: unknown) {
            const err = error as any;
            console.warn(`[ML Client] ⚠️  No description for item ${itemId}`);
            return '';
        }
    }
}
