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

    async searchRealEstate(
        city: string = 'Chihuahua',
        stateCode: string = 'MLM-CHH',
        limit: number = 50,
        offset: number = 0,
        searchQuery?: string
    ): Promise<MLSearchResponse> {
        // Use official ML REST API (works from Vercel serverless)
        const token = await this.auth.getValidToken();

        // Build search params
        const params = new URLSearchParams({
            // MLM1459 = Real Estate category in Mexico
            category: 'MLM1459',
            state: stateCode,
            limit: Math.min(limit, 50).toString(),
            offset: offset.toString(),
        });

        if (searchQuery) {
            params.append('q', searchQuery);
        }

        // City-specific filtering
        const cityMap: Record<string, string> = {
            'Chihuahua': 'TUxNQ0NISjkzMTU',
            'Ciudad Juárez': 'TUxNQ0NKVTg5OTQ',
            'Delicias': 'TUxNQ0RFTDg1MTI',
            'Cuauhtémoc': 'TUxNQ0NVQTkwMzE',
        };
        if (cityMap[city]) {
            params.append('city', cityMap[city]);
        }

        try {
            const url = `${this.baseUrl}/sites/MLM/search?${params.toString()}`;
            console.log(`[ML Client] 🔍 API search: ${url.substring(0, 100)}...`);

            const { data } = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${token}` },
                timeout: 8000,
            });

            const results: MLRealEstateItem[] = (data.results || []).map((item: any) => ({
                id: item.id,
                title: item.title,
                price: item.price,
                currency_id: item.currency_id || 'MXN',
                location: {
                    city: { name: item.location?.city?.name || city },
                    state: { name: item.location?.state?.name || 'Chihuahua', id: stateCode },
                    address_line: item.address?.city_name || item.location?.address_line || '',
                },
                pictures: (item.pictures || []).map((p: any) => ({
                    id: p.id,
                    url: p.url || p.secure_url || '',
                    secure_url: p.secure_url || p.url || '',
                    size: p.size || '',
                    max_size: p.max_size || '',
                })),
                attributes: (item.attributes || []).map((a: any) => ({
                    id: a.id,
                    name: a.name || a.value_name || '',
                    value_id: a.value_id,
                    value_name: a.value_name || '',
                })),
                permalink: item.permalink || '',
            }));

            console.log(`[ML Client] ✅ API returned ${results.length} items (total: ${data.paging?.total || 0})`);

            return {
                site_id: data.site_id || 'MLM',
                query: searchQuery || city,
                paging: data.paging || { total: 0, offset, limit },
                results,
            };
        } catch (error: any) {
            const status = error.response?.status;
            const errMsg = error.response?.data?.message || error.message;
            console.error(`[ML Client] ❌ API search failed (${status}): ${errMsg}`);

            // If 401/403, token might be invalid — let auth handle refresh on next call
            if (status === 401 || status === 403) {
                console.log('[ML Client] Token may be invalid. Will attempt refresh on next request.');
            }

            throw new Error(`ML API search failed: ${errMsg}`);
        }
    }

    async getItemDetails(itemId: string): Promise<MLRealEstateItem> {
        try {
            const token = await this.auth.getValidToken();
            const { data } = await axios.get(`${this.baseUrl}/items/${itemId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return data;
        } catch (error: any) {
            console.error(`[ML Client] ❌ Failed to get item ${itemId}:`, error.response?.data || error.message);
            throw new Error(`Failed to get item details for ${itemId}`);
        }
    }

    async getItemDescription(itemId: string): Promise<string> {
        try {
            const token = await this.auth.getValidToken();
            const { data } = await axios.get(`${this.baseUrl}/items/${itemId}/description`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return data.plain_text || data.text || '';
        } catch (error: any) {
            return '';
        }
    }
}
