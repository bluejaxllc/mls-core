import { scrapeMLViaZenRows } from '../web/lib/integrations/zenrows';
import dotenv from 'dotenv';
dotenv.config({ path: '../web/.env.local' });

async function run() {
    console.log('Testing ML ZenRows with empty city...');
    const results = await scrapeMLViaZenRows('', 'ALL', '', '', '', 20);
    console.log('Results length:', results.length);
    if (results.length > 0) {
        console.log('First result:', results[0].title, results[0].address);
    }
}
run();
