import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fbDataRaw from './fb-data.json';

export const dynamic = 'force-dynamic';

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ITEMS = 100;

// In-memory cache: cacheKey -> { timestamp, listings[] }
const memoryCache = new Map<string, { timestamp: number; listings: any[] }>();

// Chihuahua real estate data generator - produces realistic listings per filter
function generateListings(city: string, propertyType: string, minPrice: string, maxPrice: string): any[] {
    const seed = `${city}|${propertyType}`.length;

    const cityData: Record<string, { neighborhoods: string[], prefix: string }> = {
        'Chihuahua': {
            neighborhoods: ['Lomas del Santuario', 'Zona Centro', 'Periférico de la Juventud', 'Complejo Industrial', 'Las Granjas', 'Quintas del Sol', 'Cumbres', 'Villa Juárez', 'Haciendas', 'Santa Rita', 'Riberas del Sacramento', 'San Felipe', 'Nombre de Dios', 'Palmas', 'Campestre', 'Paseos de Chihuahua', 'Jardines del Sol', 'Residencial Universidad', 'Los Nogales', 'Los Pinos', 'San Pedro', 'Villas del Real', 'Sierra Vista', 'Colinas del Sol', 'Punta Oriente'],
            prefix: 'Chihuahua'
        },
        'Ciudad Juárez': {
            neighborhoods: ['Pronaf', 'Campestre', 'Gómez Morín', 'Misión de los Lagos', 'Las Torres', 'Fuentes del Valle', 'Paseo de las Torres', 'Rincón de las Palmas', 'Jardines de San José', 'Los Nogales', 'Partido Romero', 'Bosques del Sol', 'Las Haciendas', 'Zaragoza', 'Rivera del Bravo', 'Portal del Norte', 'Quintas del Valle', 'Cordilleras', 'Montecarlo', 'Pradera Dorada'],
            prefix: 'Cd. Juárez'
        },
        'Delicias': {
            neighborhoods: ['Centro', 'Las Brisas', 'Industrial', 'Los Álamos', 'Vista Hermosa', 'Col. del Valle', 'Jardines', 'Praderas', 'Nueva Esperanza', 'Los Girasoles', 'La Cañada', 'San José', 'Los Cedros'],
            prefix: 'Delicias'
        },
        'Cuauhtémoc': {
            neighborhoods: ['Centro', 'Col. Obrera', 'Anáhuac', 'Las Granjas', 'Industrial Norte', 'Los Pinos', 'Campestre', 'Del Valle', 'San Antonio', 'La Hacienda', 'Los Olivos'],
            prefix: 'Cuauhtémoc'
        },
        'Hidalgo del Parral': {
            neighborhoods: ['Centro Histórico', 'Del Valle', 'Industrial', 'Las Palmas', 'San José', 'Col. Emiliano Zapata', 'El Molinito', 'Los Fresnos', 'La Prieta'],
            prefix: 'Hidalgo del Parral'
        },
        'Nuevo Casas Grandes': {
            neighborhoods: ['Centro', 'Col. Progreso', 'Campestre', 'Industrial', 'Las Quintas', 'Los Portales', 'San José', 'Paquimé', 'El Porvenir'],
            prefix: 'Nuevo Casas Grandes'
        },
    };

    const typeConfig: Record<string, { titles: string[], priceRange: [number, number], icon: string }> = {
        'HOUSE': {
            titles: ['Casa Residencial', 'Casa de 3 Recámaras', 'Residencia Premium', 'Casa Familiar', 'Casa Nueva', 'Casa con Jardín', 'Casa Moderna', 'Casa en Condominio', 'Casa de 2 Pisos', 'Casa Estilo Californiano', 'Casa con Alberca', 'Casa Remodelada', 'Duplex'],
            priceRange: [1800000, 8500000],
            icon: '🏠'
        },
        'APARTMENT': {
            titles: ['Departamento Amueblado', 'Penthouse', 'Loft Céntrico', 'Departamento 2 Recámaras', 'Departamento con Amenidades'],
            priceRange: [1200000, 5500000],
            icon: '🏢'
        },
        'COMMERCIAL': {
            titles: ['Local Comercial', 'Oficina Premium', 'Plaza Comercial', 'Consultorio', 'Restaurante en Traspaso', 'Bodega Comercial', 'Oficina Ejecutiva', 'Centro Médico', 'Edificio de Oficinas', 'Local en Plaza', 'Salón de Eventos', 'Estética en Traspaso'],
            priceRange: [2500000, 15000000],
            icon: '🏢'
        },
        'LAND': {
            titles: ['Terreno Residencial', 'Terreno Comercial', 'Lote Urbanizado', 'Terreno para Desarrollo', 'Rancho', 'Predio Rústico', 'Lote Esquinero', 'Terreno con Servicios', 'Parcela Agrícola', 'Hectárea en Venta', 'Terreno en Fraccionamiento'],
            priceRange: [500000, 12000000],
            icon: '🌎'
        },
        'INDUSTRIAL': {
            titles: ['Nave Industrial', 'Bodega Industrial', 'Planta de Producción', 'Centro de Distribución', 'Almacén', 'Parque Industrial', 'Taller Mecánico', 'Fábrica', 'Warehouse', 'Cedis'],
            priceRange: [5000000, 25000000],
            icon: '🏭'
        },
    };

    const activeCityData = cityData[city] || cityData['Chihuahua'];
    const types = propertyType ? [propertyType.toUpperCase()] : ['HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL', 'INDUSTRIAL'];

    const listings: any[] = [];

    for (let i = 0; i < MAX_ITEMS; i++) {
        const type = types[i % types.length];
        const config = typeConfig[type];
        const hood = activeCityData.neighborhoods[i % activeCityData.neighborhoods.length];
        const title = config.titles[i % config.titles.length];

        // Generate a realistic price
        const priceBase = config.priceRange[0] + ((i * 7919 + seed * 31) % (config.priceRange[1] - config.priceRange[0]));
        const price = Math.round(priceBase / 10000) * 10000; // Round to nearest 10K

        // Apply price filters
        if (minPrice && price < parseFloat(minPrice)) continue;
        if (maxPrice && price > parseFloat(maxPrice)) continue;

        const areas = [85, 120, 150, 200, 250, 350, 500, 750, 1200];
        const area = areas[i % areas.length];

        listings.push({
            id: `ML-${city.substring(0, 3).toUpperCase()}-${type.substring(0, 3).toUpperCase()}-${(i + 1).toString().padStart(3, '0')}`,
            title: `${title} en ${hood}`,
            price,
            currency: 'MXN',
            address: `${hood}, ${activeCityData.prefix}, Chihuahua`,
            city: city,
            state: 'Chihuahua',
            status: 'active',
            imageUrl: `https://http2.mlstatic.com/D_NQ_NP_${(600000 + i * 1337)}-MLA${(70000000 + i * 99991)}_${(2024 + (i % 2))}-O.webp`,
            source: 'Mercado Libre',
            sourceUrl: `https://inmueble.mercadolibre.com.mx/MLM-${(700000000 + i * 13337)}`,
            attributes: [
                `${area} m²`,
                ['HOUSE', 'APARTMENT'].includes(type) ? `${2 + (i % 3)} recámaras` : '',
                ['HOUSE', 'APARTMENT'].includes(type) ? `${1 + (i % 2)} baños` : '',
                type === 'COMMERCIAL' ? 'Estacionamiento' : '',
                type === 'LAND' ? 'Escrituras al corriente' : '',
            ].filter(Boolean),
            propertyType: type,
            fetchedAt: new Date().toISOString()
        });
    }

    return listings.slice(0, MAX_ITEMS);
}

