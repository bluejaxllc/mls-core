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
        const listings: any[] = [];

        // Nuevo parser DOM porque ML eliminó __NORDIC_RENDERING_CTX__
        const items = root.querySelectorAll('.ui-search-layout__item');

        for (const item of items) {
            if (listings.length >= maxItems) break;

            const linkEl = item.querySelector('a.poly-component__title') || item.querySelector('a');
            const link = linkEl ? linkEl.getAttribute('href') : url;

            const titleEl = item.querySelector('.poly-component__title-wrapper') || item.querySelector('.poly-component__title') || item.querySelector('h2');
            const title = titleEl ? titleEl.textContent.trim() : '';

            const priceEl = item.querySelector('.andes-money-amount__fraction');
            const priceNum = priceEl ? parseInt(priceEl.textContent.replace(/\\D/g, ''), 10) : 0;
            const currency = 'MXN';

            const locEl = item.querySelector('.poly-component__location');
            const address = locEl ? locEl.textContent.trim() : city;

            const attrs: string[] = [];
            const attrEls = item.querySelectorAll('.poly-attributes_list__item');
            for (const attr of attrEls) {
                if (attr.textContent) attrs.push(attr.textContent.trim());
            }

            // Image handles Lazy Loading from ZenRows
            const imgEl = item.querySelector('img.poly-component__picture') || item.querySelector('img');
            let imageUrl = 'https://via.placeholder.com/600x400?text=No+Image';
            if (imgEl) {
                imageUrl = imgEl.getAttribute('data-src') || imgEl.getAttribute('src') || imageUrl;
            }

            let mlId = `ML-\${Math.random().toString(36).substring(7)}`;
            const idMatch = link?.match(/MLM-?\\d+/);
            if (idMatch) mlId = idMatch[0].replace('-', '');

            if (title && priceNum > 0) {
                listings.push({
                    id: mlId,
                    title: title,
                    price: priceNum,
                    currency: currency,
                    address: address,
                    city: city,
                    state: 'Chihuahua',
                    status: 'active',
                    imageUrl: imageUrl,
                    images: [imageUrl], // Extracted from DOM can only guarantee 1 initially
                    source: 'Mercado Libre',
                    sourceUrl: link || '',
                    attributes: attrs,
                    propertyType: propertyType ? propertyType.toUpperCase() : 'HOUSE',
                    fetchedAt: new Date().toISOString()
                });
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
