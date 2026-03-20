import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

puppeteer.use(StealthPlugin());

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const html = fs.readFileSync('i24.html', 'utf8');
  await page.setContent(html);

  const properties = await page.evaluate(() => {
    const items = [];
    const cards = document.querySelectorAll('[data-posting-type="PROPERTY"], [class*="postingCard"]');
    console.log('Cards found:', cards.length);

    for (const card of cards) {
      try {
        const titleEl = card.querySelector('h2, h3, [class*="title"], [class*="Title"]');
        const priceEl = card.querySelector('[class*="price"], [class*="Price"], [data-qa="POSTING_CARD_PRICE"]');
        const linkEl = card.querySelector('a');

        let url = '';
        if (linkEl && linkEl.getAttribute('href')) {
            url = linkEl.getAttribute('href');
        } else if (card.getAttribute('data-to-posting')) {
            url = card.getAttribute('data-to-posting');
        }

        if (!url || !titleEl || !priceEl) continue;

        let rawPrice = '';
        if (priceEl) {
            rawPrice = priceEl.innerText || priceEl.textContent || '';
            rawPrice = rawPrice.replace(/[^\d]/g, '');
        }

        let title = titleEl.innerText || titleEl.textContent || '';
        items.push({ url, title, price: parseInt(rawPrice, 10) || 0 });
      } catch (e) {
      }
    }
    return items;
  });

  console.log('EXTRACTED:', properties.length);
  if (properties.length > 0) console.log(properties[0]);
  await browser.close();
})();
