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
        offset: number = 0
    ): Promise<MLSearchResponse> {
        try {
            await this.auth.getValidToken(); // Ensure valid token exists

            const params: any = {
                category: 'MLM1459',
                limit: Math.min(limit, 50),
                offset: offset
            };

            if (stateCode) params.state = stateCode;
            if (city) params.city = city;

            const { data } = await axios.get(`${this.baseUrl}/sites/MLM/search`, { params });
            return data;
        } catch (error: any) {
            console.error('[ML Client] ❌ Search failed:', error.response?.data || error.message);
            throw new Error('Failed to search real estate listings');
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
