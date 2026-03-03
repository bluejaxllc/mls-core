import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const transport = new StreamableHTTPClientTransport(new URL('http://127.0.0.1:9000/mcp'));
const client = new Client({ name: 'build-check', version: '1.0.0' });
await client.connect(transport);

async function call(toolName, args = {}) {
    const r = await client.callTool({ name: toolName, arguments: args });
    return (r.content || []).filter(i => i.type === 'text').map(i => i.text).join('\n');
}

// Check deployment page
await call('browser_navigate', { url: 'https://vercel.com/eds-projects-bc846511/mls-core/deployments' });
await new Promise(r => setTimeout(r, 5000));

const tabInfo = await call('browser_get_active_tab', {});
const tabId = parseInt(tabInfo.match(/Tab ID:\s*(\d+)/)?.[1]);

const result = await call('browser_execute_javascript', {
    tabId,
    code: `JSON.stringify({
        url: location.href,
        bodyText: document.body.innerText.substring(0, 1000)
    })`
});

const match = result.match(/Result:\s*"([\s\S]*)"/);
if (match) {
    const data = JSON.parse(match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\'));
    console.log('URL:', data.url);
    console.log('Body:', data.bodyText?.substring(0, 800));
} else {
    console.log('Raw:', result.substring(0, 500));
}

await transport.close();
