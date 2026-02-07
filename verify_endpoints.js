
const http = require('http');

function get(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function run() {
    try {
        console.log('--- SEEDING ---');
        const seed = await get('http://localhost:3001/api/intelligence/debug/seed');
        console.log(seed);

        console.log('--- SEARCHING ---');
        const search = await get('http://localhost:3001/api/protected/search');
        console.log(search);
    } catch (e) {
        console.error(e);
    }
}
run();
