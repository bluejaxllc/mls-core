const fs = require('fs');
const html = fs.readFileSync('i24.html', 'utf8');

const idMatch = html.match(/data-id="([^"]+)"/g);
console.log('Total data-id:', idMatch ? idMatch.length : 0);

const h2Match = html.match(/<h2[^>]*>(+?)<\/h2>/g);
if (h2Match) console.log('H2s:', h2Match.slice(0, 3));

const mnMatch = html.match(/M[NX]\s*\$\s*[\d,]+/ig);
if (mnMatch) console.log('MN$:', mnMatch.slice(0, 3));

const cardMatch = html.match(/class="([^"]*card[^"]*)"/ig);
if (cardMatch) console.log('Cards:', cardMatch.slice(0, 3));

console.log('propiedades:', (html.match(/propiedades/ig)||[]).length);