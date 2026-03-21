import puppeteer from 'puppeteer';

(async () => {
    const b = await puppeteer.launch({ headless: 'new' });
    const page = await b.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    await page.goto('https://inmuebles.mercadolibre.com.mx/inmuebles/venta/chihuahua/chihuahua/', { waitUntil: 'domcontentloaded' });
    const html = await page.content();

    // Look for common ML markers
    console.log('Has _n.ctx.r=', html.includes('_n.ctx.r='));
    console.log('Has __PRELOADED_STATE__=', html.includes('__PRELOADED_STATE__'));

    // Find the script tag containing initialState
    const stateStart = html.indexOf('initialState');
    if (stateStart !== -1) {
        console.log('Found initialState at index', stateStart);
        console.log('Snippet:', html.substring(stateStart - 50, stateStart + 200).replace(/\\n/g, ' '));
    } else {
        console.log('No initialState found in HTML. Try dumping body scripts.');
        const scripts = await page.evaluate(() => Array.from(document.scripts).map(s => s.textContent || s.src).filter(t => t.includes('results') || t.includes('Polycard')));
        console.log('Found scripts:', scripts.length);
        if (scripts.length > 0) console.log(scripts[0].substring(0, 300));
    }

    await b.close();
})();
