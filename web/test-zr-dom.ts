import { scrapeMLViaZenRows } from './lib/integrations/zenrows';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env.local') });

async function run() {
    console.log('Testing ML ZenRows with DOM Parsing...');
    try {
        const results = await scrapeMLViaZenRows('', 'ALL', '', '', '', 20);
        console.log('Results length:', results.length);
        if (results.length > 0) {
            console.log('Sample 1:', results[0].title, '| Price:', results[0].price);
            console.log('Sample 2:', results[1]?.title, '| Price:', results[1]?.price);
        }
    } catch (err) {
        console.error('Error:', err);
    }
}
run();
