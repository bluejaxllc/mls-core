import { MercadoLibreAuth } from './src/integrations/mercadolibre/auth';
import { MercadoLibreClient } from './src/integrations/mercadolibre/client';

async function test() {
    try {
        console.log('1. Creating auth instance...');
        const auth = new MercadoLibreAuth();

        console.log('2. Checking if authenticated...');
        if (!auth.isAuthenticated()) {
            console.error('❌ Not authenticated!');
            return;
        }
        console.log('✅ Authenticated');

        console.log('3. Getting access token...');
        const token = await auth.getValidToken();
        console.log('✅ Got token');

        console.log('4. Creating client...');
        const client = new MercadoLibreClient(auth);

        console.log('5. Searching for listings...');
        const results = await client.searchRealEstate('Chihuahua', 'MLM-CHH', 5);
        console.log(`✅ Found ${results.results.length} listings!`);
        console.log('First listing:', results.results[0]?.title);

    } catch (error: any) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
    }
}

test();
