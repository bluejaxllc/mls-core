const fs = require('fs');
const { parse } = require('node-html-parser');
const html = fs.readFileSync('C:/tmp/ml.html', 'utf8');
const root = parse(html);

const items = root.querySelectorAll('.ui-search-layout__item');
console.log('Found items:', items.length);

const listings = [];
for (const item of items) {
    const linkEl = item.querySelector('a.poly-component__title') || item.querySelector('a');
    const href = linkEl ? linkEl.getAttribute('href') : '';

    const titleEl = item.querySelector('.poly-component__title-wrapper') || item.querySelector('.poly-component__title');
    const title = titleEl ? titleEl.textContent.trim() : '';

    const priceEl = item.querySelector('.andes-money-amount__fraction');
    const price = priceEl ? parseInt(priceEl.textContent.replace(/\D/g, ''), 10) : 0;

    const imgEl = item.querySelector('img');
    let imgUrl = '';
    if (imgEl) {
        imgUrl = imgEl.getAttribute('data-src') || imgEl.getAttribute('src') || '';
    }

    const locEl = item.querySelector('.poly-component__location');
    const location = locEl ? locEl.textContent.trim() : '';

    const attrs = [];
    const attrEls = item.querySelectorAll('.poly-attributes_list__item');
    for (const attr of attrEls) {
        attrs.push(attr.textContent.trim());
    }

    if (title && price > 0) {
        listings.push({ title, price, location, href, imgUrl, attrs });
    }
}

console.log('Parsed valid listings:', listings.length);
if (listings.length > 0) {
    console.log(listings[0]);
    console.log(listings[1]);
}
