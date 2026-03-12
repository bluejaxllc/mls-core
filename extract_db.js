const fs = require('fs');
const txt = fs.readFileSync('railway_vars.txt', 'utf16le');
const urlLine = txt.split('\n').find(l => l.startsWith('INTELLIGENCE_DATABASE_URL='));
if (urlLine) {
    const val = urlLine.substring('INTELLIGENCE_DATABASE_URL='.length).trim();
    fs.writeFileSync('vercel_db_val.txt', val, 'utf8');
    console.log('Value saved to vercel_db_val.txt (length: ' + val.length + ')');
} else {
    console.log('Not found');
}
