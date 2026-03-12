## Auto-Start Proxy Setup

The proxy needs to run on your home machine + Cloudflare tunnel for production scraping to work.

### Quick Start (Manual)
```bash
cd proxy
node ml-proxy.mjs                                     # Start proxy on :3007
cloudflared.exe tunnel --url http://localhost:3007     # Create tunnel
# Then update ML_PROXY_URL in Railway with the tunnel URL
```

### Fully Automatic (Recommended)
Run the PowerShell script — it handles everything:
```powershell
powershell -ExecutionPolicy Bypass -File proxy\start-mls-proxy.ps1
```

This script will:
1. Kill any old proxy/tunnel processes
2. Start the ML proxy on port 3007
3. Launch a Cloudflare tunnel
4. Extract the tunnel URL automatically
5. Update Railway's `ML_PROXY_URL` env var
6. Verify end-to-end connectivity
7. Monitor health every 60 seconds

### Auto-Start on Windows Login
A shortcut has been placed in `shell:startup` → the proxy starts automatically on login.
To re-create it manually:
1. Press `Win+R`, type `shell:startup`
2. Create a shortcut to `proxy/start-mls-proxy.ps1`
3. Set the target to: `powershell.exe -ExecutionPolicy Bypass -WindowStyle Minimized -File "<full-path>\start-mls-proxy.ps1"`

### Port
- **Port 3007** (registered in port registry)
- Old port 3004 was reassigned to the Telegram Bridge

> **Note**: The Cloudflare tunnel URL changes every restart, but the script handles updating Railway automatically.
