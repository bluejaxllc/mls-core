const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    await page.goto('https://remax.com.mx/propiedades/chihuahua_chihuahua', { waitUntil: 'networkidle2' });
    await page.waitForSelector('.jsPropSection, [class*="prop-card"]', { timeout: 10000 }).catch(() => console.log('no selector wait'));

    const html = await page.evaluate(() => {
        const sections = document.querySelectorAll('.jsPropSection, [class*="prop-card"]');
        const card = sections.length > 0 ? sections[0] : null;
        return card ? card.outerHTML : 'Not found';
    });

    fs.writeFileSync('remax_out.txt', html, 'utf8');
    console.log('Saved');
    await browser.close();
})();
