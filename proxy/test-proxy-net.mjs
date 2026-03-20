import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('response', async res => {
    const type = res.request().resourceType();
    if (type === 'xhr' || type === 'fetch') {
      const url = res.url();
      if (url.includes('api') || url.includes('graphql') || url.includes('search')) {
        try {
          const text = await res.text();
          if (text.includes('precio') || text.includes('price') || text.includes('MN$')) {
            console.log('FOUND API:', url);
            console.log(text.substring(0, 500));
          }
        } catch (e) {}
      }
    }
  });

  console.log('Navigating...');
  await page.goto('https://www.inmuebles24.com/casas-en-venta-en-chihuahua.html', { waitUntil: 'networkidle0', timeout: 30000 });
  console.log('Done waiting.');
  await browser.close();
})();
