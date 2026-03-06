const axios = require('axios');

async function testML() {
    try {
        const { data: html } = await axios.get('https://inmuebles.mercadolibre.com.mx/chihuahua/chihuahua/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml',
                'Accept-Language': 'en-US,en;q=0.9,es;q=0.8'
            }
        });

        console.log('HTML length:', html.length);

        // Try old pattern
        const oldMatch = html.match(/_n_\.ctx\.r\s*=\s*(\{[\s\S]*?\})\s*;/);
        console.log('Old pattern match:', !!oldMatch);

        // Search for common data patterns
        const patterns = [
            '__PRELOADED_STATE__', '__NEXT_DATA__', 'window.__INITIAL_STATE__',
            '_n_.ctx', 'polycard', 'initialState', 'pageProps', 'appData',
            'window.__', 'PRELOADED', 'searchResults'
        ];

        for (const p of patterns) {
            const idx = html.indexOf(p);
            if (idx >= 0) {
                console.log(`FOUND: "${p}" at index ${idx}`);
                console.log('  Context:', html.substring(idx, idx + 150).replace(/\n/g, '\\n'));
            }
        }

        // Find all <script> tags with substantial content
        const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
        console.log('\nTotal script tags:', scriptMatches.length);
        scriptMatches.forEach((s, i) => {
            if (s.length > 3000) {
                console.log(`\nLarge script #${i} (${s.length} chars):`);
                console.log('  Start:', s.substring(0, 300).replace(/\n/g, '\\n'));
            }
        });

        // Look for any JSON-like data with listing info
        const jsonMatches = html.match(/\{[^}]*"id"\s*:\s*"MLM\d+[^}]*\}/g);
        if (jsonMatches) {
            console.log('\nFound MLM IDs in JSON:', jsonMatches.length);
            console.log('First:', jsonMatches[0].substring(0, 200));
        } else {
            console.log('\nNo MLM IDs found in HTML');
        }

    } catch (e) {
        console.log('ERROR:', e.message);
    }
}

testML();
const fs = require('fs'); testML().then(html => {}); 
