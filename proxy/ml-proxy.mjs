/**
 * ML Scrape Proxy — runs on your home machine behind a Cloudflare Tunnel.
 * Vercel production calls this proxy → residential IP fetches ML → returns HTML.
 *
 * Usage:   node ml-proxy.mjs
 * Port:    3004 (registered in port registry)
 * Tunnel:  cloudflared tunnel --url http://localhost:3004
 */

import http from 'http';

const PORT = 3004;
const SECRET = process.env.PROXY_SECRET || 'bluejax-ml-proxy-2026';

const server = http.createServer(async (req, res) => {
    // CORS headers for preflight
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'x-proxy-secret');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Health check
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', ip: 'residential', timestamp: Date.now() }));
        return;
    }

    // Auth check
    const secret = req.headers['x-proxy-secret'];
    if (secret !== SECRET) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid proxy secret' }));
        return;
    }

    // Extract target URL
    const params = new URL(req.url, `http://localhost:${PORT}`).searchParams;
    const targetUrl = params.get('url');

    if (!targetUrl || !targetUrl.includes('mercadolibre')) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing or invalid ?url= parameter' }));
        return;
    }

    console.log(`[Proxy] Fetching: ${targetUrl}`);
    const start = Date.now();

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'es-MX,es;q=0.9,en;q=0.5',
                'Accept-Encoding': 'identity',
            },
            signal: AbortSignal.timeout(15000),
        });

        const html = await response.text();
        const elapsed = Date.now() - start;
        console.log(`[Proxy] ✅ ${response.status} — ${html.length} chars in ${elapsed}ms`);

        res.writeHead(response.status, {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Proxy-Time': `${elapsed}ms`,
            'X-Proxy-Source': 'residential',
        });
        res.end(html);
    } catch (err) {
        console.error(`[Proxy] ❌ Failed:`, err.message);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
    }
});

server.listen(PORT, () => {
    console.log(`\n🏠 ML Scrape Proxy running on http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   Usage:  GET /?url=https://inmuebles.mercadolibre.com.mx/...`);
    console.log(`   Secret: x-proxy-secret header required\n`);
    console.log(`   Next: Run cloudflared tunnel --url http://localhost:${PORT}\n`);
});
