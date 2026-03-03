import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const transport = new StreamableHTTPClientTransport(new URL('http://127.0.0.1:9000/mcp'));
const client = new Client({ name: 'verify-prod', version: '1.0.0' });
await client.connect(transport);

async function call(toolName, args = {}) {
    const r = await client.callTool({ name: toolName, arguments: args });
    return (r.content || []).filter(i => i.type === 'text').map(i => i.text).join('\n');
}

console.log('Navigating to mls.bluejax.ai/listings...');
await call('browser_navigate', { url: 'https://mls.bluejax.ai/listings' });
await new Promise(r => setTimeout(r, 8000));

const tabInfo = await call('browser_get_active_tab', {});
const tabId = parseInt(tabInfo.match(/Tab ID:\s*(\d+)/)?.[1]);
console.log('Tab ID:', tabId);

// Take screenshot
await call('browser_take_screenshot', { tabId });
console.log('Screenshot 1 taken');

// Check content
const result = await call('browser_execute_javascript', {
    tabId,
    code: `JSON.stringify({
        url: location.href,
        title: document.title,
        bodySnippet: document.body.innerText.substring(0, 800)
    })`
});

const match = result.match(/Result:\s*"([\s\S]*)"/);
if (match) {
    const unescaped = match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    try {
        const data = JSON.parse(unescaped);
        console.log('URL:', data.url);
        console.log('Title:', data.title);
        console.log('Body:', data.bodySnippet?.substring(0, 400));
    } catch { console.log('Raw:', unescaped.substring(0, 300)); }
} else {
    console.log('Raw:', result.substring(0, 300));
}

// Scroll down
await call('browser_execute_javascript', { tabId, code: 'window.scrollBy(0, 600)' });
await new Promise(r => setTimeout(r, 2000));
await call('browser_take_screenshot', { tabId });
console.log('Screenshot 2 taken (scrolled)');

await transport.close();
console.log('Done!');
