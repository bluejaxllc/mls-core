import fetch from 'node-fetch';
import fs from 'fs';

async function testPortals() {
    const urls = {
        inmuebles24: 'https://www.inmuebles24.com/casas-en-venta-en-chihuahua.html',
        lamudi: 'https://www.lamudi.com.mx/chihuahua/chihuahua-1/casa/for-sale/',
        vivanuncios: 'https://www.vivanuncios.com.mx/s-casas-en-venta/chihuahua-chih/v1c1293l10163p1'
    };

    const results = {};

    for (const [portal, url] of Object.entries(urls)) {
        try {
            const endpoint = `http://localhost:3004/scrape?portal=${portal}&url=${encodeURIComponent(url)}`;
            const res = await fetch(endpoint, {
                headers: { 'x-proxy-secret': 'bluejax-ml-proxy-2026' }
            });
            const data = await res.json();
            results[portal] = { count: data.count, images: data.listings?.[0]?.images?.length || 0 };
        } catch (err) {
            results[portal] = { error: err.message };
        }
    }
    fs.writeFileSync('test-portals-results.json', JSON.stringify(results, null, 2));
}

testPortals();
