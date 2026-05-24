import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { writeFileSync } from 'fs';

const transport = new StreamableHTTPClientTransport(new URL('http://127.0.0.1:9000/mcp'));
const client = new Client({ name: 'helper', version: '1.0.0' });

async function run() {
    await client.connect(transport);
    
    async function call(toolName, args) {
        const r = await client.callTool({ name: toolName, arguments: args });
        return r.content.find(i => i.type === 'text')?.text || JSON.stringify(r.content);
    }

    console.log("Navigating to railway...");
    await call('browser_navigate', { url: "https://railway.com/dashboard" });
    await new Promise(r => setTimeout(r, 4000));

    const tabInfo = await call('browser_get_active_tab', {});
    console.log("Tab Info:", tabInfo);
    
    const tabMatch = String(tabInfo).match(/Tab ID:\s*(\d+)/);
    if (!tabMatch) {
         console.log("No tab id found");
         return;
    }
    const tabId = parseInt(tabMatch[1]);
    
    console.log("Fetching interactive elements...");
    const els = await call('browser_get_interactive_elements', { tabId });
    writeFileSync('c:\\Users\\edgar\\OneDrive\\Desktop\\MLS_fresh\\railway_els.txt', String(els));

    const shot = await call('browser_capture_screenshot', {});
    writeFileSync('c:\\Users\\edgar\\OneDrive\\Desktop\\MLS_fresh\\railway_shot.txt', String(shot));
    
    console.log("Done. Check railway_els.txt.");
    await transport.close();
}

run().catch(console.error);
