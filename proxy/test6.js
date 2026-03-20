const h = require('fs').readFileSync('i24.html', 'utf8');
const regex = /([\s\S]{0,100}data-id[\s\S]{0,100})/i;
const match = h.match(regex);
require('fs').writeFileSync('dataid.txt', match ? match[1] : 'NOT FOUND');
