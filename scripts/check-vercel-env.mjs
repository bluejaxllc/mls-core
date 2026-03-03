import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const transport = new StreamableHTTPClientTransport(new URL('http://127.0.0.1:9000/mcp'));
const client = new Client({ name: 'vercel-env', version: '1.0.0' });
await client.connect(transport);

async function call(toolName, args = {}) {
    const r = await client.callTool({ name: toolName, arguments: args });
    return (r.content || []).filter(i => i.type === 'text').map(i => i.text).join('\n');
}

// Navigate to Vercel env vars page
console.log('Navigating to Vercel env vars...');
await call('browser_navigate', { url: 'https://vercel.com/eds-projects-bc846511/mls-core/settings/environment-variables' });
await new Promise(r => setTimeout(r, 5000));

const tabInfo = await call('browser_get_active_tab', {});
const tabId = parseInt(tabInfo.match(/Tab ID:\s*(\d+)/)?.[1]);
console.log('Tab ID:', tabId);

// Check what env vars exist
const result = await call('browser_execute_javascript', {
    tabId,
    code: `JSON.stringify({
        url: location.href,
        envVarNames: Array.from(document.querySelectorAll('td, span, div')).filter(el => {
            const t = el.textContent?.trim();
            return t && (t.startsWith('ML_') || t.startsWith('DATABASE') || t.startsWith('NEXT'));
        }).map(el => el.textContent.trim()).filter((v, i, a) => a.indexOf(v) === i).slice(0, 20)
    })`
});

try {
    const match = result.match(/Result:\s*"([\s\S]*)"/);
    if (match) {
        const data = JSON.parse(match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\'));
        console.log('URL:', data.url);
        console.log('Env vars found:', data.envVarNames);
    }
} catch (e) {
    console.log('Raw:', result.substring(0, 300));
}

await transport.close();
