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
        // Try to get auth token, but fall back to unauthenticated (public API works without auth)
        let token: string | null = null;
        try {
            token = await this.auth.getValidToken();
        } catch (e: any) {
            console.log('[ML Client] ⚠️ No auth token — using public API (lower rate limits)');
        }

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

            const headers: Record<string, string> = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const { data } = await axios.get(url, {
                headers,
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

            // If 401/403, return empty results gracefully instead of crashing
            if (status === 401 || status === 403) {
                console.log('[ML Client] ⚠️ Authentication required for ML API. Falling back to HTML Scraping.');
                return this.searchHTMLFallback(city, stateCode, limit, offset, searchQuery);
            }

            throw new Error(`ML API search failed: ${errMsg}`);
        }
    }

    private async searchHTMLFallback(
        city: string = 'Chihuahua',
        stateCode: string = 'MLM-CHH',
        limit: number = 50,
        offset: number = 0,
        searchQuery?: string
    ): Promise<MLSearchResponse> {
        try {
            console.log('[ML Client] 🌐 Using HTML fallback for search (Auth failed/Missing)');

            let url = 'https://inmuebles.mercadolibre.com.mx/chihuahua/chihuahua/';
            if (city !== 'Chihuahua') {
                const slug = city.toLowerCase().replace(/\s+/g, '-');
                url = `https://inmuebles.mercadolibre.com.mx/chihuahua/${slug}/`;
            }
            if (searchQuery) {
                const querySlug = searchQuery.toLowerCase().replace(/\s+/g, '-');
                url = `https://inmuebles.mercadolibre.com.mx/chihuahua/chihuahua/${querySlug}_NoIndex_True`;
            }

            if (offset > 0) {
                const mlOffset = offset + 1;
                if (url.includes('_NoIndex_True')) {
                    url = url.replace('_NoIndex_True', `_Desde_${mlOffset}_NoIndex_True`);
                } else {
                    url += `_Desde_${mlOffset}_NoIndex_True`;
                }
            }

            const { data: html } = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
                    'Accept-Language': 'es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7'
                },
                timeout: 15000
            });

            const prefix = '_n.ctx.r=';
            const startIdx = html.indexOf(prefix);
            if (startIdx < 0) {
                return { site_id: 'MLM', query: searchQuery || city, paging: { total: 0, offset, limit }, results: [] };
            }

            const remainder = html.substring(startIdx + prefix.length);
            let brackets = 0, inString = false, escape = false, started = false, jsonStr = '';

            for (let i = 0; i < remainder.length; i++) {
                const char = remainder[i];
                if (!escape && char === '"') inString = !inString;
                if (!inString) {
                    if (char === '{') { brackets++; started = true; }
                    if (char === '}') {
                        brackets--;
                        if (started && brackets === 0) {
                            jsonStr = remainder.substring(0, i + 1);
                            break;
                        }
                    }
                }
                escape = (char === '\\' && !escape);
            }

            if (!jsonStr) {
                return { site_id: 'MLM', query: searchQuery || city, paging: { total: 0, offset, limit }, results: [] };
            }

            const parsed = JSON.parse(jsonStr);
            const itemsArray = parsed.appProps?.pageProps?.initialState?.results || [];
            const results: MLRealEstateItem[] = [];

            for (const item of itemsArray) {
                if (item.id !== 'POLYCARD') continue;

                const meta = item.polycard?.metadata || {};
                const id = meta.id;
                if (!id) continue;

                const permalink = meta.url ? `https://${meta.url}` : '';

                const comps = item.polycard?.components || [];
                const title = comps.find((c: any) => c.id === 'title')?.title?.text || '';
                const priceObj = comps.find((c: any) => c.id === 'price')?.price?.current_price || {};
                const price = priceObj.value || 0;
                const currency_id = priceObj.currency || 'MXN';
                const locText = comps.find((c: any) => c.id === 'location')?.location?.text || '';

                const pics = item.polycard?.pictures?.pictures || [];
                const pictures: MLPicture[] = pics.map((p: any) => ({
                    id: p.id,
                    url: `https://http2.mlstatic.com/D_${p.id}-O.jpg`,
                    secure_url: `https://http2.mlstatic.com/D_${p.id}-O.jpg`,
                    size: '', max_size: ''
                }));

                const attributesText = comps.find((c: any) => c.id === 'attributes_list')?.attributes_list?.texts || [];
                const attributes: MLAttribute[] = attributesText.map((t: string, idx: number) => ({
                    id: `ATTR_${idx}`, name: t, value_name: t
                }));

                results.push({
                    id, title, price, currency_id, permalink, pictures, attributes,
                    location: {
                        city: { name: city },
                        state: { name: 'Chihuahua', id: stateCode },
                        address_line: locText
                    }
                });
            }

            const total = parsed.appProps?.pageProps?.initialState?.melidata_track?.event_data?.total || results.length;
            console.log(`[ML Client] ✅ HTML Fallback found ${results.length} items (Total: ${total})`);

            return {
                site_id: 'MLM', query: searchQuery || city,
                paging: { total, offset, limit }, results
            };
        } catch (error: any) {
            console.error('[ML Client] ❌ HTML Fallback failed:', error.message);
            return {
                site_id: 'MLM', query: searchQuery || city,
                paging: { total: 0, offset, limit }, results: []
            };
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
