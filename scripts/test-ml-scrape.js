const fs = require('fs');

function extractJSON(str) {
    let brackets = 0;
    let inString = false;
    let escape = false;
    let started = false;

    for (let i = 0; i < str.length; i++) {
        const char = str[i];

        if (!escape && char === '"') {
            inString = !inString;
        }

        if (!inString) {
            if (char === '{') {
                brackets++;
                started = true;
            }
            if (char === '}') {
                brackets--;
                if (started && brackets === 0) {
                    return str.substring(0, i + 1);
                }
            }
        }

        // Handle escapes
        if (char === '\\' && !escape) {
            escape = true;
        } else {
            escape = false;
        }
    }
    return null;
}

try {
    const html = fs.readFileSync('scripts/ml-page.html', 'utf8');
    const prefix = '_n.ctx.r=';
    const startIdx = html.indexOf(prefix);
    if (startIdx >= 0) {
        const jsonStart = startIdx + prefix.length;
        const remainder = html.substring(jsonStart);

        const jsonStr = extractJSON(remainder);
        if (jsonStr) {
            console.log('JSON extracted! Length:', jsonStr.length);
            const data = JSON.parse(jsonStr);
            console.log('Successfully Parsed!');

            const results = data.appProps?.pageProps?.initialState?.results || [];
            console.log('Results Count:', results.length);
            if (results.length > 0) {
                const first = results[0];
                console.log('ID:', first.polycard?.metadata?.id);
                console.log('URL:', first.polycard?.metadata?.url);
                console.log('PIC:', first.polycard?.pictures?.pictures?.[0]?.id);
            }
        } else {
            console.log('Failed to extract JSON using brace matching');
        }
    } else {
        console.log('No prefix found');
    }
} catch (e) {
    console.log('Error:', e.message);
}
