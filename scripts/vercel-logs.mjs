import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const transport = new StreamableHTTPClientTransport(new URL('http://127.0.0.1:9000/mcp'));
const client = new Client({ name: 'vercel-logs', version: '1.0.0' });
await client.connect(transport);

async function call(toolName, args = {}) {
    const r = await client.callTool({ name: toolName, arguments: args });
    return (r.content || []).filter(i => i.type === 'text').map(i => i.text).join('\n');
}

// Navigate to mls-core deployments
await call('browser_navigate', { url: 'https://vercel.com/eds-projects-bc846511/mls-core/deployments' });
await new Promise(r => setTimeout(r, 5000));

const tabInfo = await call('browser_get_active_tab', {});
const tabId = parseInt(tabInfo.match(/Tab ID:\s*(\d+)/)?.[1]);

// Get the list of recent deployments
const result = await call('browser_execute_javascript', {
    tabId,
    code: `
        // Find all deployment links
        const links = Array.from(document.querySelectorAll('a[href*="/deployments/"]'));
        const deployments = links.map(a => ({
            href: a.href,
            text: a.textContent?.trim()?.substring(0, 100)
        })).filter(d => d.href.includes('/deployments/dpl_'));
        JSON.stringify(deployments.slice(0, 10))
    `
});

console.log('Deployments:', result.substring(0, 500));

// Click the first (most recent) deployment to see its logs
const linkResult = await call('browser_execute_javascript', {
    tabId,
    code: `
        const links = Array.from(document.querySelectorAll('a[href*="/deployments/dpl_"]'));
        if (links.length > 0) {
            const href = links[0].href;
            window.location.href = href;
            'Navigated to: ' + href;
        } else {
            'No deployment links found. Page text: ' + document.body.innerText.substring(0, 300);
        }
    `
});

console.log('Navigation:', linkResult.substring(0, 200));
await new Promise(r => setTimeout(r, 5000));

// Get the build log content
const logResult = await call('browser_execute_javascript', {
    tabId,
    code: `JSON.stringify({
        url: location.href,
        bodyText: document.body.innerText.substring(0, 2000)
    })`
});

const match = logResult.match(/Result:\s*"([\s\S]*)"/);
if (match) {
    try {
        const data = JSON.parse(match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\'));
        console.log('URL:', data.url);
        console.log('Body:', data.bodyText?.substring(0, 1500));
    } catch (e) {
        console.log('Parse error, raw:', match[1].substring(0, 500));
    }
}

await transport.close();
