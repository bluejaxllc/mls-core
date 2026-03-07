## Auto-Start Proxy Setup

The proxy needs to run on your home machine + Cloudflare tunnel for production scraping to work.

### Quick Start (Manual)
```bash
cd proxy
node ml-proxy.mjs                                     # Start proxy on :3004
cloudflared.exe tunnel --url http://localhost:3004     # Create tunnel
```

### Auto-Start on Windows Login
1. Double-click `proxy/start-proxy.bat` to test it
2. Create a shortcut to `start-proxy.bat`
3. Press `Win+R`, type `shell:startup`, and paste the shortcut there
4. The proxy + tunnel will now start automatically when you log in

### After Restart
The Cloudflare tunnel URL changes every time. After a restart:
1. Check `proxy/tunnel.log` for the new URL
2. Update `ML_PROXY_URL` in Vercel → Settings → Environment Variables
3. Redeploy: `vercel deploy --prod`

> **Note**: For a permanent tunnel URL, you can set up a named Cloudflare tunnel (requires a Cloudflare account with a domain).
