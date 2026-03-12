import puppeteer from 'puppeteer';
import path from 'path';

async function run() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    const filePath = 'file://' + path.resolve('ml-html.txt').replace(/\\/g, '/');
    console.log(`Loading ${filePath}`);
    await page.goto(filePath, { waitUntil: 'load' });

    const obj = await page.evaluate(() => {
        return {
            _n_exists: typeof window._n !== 'undefined',
            _n_ctx: window._n ? Object.keys(window._n.ctx) : [],
            _n_ctx_r: window._n && window._n.ctx && window._n.ctx.r ? Object.keys(window._n.ctx.r) : [],
            pre_exists: typeof window.__PRELOADED_STATE__ !== 'undefined',
        };
    });

    console.log(obj);

    // Let's also extract the raw string from the script tag just in case window._n is not being properly evaluated
    const scriptText = await page.evaluate(() => {
        const script = Array.from(document.querySelectorAll('script')).find(s => s.textContent.includes('_n.ctx.r={'));
        return script ? script.textContent : null;
    });

    if (scriptText) {
        import('fs').then(fs => fs.writeFileSync('ml-script.js', scriptText));
        console.log('Saved script text to ml-script.js');
    }

    await browser.close();
}

run().catch(console.error);
