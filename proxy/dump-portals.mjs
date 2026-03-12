import puppeteer from 'puppeteer';
import fs from 'fs';

async function run() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'es-MX,es;q=0.9' });

    console.log('Navigating to Lamudi...');
    await page.goto('https://www.lamudi.com.mx/chihuahua/chihuahua/casa/for-sale/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    let html = await page.content();
    fs.writeFileSync('lamudi-html.txt', html);

    console.log('Navigating to Vivanuncios...');
    await page.goto('https://www.vivanuncios.com.mx/casas-en-venta-en-chihuahua.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
    html = await page.content();
    fs.writeFileSync('viva-html.txt', html);

    await browser.close();
    console.log('Done.');
}
run().catch(console.error);
