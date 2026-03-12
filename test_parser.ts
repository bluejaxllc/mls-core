import axios from 'axios';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

const ZENROWS_API_KEY = process.env.ZENROWS_API_KEY || '732faaf3f91d64f28cfb653ad334e679ff5b64ee';

async function testParser() {
    console.log(`Using Key: ${ZENROWS_API_KEY.substring(0, 5)}`);
    try {
        const response = await axios({
            method: 'GET',
            url: 'https://api.zenrows.com/v1/',
            params: {
                url: 'https://inmuebles.mercadolibre.com.mx/casas/venta/chihuahua/chihuahua/',
                apikey: ZENROWS_API_KEY,
                premium_proxy: 'true',
                js_render: 'true'
            },
            timeout: 25000
        });

        const html = response.data;
        fs.writeFileSync('test_dump.html', html);
        console.log(`Downloaded ${html.length} bytes to test_dump.html`);
        console.log(`Contains POLYCARD? ${html.includes('POLYCARD')}`);
        console.log(`Contains ui-search-layout__item? ${html.includes('ui-search-layout__item')}`);
    } catch (e: any) {
        console.error('Scrape error:', e?.response?.data || e.message);
    }
}

testParser();
