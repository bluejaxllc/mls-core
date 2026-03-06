import axios from 'axios';
import fs from 'fs';
import { parse } from 'node-html-parser';

const ZENROWS_API_KEY = process.env.ZENROWS_API_KEY;

export async function scrapeMLViaZenRows(city: string, propertyType: string, minPrice: string, maxPrice: string, q: string, maxItems: number): Promise<any[]> {
    if (!ZENROWS_API_KEY) {
        console.log('[ZenRows] No API key found, skipping scrape.');
        return [];
    }

    const typeMap: Record<string, string> = {
        'house': 'casas/venta',
        'apartment': 'departamentos/venta',
        'land': 'terrenos/venta',
        'commercial': 'locales-comerciales/venta',
        'industrial': 'bodegas/venta',
    };

    let path = 'inmuebles/venta';
    if (propertyType && typeMap[propertyType.toLowerCase()]) {
        path = typeMap[propertyType.toLowerCase()];
    }

    const formattedCity = (city || 'chihuahua').toLowerCase().replace(/\s+/g, '-');
    const state = 'chihuahua';
    let url = `https://inmuebles.mercadolibre.com.mx/${path}/${state}/${formattedCity}/`;

    if (q) {
        url = `https://inmuebles.mercadolibre.com.mx/${path}/${state}/${formattedCity}/${encodeURIComponent(q)}_`;
    }

    if (minPrice || maxPrice) {
        const minUrl = minPrice || '0';
        const maxUrl = maxPrice || '0';
        url += `_PriceRange_${minUrl}-${maxUrl}`;
    }

    console.log(`[ZenRows] Scraping ML URL: ${url}`);

    try {
        const response = await axios({
            method: 'GET',
            url: 'https://api.zenrows.com/v1/',
            params: {
                url: url,
                apikey: ZENROWS_API_KEY,
                premium_proxy: 'true',
                js_render: 'true'
            },
            timeout: 25000
        });

        const html = response.data;
        const root = parse(html);
        const scriptNode = root.querySelector('#__NORDIC_RENDERING_CTX__');
        const listings: any[] = [];

        if (scriptNode) {
            try {
                const scriptText = scriptNode.textContent;
                const func = new Function("var _n={ctx:{}}; " + scriptText + " return _n.ctx.r;");
                const stateObj = func();

                const searchResults = stateObj?.appProps?.pageProps?.initialState?.results || stateObj?.initialState?.results || [];

                for (const item of searchResults) {
                    if (listings.length >= maxItems) break;

                    if (item.id === 'POLYCARD' && item.polycard) {
                        const pc = item.polycard;
                        const meta = pc.metadata || {};
                        const titleComp = pc.components?.find((c: any) => c.type === 'title')?.title;
                        const priceComp = pc.components?.find((c: any) => c.type === 'price')?.price?.current_price;
                        const locComp = pc.components?.find((c: any) => c.type === 'location')?.location;
                        const attrComp = pc.components?.find((c: any) => c.type === 'attributes_list')?.attributes_list;

                        const title = titleComp?.text || '';
                        const priceNum = priceComp?.value || 0;
                        const currency = (priceComp?.currency || 'MXN').replace('$', '');
                        const address = locComp?.text || city;
                        const attributes = attrComp?.texts || [];
                        const link = meta.url ? `https://${meta.url}` : url;

                        let imageUrl = 'https://via.placeholder.com/600x400?text=No+Image';
                        const allImages: string[] = [];
                        if (pc.pictures && pc.pictures.pictures && pc.pictures.pictures.length > 0) {
                            for (const pic of pc.pictures.pictures) {
                                if (pic.id) {
                                    allImages.push(`https://http2.mlstatic.com/D_NQ_${pic.id}-O.jpg`);
                                }
                            }
                            imageUrl = allImages[0] || imageUrl;
                        }

                        let mlId = `ML-${Math.random().toString(36).substring(7)}`;
                        const idMatch = link.match(/MLM-?\d+/);
                        if (idMatch) mlId = idMatch[0].replace('-', '');

                        if (title && priceNum > 0) {
                            listings.push({
                                id: meta.id || mlId,
                                title: title,
                                price: priceNum,
                                currency: currency,
                                address: address,
                                city: city,
                                state: 'Chihuahua',
                                status: 'active',
                                imageUrl: imageUrl,
                                images: allImages.length > 0 ? allImages : [imageUrl],
                                source: 'Mercado Libre',
                                sourceUrl: link,
                                attributes: attributes,
                                propertyType: propertyType ? propertyType.toUpperCase() : 'HOUSE',
                                fetchedAt: new Date().toISOString()
                            });
                        }
                    }
                }
            } catch (e: any) {
                console.log(`[ZenRows] failed to regex parse ML JSON state: ${e.message}`);
            }
        }

        if (listings.length === 0) {
            console.log(`[ZenRows] ⚠️ 0 listings extracted. HTML Length: ${html.length}. Peek: ${html.substring(0, 200)}... Is Datadome blocking? ${html.includes('datadome')}`);
            fs.writeFileSync('ml_dump.html', html);
        }

        console.log(`[ZenRows] ✅ Extracted ${listings.length} ML listings from HTML.`);
        return listings;

    } catch (error: any) {
        console.error('[ZenRows] ⚠️ Scrape error:', error?.response?.data || error.message);
        return [];
    }
}