// ─── BrowserOS MCP Facebook Marketplace Crawl ──────────────────
// Uses raw fetch JSON-RPC (no SDK needed) to control user's real browser
// Returns [] instantly if BrowserOS is not running (production/Vercel)
let mcpRequestId = 1;
async function mcpCall(tool: string, args: any = {}): Promise<string> {
    const MCP_URL = 'http://127.0.0.1:9000/mcp';
    const res = await fetch(MCP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'tools/call',
            id: mcpRequestId++,
            params: { name: tool, arguments: args }
        }),
        signal: AbortSignal.timeout(30000),
    });
    const json = await res.json();
    const content = json?.result?.content || [];
    return content.filter((i: any) => i.type === 'text').map((i: any) => i.text).join('\n');
}

async function crawlFacebookViaBrowserOS(city: string, propertyType: string, maxItems: number): Promise<any[]> {
    const MCP_URL = 'http://127.0.0.1:9000/mcp';

    try {
        // Quick connectivity check (1s timeout) — instant fail on Vercel
        await fetch(MCP_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', method: 'initialize', id: 0, params: { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'live-api', version: '1.0.0' } } }),
            signal: AbortSignal.timeout(1000),
        });
    } catch {
        console.log('[LIVE] BrowserOS not available — skipping FB crawl');
        return [];
    }

    try {
        const categoryMap: Record<string, string> = {
            'residential': 'propertyforsale',
            'commercial': 'propertyforsale',
            'land': 'propertyforsale',
            'industrial': 'propertyforsale',
            '': 'propertyrentals',
        };
        const category = categoryMap[propertyType] || 'propertyrentals';
        const url = `https://www.facebook.com/marketplace/${city.toLowerCase().replace(/\s+/g, '')}/${category}/?exact=false`;

        console.log(`[LIVE] 🔄 BrowserOS FB crawl: ${url}`);
        await mcpCall('browser_navigate', { url });
        await new Promise(r => setTimeout(r, 4000));

        const tabInfo = await mcpCall('browser_get_active_tab', {});
        const tabIdMatch = tabInfo.match(/Tab ID:\s*(\d+)/);
        if (!tabIdMatch) return [];
        const tabId = parseInt(tabIdMatch[1]);

        // Scroll 3x to load listings
        for (let i = 0; i < 3; i++) {
            await mcpCall('browser_execute_javascript', { tabId, code: 'window.scrollBy(0, window.innerHeight * 1.5)' });
            await new Promise(r => setTimeout(r, 1500));
        }

        // Extract listings
        const extractCode = `(() => {
            const listings = []; const seen = new Set();
            document.querySelectorAll('a[href*="/marketplace/item/"]').forEach(link => {
                const href = link.getAttribute('href') || '';
                const m = href.match(/\\/marketplace\\/item\\/(\\d+)/);
                if (!m || seen.has(m[1])) return;
                seen.add(m[1]);
                const id = m[1], c = link.closest('[class]') || link;
                const spans = c.querySelectorAll('span');
                const texts = [];
                spans.forEach(s => { const t = s.textContent?.trim(); if (t && t.length > 0 && t.length < 300) texts.push(t); });
                const price = texts.find(t => t.includes('$')) || null;
                const title = texts.find(t => t.length > 8 && !t.includes('$')) || 'Propiedad #' + id.slice(0,6);
                const loc = texts.find(t => (t.includes('Chihuahua') || t.includes('Juárez') || t.includes(',')) && !t.includes('$') && t !== title) || null;
                const img = c.querySelector('img');
                let imgUrl = img?.src || null;
                if (imgUrl && imgUrl.startsWith('data:')) imgUrl = null;
                listings.push({ id, title, price, address: loc || 'Chihuahua', imageUrl: imgUrl, url: 'https://www.facebook.com/marketplace/item/' + id, source: 'Facebook Marketplace', fetchedAt: new Date().toISOString() });
            });
            return JSON.stringify(listings);
        })()`;

        const rawResult = await mcpCall('browser_execute_javascript', { tabId, code: extractCode });

        // Parse result (MCP wraps as Result: "...")
        let jsonStr = rawResult;
        const resultMatch = rawResult.match(/Result:\s*"([\s\S]*)"/);
        if (resultMatch) {
            jsonStr = resultMatch[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        const jsonMatch = jsonStr.match(/\[[\s\S]*\]/);
        if (!jsonMatch) return [];

        const fbListings = JSON.parse(jsonMatch[0]).slice(0, maxItems).map((item: any) => {
            let priceNum: number | null = null;
            if (item.price) {
                const clean = item.price.replace(/[^0-9.]/g, '');
                const parsed = parseFloat(clean);
                if (!isNaN(parsed)) priceNum = parsed;
            }
            return {
                ...item,
                price: priceNum || 0,
                currency: 'MXN',
                propertyType: propertyType || 'residential',
                status: 'active',
                city: city,
                state: 'Chihuahua',
            };
        });

        console.log(`[LIVE] ✅ BrowserOS FB: ${fbListings.length} listings extracted`);
        return fbListings;
    } catch (e: any) {
        console.log(`[LIVE] ⚠️ BrowserOS FB crawl failed: ${e.message}`);
        return [];
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const city = searchParams.get('city') || 'Chihuahua';
        const propertyType = searchParams.get('propertyType') || '';
        const minPrice = searchParams.get('minPrice') || '';
        const maxPrice = searchParams.get('maxPrice') || '';
        const q = searchParams.get('q') || '';

        // Build cache key from all filter params
        const cacheKey = crypto.createHash('md5')
            .update(`${city}|${propertyType}|${minPrice}|${maxPrice}|${q}`)
            .digest('hex');

        console.log(`[LIVE] Filters: city=${city} type=${propertyType} price=${minPrice}-${maxPrice} q=${q}`);

        // Check cache
        const cached = memoryCache.get(cacheKey);
        if (cached && cached.listings.length > 0 && (Date.now() - cached.timestamp) < CACHE_TTL_MS) {
            console.log(`[LIVE] ✅ Cache HIT — ${cached.listings.length} results`);
            return NextResponse.json({
                source: 'cache',
                cacheKey,
                listings: cached.listings
            });
        }

        // ── Source 1: ML Scraper (8s timeout) ──────────────────
        let mlListings: any[] = [];
        try {
            const { mlCrawler } = await import('@/lib/integrations/mercadolibre');
            // @ts-ignore
            const client = mlCrawler.client;

            const typeMap: Record<string, string> = {
                'house': 'casas',
                'apartment': 'departamentos',
                'land': 'terrenos',
                'commercial': 'locales comerciales',
                'industrial': 'bodegas',
            };
            const searchQuery = (propertyType && typeMap[propertyType]) ? typeMap[propertyType] : q;

            const searchResponse = await Promise.race([
                client.searchRealEstate(city, 'MLM-CHH', MAX_ITEMS, 0, searchQuery || undefined),
                new Promise((_, reject) => setTimeout(() => reject(new Error('ML timeout')), 8000))
            ]) as any;

            mlListings = searchResponse.results.map((item: any) => {
                let imageUrl = null;
                if (item.pictures?.length > 0) {
                    imageUrl = item.pictures[0].url || item.pictures[0].secure_url;
                }
                return {
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    currency: item.currency_id || 'MXN',
                    address: item.location?.address_line || item.location?.city?.name || city,
                    city: item.location?.city?.name || city,
                    state: item.location?.state?.name || 'Chihuahua',
                    status: 'active',
                    imageUrl,
                    source: 'Mercado Libre',
                    sourceUrl: item.permalink,
                    attributes: item.attributes?.map((a: any) => a.name) || [],
                    propertyType: propertyType ? propertyType.toUpperCase() : 'HOUSE',
                    fetchedAt: new Date().toISOString()
                };
            });

            if (minPrice) mlListings = mlListings.filter((l: any) => l.price >= parseFloat(minPrice));
            if (maxPrice) mlListings = mlListings.filter((l: any) => l.price <= parseFloat(maxPrice));
        } catch (e: any) {
            console.log(`[LIVE] ⚠️ ML scraper: ${e.message}`);
        }

        // ── Source 2: Facebook via BrowserOS (live) or bundled data ──
        let fbListings: any[] = [];
        try {
            // Use bundled FB data (no live BrowserOS crawl to avoid hijacking user's browser)
            if (fbDataRaw && fbDataRaw.length > 0) {
                try {
                    fbListings = (fbDataRaw as any[]).map((item: any) => {
                        let priceNum = 0;
                        if (item.price) {
                            const clean = String(item.price).replace(/[^0-9.]/g, '');
                            const parsed = parseFloat(clean);
                            if (!isNaN(parsed)) priceNum = parsed;
                        }
                        return {
                            id: item.id,
                            title: item.title,
                            price: priceNum,
                            currency: 'MXN',
                            address: item.address || 'Chihuahua',
                            city: city,
                            state: 'Chihuahua',
                            status: 'active',
                            imageUrl: item.imageUrl,
                            source: 'Facebook Marketplace',
                            sourceUrl: item.url,
                            propertyType: propertyType ? propertyType.toUpperCase() : 'HOUSE',
                            fetchedAt: item.fetchedAt || new Date().toISOString(),
                        };
                    });
                    console.log(`[LIVE] 📦 Bundled FB data: ${fbListings.length} listings`);
                } catch (bundledErr: any) {
                    console.log(`[LIVE] ⚠️ Bundled FB data error: ${bundledErr.message}`);
                }
            }

            if (minPrice) fbListings = fbListings.filter((l: any) => l.price >= parseFloat(minPrice));
            if (maxPrice) fbListings = fbListings.filter((l: any) => l.price <= parseFloat(maxPrice));
        } catch (e: any) {
            console.log(`[LIVE] ⚠️ FB crawl: ${e.message}`);
        }

        // ── Merge real results ────────────────────────────────
        let listings = [...mlListings, ...fbListings];

        // No fake data fallback — show empty state if no real sources available
        if (listings.length === 0) {
            console.log(`[LIVE] 📊 No data from ML or FB — returning empty`);
        }

        // Cache results
        if (listings.length > 0) {
            memoryCache.set(cacheKey, { timestamp: Date.now(), listings });
        }

        // Clean old cache entries
        if (memoryCache.size > 10) {
            const entries = Array.from(memoryCache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp);
            for (let i = 0; i < entries.length - 10; i++) {
                memoryCache.delete(entries[i][0]);
            }
        }

        const source = fbListings.length > 0 ? 'facebook' : mlListings.length > 0 ? 'mercadolibre' : 'generated';
        console.log(`[LIVE] ✅ ${listings.length} listings (ML: ${mlListings.length}, FB: ${fbListings.length})`);

        return NextResponse.json({
            source,
            cacheKey,
            listings
        });

    } catch (e: any) {
        console.error('[LIVE] Error:', e.message);
        return NextResponse.json({
            error: e.message,
            source: 'error',
            listings: []
        }, { status: 500 });
    }
}
