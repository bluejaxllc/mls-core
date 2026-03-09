import fetch from 'node-fetch';

async function testPortals() {
    const urls = {
        inmuebles24: 'https://www.inmuebles24.com/casas-en-venta-en-chihuahua.html',
        lamudi: 'https://www.lamudi.com.mx/chihuahua/chihuahua-1/casa/for-sale/',
        vivanuncios: 'https://www.vivanuncios.com.mx/s-casas-en-venta/chihuahua-chih/v1c1293l10163p1'
    };

    for (const [portal, url] of Object.entries(urls)) {
        console.log(`\nTesting ${portal}...`);
        try {
            const endpoint = `http://localhost:3004/scrape?portal=${portal}&url=${encodeURIComponent(url)}`;
            const start = Date.now();
            const res = await fetch(endpoint, {
                headers: { 'x-proxy-secret': 'bluejax-ml-proxy-2026' }
            });
            const data = await res.json();
            const elapsed = Date.now() - start;
            console.log(`[${portal}] Status: ${res.status}, Elapsed: ${elapsed}ms, Listings: ${data.count}`);
            if (data.count > 0 && data.listings[0].images) {
                console.log(`[${portal}] Images for first listing: ${data.listings[0].images.length}`);
            } else if (data.count === 0) {
                console.log(`[${portal}] No listings found`);
            }
        } catch (err) {
            console.error(`[${portal}] Error: ${err.message}`);
        }
    }
}

testPortals();
