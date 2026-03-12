const axios = require('axios');
const HttpsProxyAgent = require('https-proxy-agent');

const APIFY_TOKEN = "apify_api_h1aQphfL75vMrGaUhbuN2AJZvjIWJs3edTOf";
const PROXY_URL = `http://groups-RESIDENTIAL:${APIFY_TOKEN}@proxy.apify.com:8000`;
const httpsAgent = new HttpsProxyAgent.HttpsProxyAgent(PROXY_URL);

async function testMLScrape() {
    try {
        console.log('Fetching ML via Apify Residential Proxy...');
        const { data: html } = await axios.get('https://inmuebles.mercadolibre.com.mx/chihuahua/chihuahua/_NoIndex_True', {
            httpsAgent,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml',
                'Accept-Language': 'es-MX,es;q=0.9,en-US;q=0.8,en;q=0.7',
            }
        });

        console.log('HTML length:', html.length);

        if (html.length < 500000) {
            console.log('⚠️ Page is small, likely blocked.');
            return;
        }

        // Look for the JSON data block
        const match = html.match(/\{"id":"POLYCARD"[\s\S]*?(?=(?:<\/script>|;))/);
        if (match) {
            console.log('✅ Found POLYCARD JSON!');
            // Just print a bit of it
            console.log(match[0].substring(0, 200) + '...');
        } else {
            console.log('❌ Could not find POLYCARD JSON pattern');
        }

    } catch (e) {
        console.log('ERROR:', e.message);
    }
}

testMLScrape();
