const h = require('fs').readFileSync('i24.html', 'utf8');
const spl = h.split('data-id="');
if (spl.length > 1) {
  const cardHtml = spl[1].substring(0, 5000);
  console.log(cardHtml);
}
