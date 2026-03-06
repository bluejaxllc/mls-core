import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // Load from root
dotenv.config();

const ZENROWS_API_KEY = process.env.ZENROWS_API_KEY || '732faaf3fff5b64ee8cfb653ad334e679f';
const ML_URL = 'https://inmuebles.mercadolibre.com.mx/chihuahua/chihuahua/';

async function testZenRows() {
    console.log(`Starting ZenRows API test with key: ${ZENROWS_API_KEY.substring(0, 10)}...`);

    try {
        const response = await axios({
            method: 'GET',
            url: 'https://api.zenrows.com/v1/',
            params: {
                url: ML_URL,
                apikey: ZENROWS_API_KEY,
                js_render: 'true',       // ML is heavy on JS, but we might just need the static HTML if preloaded
                premium_proxy: 'true',   // Bypass ML datadome/px blocks reliably
            },
        });

        const html = response.data;
        console.log(`\n✅ Success! Fetched ${html.length} bytes of HTML.`);

        // Test 1: DOM Elements
        const itemMatch = html.match(/class="ui-search-result__content-wrapper"/g);
        console.log(`\nFound ${itemMatch?.length || 0} listing cards in raw HTML.`);

        // Test 2: JSON State (POLYCARD)
        const polyMatch = html.match(/"id":"POLYCARD"/g);
        console.log(`Found POLYCARD JSON block: ${!!polyMatch}`);

        if (polyMatch) {
            // Find MLM IDs
            const mlmIds = html.match(/MLM-?\d+/g);
            if (mlmIds) {
                // Deduplicate and output a few
                const uniqueIds = Array.from(new Set(mlmIds)).slice(0, 5);
                console.log(`Found MLM IDs: ${uniqueIds.join(', ')}`);
            }
        }

    } catch (error: any) {
        console.error('\n❌ ZenRows scraping failed.');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Message: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(error.message);
        }
    }
}

testZenRows();
