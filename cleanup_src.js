
const fs = require('fs');
const path = require('path');

const files = [
    'src/analyze_data.ts',
    'src/verify_data_integrity.ts',
    'src/check_crawler_results.ts',
    'src/manual_crawl.ts',
    'src/test_ml_crawler.ts',
    'src/debug_token_scopes.ts',
    'src/force_refresh.ts',
    'src/verify_credentials.ts',
    'src/debug_search_params.ts',
    'src/trigger_crawl.ts',
    'src/test_correct_crawler.ts',
    'src/diagnose_data.ts',
    'src/test_real_crawler.ts',
    'src/test_api_prices.ts'
];

files.forEach(file => {
    const p = path.join(process.cwd(), file);
    if (fs.existsSync(p)) {
        try {
            fs.unlinkSync(p);
            console.log(`Deleted: ${file}`);
        } catch (e) {
            console.error(`Failed to delete ${file}:`, e.message);
        }
    } else {
        console.log(`Not found (already clean): ${file}`);
    }
});
