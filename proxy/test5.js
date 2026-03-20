const h = require('fs').readFileSync('i24.html', 'utf8');
const match = h.match(/.{0,50}data-id.{0,50}/i);
if (match) console.log(match[0]);
