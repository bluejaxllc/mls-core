/**
 * Facebook Marketplace Crawler via BrowserOS MCP
 * 
 * Uses the user's REAL browser (already logged into Facebook)
 * to extract marketplace listings. No cookies or login needed.
 * 
 * Run: node scripts/crawl-fb-browseros.mjs [--city chihuahua] [--limit 50]
 * 
 * Prerequisites:
 *   - BrowserOS running with MCP server on port 9000
 *   - @modelcontextprotocol/sdk installed in BlueJax dir
 *   - User logged into Facebook in their browser
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Config ─────────────────────────────────────
const MCP_URL = 'http://127.0.0.1:9000/mcp';
const RESULTS_FILE = resolve(__dirname, '..', 'data', 'fb-listings.json');

function parseArgs() {
    const args = process.argv.slice(2);
    const config = { city: 'chihuahua', category: 'propertyrentals', limit: 50 };
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--city' && args[i + 1]) config.city = args[++i];
        if (args[i] === '--category' && args[i + 1]) config.category = args[++i];
        if (args[i] === '--limit' && args[i + 1]) config.limit = parseInt(args[++i]);
    }
    return config;
}

// ─── MCP Client ─────────────────────────────────
async function createClient() {
    const transport = new StreamableHTTPClientTransport(new URL(MCP_URL));
    const client = new Client({ name: 'fb-crawler', version: '1.0.0' });
    await client.connect(transport);
    return { client, transport };
}

async function call(client, toolName, args = {}) {
    const r = await client.callTool({ name: toolName, arguments: args });
    return (r.content || []).filter(i => i.type === 'text').map(i => i.text).join('\n');
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

// ─── Main ───────────────────────────────────────
async function main() {
    const config = parseArgs();
    const url = `https://www.facebook.com/marketplace/${config.city}/${config.category}/?exact=false`;

    console.log('');
    console.log('╔═══════════════════════════════════════════════╗');
    console.log('║   🏠 FB Marketplace Crawler (BrowserOS)       ║');
    console.log('╚═══════════════════════════════════════════════╝');
    console.log(`  City:     ${config.city}`);
    console.log(`  Category: ${config.category}`);
    console.log(`  Limit:    ${config.limit}`);
    console.log(`  URL:      ${url}`);
    console.log('');

    let client, transport;
    try {
        console.log('[1/6] Connecting to BrowserOS MCP...');
        ({ client, transport } = await createClient());
        console.log('  ✅ Connected');

        // Step 2: Navigate to FB Marketplace
        console.log(`[2/6] Navigating to Facebook Marketplace...`);
        await call(client, 'browser_navigate', { url });
        await sleep(5000);

        // Step 3: Get tab ID
        console.log('[3/6] Getting active tab...');
        const tabInfo = await call(client, 'browser_get_active_tab', {});
        const tabIdMatch = tabInfo.match(/Tab ID:\s*(\d+)/);
        if (!tabIdMatch) {
            console.error('❌ Could not get tab ID. BrowserOS might not be running.');
            console.log('Raw tab info:', tabInfo);
            return;
        }
        const tabId = parseInt(tabIdMatch[1]);
        console.log(`  ✅ Tab ID: ${tabId}`);

        // Step 4: Scroll to load listings
        console.log('[4/6] Scrolling to load listings...');
        for (let i = 0; i < 5; i++) {
            await call(client, 'browser_execute_javascript', {
                tabId,
                code: 'window.scrollBy(0, window.innerHeight * 1.5)'
            });
            const waitMs = 2000 + Math.random() * 2000;
            console.log(`  Scroll ${i + 1}/5 (waiting ${Math.round(waitMs)}ms)...`);
            await sleep(waitMs);
        }

        // Step 5: Extract listings via JavaScript
        console.log('[5/6] Extracting listings from page...');
        const extractionCode = `
            (() => {
                const listings = [];
                const links = document.querySelectorAll('a[href*="/marketplace/item/"]');
                const seen = new Set();
                
                links.forEach(link => {
                    const href = link.getAttribute('href') || '';
                    const idMatch = href.match(/\\/marketplace\\/item\\/(\\d+)/);
                    if (!idMatch || seen.has(idMatch[1])) return;
                    seen.add(idMatch[1]);
                    
                    const id = idMatch[1];
                    const container = link.closest('[class]') || link;
                    
                    // Get all text spans
                    const spans = container.querySelectorAll('span');
                    const texts = [];
                    spans.forEach(s => {
                        const t = s.textContent?.trim();
                        if (t && t.length > 0 && t.length < 300) texts.push(t);
                    });
                    
                    // Parse fields
                    const price = texts.find(t => t.includes('$') || t.match(/\\d.*MX/)) || null;
                    const title = texts.find(t => t.length > 8 && !t.includes('$') && !t.match(/^\\d+ (min|km|mi)/)) || 'Propiedad #' + id.slice(0,6);
                    const location = texts.find(t => 
                        (t.includes('Chihuahua') || t.includes('Juárez') || t.includes('Delicias') || t.includes(',') || t.match(/\\d+ (min|km|mi)/)) 
                        && !t.includes('$') && t !== title
                    ) || null;
                    
                    // Image
                    const img = container.querySelector('img');
                    let imageUrl = img?.src || img?.getAttribute('data-src') || null;
                    if (imageUrl && imageUrl.startsWith('data:')) imageUrl = null;
                    
                    listings.push({
                        id,
                        title,
                        price,
                        address: location || 'Chihuahua',
                        imageUrl,
                        url: 'https://www.facebook.com/marketplace/item/' + id,
                        source: 'Facebook Marketplace',
                        fetchedAt: new Date().toISOString()
                    });
                });
                
                return JSON.stringify(listings);
            })()
        `;

        const rawResult = await call(client, 'browser_execute_javascript', {
            tabId,
            code: extractionCode
        });

        let listings = [];
        try {
            // The result may have extra text around the JSON
            const jsonMatch = rawResult.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                listings = JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            console.error('❌ Failed to parse extraction result');
            console.log('Raw result (first 500 chars):', rawResult.substring(0, 500));
            writeFileSync(resolve(__dirname, '..', 'data', 'fb-raw-debug.txt'), rawResult);
            return;
        }

        listings = listings.slice(0, config.limit);
        console.log(`  ✅ Extracted ${listings.length} listings`);

        if (listings.length === 0) {
            console.log('');
            console.log('⚠️  No listings found. Possible causes:');
            console.log('   - Facebook is showing login wall (check browser)');
            console.log('   - Marketplace page hasn\'t loaded yet');
            console.log('   - DOM selectors need updating');

            // Take a screenshot for debugging
            try {
                await call(client, 'browser_take_screenshot', { tabId });
                console.log('   📸 Screenshot saved by BrowserOS');
            } catch { }
            return;
        }

        // Step 6: Save results
        console.log('[6/6] Saving results...');

        // Ensure data directory exists
        const dataDir = resolve(__dirname, '..', 'data');
        if (!existsSync(dataDir)) {
            const { mkdirSync } = await import('fs');
            mkdirSync(dataDir, { recursive: true });
        }

        // Load existing results and merge
        let existing = [];
        if (existsSync(RESULTS_FILE)) {
            try {
                existing = JSON.parse(readFileSync(RESULTS_FILE, 'utf-8'));
            } catch { }
        }

        // Merge: new listings overwrite old ones with same ID
        const merged = new Map();
        for (const l of existing) merged.set(l.id, l);
        for (const l of listings) merged.set(l.id, l);

        const allListings = Array.from(merged.values());
        writeFileSync(RESULTS_FILE, JSON.stringify(allListings, null, 2));

        // Print summary
        console.log('');
        console.log('─── Results ───');
        for (const l of listings.slice(0, 10)) {
            console.log(`  📍 ${l.title}`);
            console.log(`     ${l.price || 'N/A'} | ${l.address}`);
        }
        if (listings.length > 10) {
            console.log(`  ... and ${listings.length - 10} more`);
        }

        console.log('');
        console.log(`✅ Saved ${listings.length} new listings (${allListings.length} total in ${RESULTS_FILE})`);

        // Also push to the live API for immediate visibility
        try {
            const apiPayload = listings.map(l => ({
                ...l,
                currency: 'MXN',
                source: 'Facebook Marketplace',
                propertyType: 'residential',
                status: 'active',
                city: config.city,
                state: 'Chihuahua',
            }));
            writeFileSync(
                resolve(__dirname, '..', 'data', 'fb-listings-api-ready.json'),
                JSON.stringify(apiPayload, null, 2)
            );
            console.log(`📤 API-ready file saved to data/fb-listings-api-ready.json`);
        } catch { }

    } catch (e) {
        console.error(`\n❌ Error: ${e.message}`);
        if (e.message.includes('ECONNREFUSED')) {
            console.log('\n💡 BrowserOS MCP server is not running.');
            console.log('   Start it at: chrome://browseros/mcp');
        }
        process.exit(1);
    } finally {
        if (transport) {
            try { await transport.close(); } catch { }
        }
    }
}

main();
