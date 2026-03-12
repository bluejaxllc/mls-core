const axios = require('axios');
require('dotenv').config({ path: 'web/.env.local' });

async function check() {
    const url = 'https://inmuebles.mercadolibre.com.mx/inmuebles/venta/chihuahua/chihuahua/';
    console.log('Fetching', url, 'with ZenRows key', !!process.env.ZENROWS_API_KEY);

    try {
        const response = await axios({
            method: 'GET',
            url: 'https://api.zenrows.com/v1/',
            params: {
                url: url,
                apikey: process.env.ZENROWS_API_KEY,
                premium_proxy: 'true',
                js_render: 'true'
            },
            timeout: 25000
        });
        const html = response.data;
        console.log('HTML size:', html.length);
        const hasListings = html.includes('POLYCARD');
        console.log('Has POLYCARD:', hasListings);
        const hasDatadome = html.includes('datadome');
        console.log('Has Datadome:', hasDatadome);
        require('fs').writeFileSync('ml_dump.html', html);
    } catch (e) {
        console.error('Error:', e.message);
    }
}
check();
