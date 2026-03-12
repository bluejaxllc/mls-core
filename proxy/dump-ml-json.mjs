import fs from 'fs';

const html = fs.readFileSync('ml-html.txt', 'utf8');
const marker = '_n.ctx.r=';
const startIdx = html.indexOf(marker);

if (startIdx !== -1) {
    const jsonStart = startIdx + marker.length;
    let openBraces = 0;
    let inString = false;
    let escape = false;
    let validJson = '';

    for (let i = jsonStart; i < html.length; i++) {
        const char = html[i];
        validJson += char;

        if (inString) {
            if (char === '\\') escape = !escape;
            else if (char === '"' && !escape) inString = false;
            else if (escape) escape = false;
        } else {
            if (char === '"') inString = true;
            else if (char === '{' || char === '[') openBraces++;
            else if (char === '}' || char === ']') openBraces--;

            if (openBraces === 0) {
                break;
            }
        }
    }

    fs.writeFileSync('ml-parsed.json', validJson);
    console.log('Saved parsed JSON to ml-parsed.json');
} else {
    console.error('Marker not found');
}
