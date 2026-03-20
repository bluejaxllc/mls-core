const h = require('fs').readFileSync('i24.html', 'utf8');
const match = h.match(/[^<>\s]{0,20}data-id[^<>\s]{0,20}/ig);
console.log(match ? match.slice(0, 5) : 'None');
