// Test: Extract results array from NORDIC script despite non-JSON JS syntax
const fs = require('fs');

const html = fs.readFileSync('ml_dump.html', 'utf-8');

// Find the results array directly in the raw HTML text
const resultsMarker = '"results":[{"id":"POLYCARD"';
const markerIdx = html.indexOf(resultsMarker);
if (markerIdx === -1) { console.log('FAIL: no POLYCARD results marker'); process.exit(1); }

// Find the start of the array (jump to the `[`)
const arrStart = markerIdx + '"results":'.length;

// Bracket-matching to find the end of the results array
let depth = 0;
let arrEnd = -1;
for (let i = arrStart; i < html.length && i < arrStart + 600000; i++) {
    if (html[i] === '[') depth++;
    if (html[i] === ']') {
        depth--;
        if (depth === 0) { arrEnd = i + 1; break; }
    }
}

if (arrEnd === -1) { console.log('FAIL: could not find end of results array'); process.exit(1); }

const resultsJson = html.substring(arrStart, arrEnd);
console.log('ARRAY_LEN:', resultsJson.length);

const results = JSON.parse(resultsJson);
console.log('RESULTS_COUNT:', results.length);

for (let i = 0; i < Math.min(3, results.length); i++) {
    const pc = results[i]?.polycard;
    if (!pc) continue;
    const components = pc.components || [];
    const titleComp = components.find(c => c.type === 'title');
    const priceComp = components.find(c => c.type === 'price');
    const id = pc.metadata?.id || 'unknown';
    const price = priceComp?.price?.current_price?.value || 0;
    const imgs = (pc.pictures?.pictures || []).length;
    console.log('LISTING_' + (i + 1) + ': id=' + id + ' price=' + price + ' imgs=' + imgs);
}

console.log('TEST_PASSED');
