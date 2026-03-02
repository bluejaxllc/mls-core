import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const transport = new StreamableHTTPClientTransport(new URL('http://127.0.0.1:9000/mcp'));
const client = new Client({ name: 'fb-debug2', version: '1.0.0' });
await client.connect(transport);

async function call(toolName, args = {}) {
    const r = await client.callTool({ name: toolName, arguments: args });
    return (r.content || []).filter(i => i.type === 'text').map(i => i.text).join('\n');
}

// Try generic marketplace (uses user's location from FB profile)
const urls = [
    'https://www.facebook.com/marketplace/',
    'https://www.facebook.com/marketplace/category/propertyrentals/',
    'https://www.facebook.com/marketplace/search/?query=casa%20chihuahua',
];

for (const url of urls) {
    console.log(`\n--- Testing: ${url} ---`);
    await call('browser_navigate', { url });
    await new Promise(r => setTimeout(r, 5000));

    const tabInfo = await call('browser_get_active_tab', {});
    const tabId = parseInt(tabInfo.match(/Tab ID:\s*(\d+)/)?.[1]);

    const result = await call('browser_execute_javascript', {
        tabId,
        code: `JSON.stringify({
            finalUrl: location.href,
            title: document.title,
            itemLinks: document.querySelectorAll('a[href*="/marketplace/item/"]').length,
            allLinks: document.querySelectorAll('a').length,
            firstText: document.body.innerText.substring(0, 300)
        })`
    });

    try {
        const match = result.match(/\{[\s\S]*\}/);
        if (match) {
            const data = JSON.parse(match[0]);
            console.log('Final URL:', data.finalUrl);
            console.log('Item links:', data.itemLinks);
            console.log('All links:', data.allLinks);
            console.log('Text:', data.firstText?.substring(0, 200));
        }
    } catch (e) {
        console.log('Parse error, raw:', result.substring(0, 200));
    }
}

await transport.close();
