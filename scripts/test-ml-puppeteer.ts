import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const ML_MARKETPLACE_URL = 'https://inmuebles.mercadolibre.com.mx/chihuahua/chihuahua/_NoIndex_True';

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function testMLScrape() {
    console.log('Launching browser with Stealth Plugin...');
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-blink-features=AutomationControlled', // Bypass anti-bot
            '--window-size=1280,900',
        ],
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 900 });

        // Pass as real browser
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
        });

        console.log('Navigating to ML...');
        const response = await page.goto(ML_MARKETPLACE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });

        console.log('Response Status:', response?.status());

        // Wait a bit to emulate human reading
        await delay(3000);

        const html = await page.content();
        console.log('HTML length loaded in Puppeteer:', html.length);

        if (html.length < 500000) {
            console.log('⚠️ Page size too small (might be blocked/captcha)');
        }

        // Extract items using standard DOM queries since ML uses standard classes for results
        const listings = await page.evaluate(() => {
            const results: any[] = [];
            // Target the result items container
            const cards = document.querySelectorAll('li.ui-search-layout__item');

            cards.forEach(card => {
                const titleEl = card.querySelector('h2');
                const priceEl = card.querySelector('.ui-search-price__part .andes-money-amount__fraction');
                const linkEl = card.querySelector('a.ui-search-link');
                const imgEl = card.querySelector('img.ui-search-result-image__image');
                const locEl = card.querySelector('.ui-search-item__location');

                // ML typically puts ID in the URL, e.g., /MLM-12345678-...
                const url = linkEl?.getAttribute('href') || linkEl?.getAttribute('href');
                let id = 'Unknown';
                if (url) {
                    const match = url.match(/MLM-?(\d+)/i);
                    if (match) id = 'MLM' + match[1];
                }

                results.push({
                    id,
                    title: titleEl?.textContent?.trim(),
                    price: priceEl?.textContent?.trim(),
                    address: locEl?.textContent?.trim(),
                    url: url,
                    imageUrl: imgEl?.getAttribute('src') || imgEl?.getAttribute('data-src')
                });
            });
            return results;
        });

        console.log(`Found ${listings.length} listings via DOM.`);
        if (listings.length > 0) {
            console.log('First 2 listings:');
            console.log(listings.slice(0, 2));
        }

    } catch (e: any) {
        console.error('Error during scrape:', e.message);
    } finally {
        await browser.close();
    }
}

testMLScrape();
