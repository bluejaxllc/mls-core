import { MercadoLibreClient } from '../web/lib/integrations/mercadolibre/client';
import { MercadoLibreAuth } from '../web/lib/integrations/mercadolibre/auth';

async function run() {
    console.log('Testing ML Client...');
    const auth = new MercadoLibreAuth();
    const client = new MercadoLibreClient(auth);

    try {
        const res = await client.searchRealEstate('Chihuahua', 'MLM-CHH', 10, 0, 'Casa');
        console.log(`Success! Found ${res.results.length} results. Pagination offset: ${res.paging.offset}, limit: ${res.paging.limit}, total: ${res.paging.total}`);
        if (res.results.length > 0) {
            console.log('First Item:', res.results[0].title, '- $', res.results[0].price);
            console.log('Images:', res.results[0].pictures?.length);
            console.log('Attributes:', res.results[0].attributes?.length);
        }
    } catch (e) {
        console.log('Error:', e);
    }
}
run();
