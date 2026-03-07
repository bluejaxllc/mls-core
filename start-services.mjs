/**
 * MLS Services Orchestrator
 * Starts everything automatically on boot:
 *   1. Proxy server (port 3004)
 *   2. Cloudflare quick tunnel → extracts URL
 *   3. Updates ML_PROXY_URL in Vercel
 *   4. Auto-deploy watcher (git push on file changes)
 *
 * Usage: node start-services.mjs
 */

import { spawn, execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createWriteStream } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname);
const PROXY_DIR = resolve(ROOT, 'proxy');
const CF_PATH = 'C:\\Program Files (x86)\\cloudflared\\cloudflared.exe';
const PROXY_PORT = 3004;

function log(msg) {
    const ts = new Date().toLocaleTimeString('es-MX', { hour12: false });
    console.log(`[${ts}] ${msg}`);
}

// ── 1. Start Proxy Server ──────────────────────────────────────────────
function startProxy() {
    return new Promise((resolve, reject) => {
        log('🚀 Starting proxy server on :' + PROXY_PORT + '...');
        const proxyLog = createWriteStream(PROXY_DIR + '/proxy.log');
        const proxy = spawn('node', ['ml-proxy.mjs'], {
            cwd: PROXY_DIR,
            stdio: ['ignore', 'pipe', 'pipe'],
        });

        proxy.stdout.pipe(proxyLog);
        proxy.stderr.pipe(proxyLog);

        proxy.stdout.on('data', (chunk) => {
            const text = chunk.toString();
            if (text.includes('running on')) {
                log('✅ Proxy started');
                resolve(proxy);
            }
        });

        proxy.on('error', (err) => {
            log('❌ Proxy failed: ' + err.message);
            reject(err);
        });

        // Timeout fallback — assume it started after 5 seconds
        setTimeout(() => resolve(proxy), 5000);
    });
}

// ── 2. Start Cloudflare Tunnel + Extract URL ────────────────────────────
function startTunnel() {
    return new Promise((resolve, reject) => {
        log('🌐 Starting Cloudflare tunnel...');
        const tunnelLog = createWriteStream(PROXY_DIR + '/tunnel.log');
        const tunnel = spawn(CF_PATH, ['tunnel', '--url', `http://localhost:${PROXY_PORT}`], {
            stdio: ['ignore', 'pipe', 'pipe'],
        });

        let tunnelUrl = null;
        const urlRegex = /https:\/\/[a-z0-9-]+\.trycloudflare\.com/;

        function checkForUrl(chunk) {
            const text = chunk.toString();
            tunnelLog.write(text);
            const match = text.match(urlRegex);
            if (match && !tunnelUrl) {
                tunnelUrl = match[0];
                log(`✅ Tunnel URL: ${tunnelUrl}`);
                resolve({ tunnel, url: tunnelUrl });
            }
        }

        tunnel.stdout.on('data', checkForUrl);
        tunnel.stderr.on('data', checkForUrl);

        tunnel.on('error', (err) => {
            log('❌ Tunnel failed: ' + err.message);
            reject(err);
        });

        // Timeout after 30 seconds
        setTimeout(() => {
            if (!tunnelUrl) {
                log('⚠️  Tunnel URL not detected after 30s. Check proxy/tunnel.log');
                resolve({ tunnel, url: null });
            }
        }, 30000);
    });
}

// ── 3. Update Vercel Environment Variable ───────────────────────────────
function updateVercelEnv(tunnelUrl) {
    if (!tunnelUrl) {
        log('⏭️  No tunnel URL — skipping Vercel update');
        return false;
    }

    try {
        // Remove existing ML_PROXY_URL from all environments
        log('📝 Updating ML_PROXY_URL in Vercel...');
        try {
            execSync('vercel env rm ML_PROXY_URL production -y', {
                cwd: resolve(ROOT, 'web'),
                encoding: 'utf-8',
                stdio: 'pipe',
            });
        } catch (_) { /* may not exist yet */ }

        // Add new ML_PROXY_URL
        execSync(`echo ${tunnelUrl} | vercel env add ML_PROXY_URL production`, {
            cwd: resolve(ROOT, 'web'),
            encoding: 'utf-8',
            stdio: 'pipe',
            timeout: 15000,
        });

        log(`✅ ML_PROXY_URL set to: ${tunnelUrl}`);

        // Trigger redeploy
        log('🔄 Triggering Vercel redeploy...');
        execSync('vercel deploy --prod --yes', {
            cwd: resolve(ROOT, 'web'),
            encoding: 'utf-8',
            stdio: 'pipe',
            timeout: 120000,
        });
        log('✅ Vercel redeploy triggered');
        return true;
    } catch (err) {
        log('⚠️  Vercel update failed: ' + (err.message?.split('\n')[0] || err));
        log('   You may need to run: vercel login');
        return false;
    }
}

// ── 4. Start Auto-Deploy Watcher ────────────────────────────────────────
function startAutoDeployWatcher() {
    log('👁️  Starting auto-deploy watcher...');
    const watcher = spawn('node', ['auto-deploy.mjs'], {
        cwd: ROOT,
        stdio: ['ignore', 'pipe', 'pipe'],
    });
    const watcherLog = createWriteStream(ROOT + '/deploy.log');
    watcher.stdout.pipe(watcherLog);
    watcher.stderr.pipe(watcherLog);
    watcher.stdout.on('data', (chunk) => {
        const text = chunk.toString().trim();
        if (text.includes('✅') || text.includes('📦')) log('  [deploy] ' + text);
    });
    return watcher;
}

// ── Main ────────────────────────────────────────────────────────────────
async function main() {
    console.log('\n════════════════════════════════════════════');
    console.log('  MLS Services Orchestrator');
    console.log('════════════════════════════════════════════\n');

    // Step 1: Proxy
    const proxy = await startProxy();

    // Step 2: Tunnel
    const { tunnel, url } = await startTunnel();

    // Step 3: Update Vercel (if we got a tunnel URL)
    if (url) {
        updateVercelEnv(url);
    }

    // Step 4: Auto-Deploy Watcher
    const watcher = startAutoDeployWatcher();

    console.log('\n════════════════════════════════════════════');
    log('All services running:');
    console.log(`  Proxy:       http://localhost:${PROXY_PORT}`);
    console.log(`  Tunnel:      ${url || '(pending — check tunnel.log)'}`);
    console.log(`  Auto-Deploy: Watching web/ and proxy/`);
    console.log('  Logs:        proxy/proxy.log, proxy/tunnel.log, deploy.log');
    console.log('════════════════════════════════════════════\n');

    // Keep running — graceful shutdown on Ctrl+C
    process.on('SIGINT', () => {
        log('Shutting down...');
        proxy.kill();
        tunnel.kill();
        watcher.kill();
        process.exit(0);
    });

    // Restart tunnel if it dies (URL changes)
    tunnel.on('exit', async (code) => {
        log(`⚠️  Tunnel exited (code ${code}). Restarting in 10s...`);
        setTimeout(async () => {
            const { tunnel: newTunnel, url: newUrl } = await startTunnel();
            if (newUrl) updateVercelEnv(newUrl);
        }, 10000);
    });
}

main().catch((err) => {
    log('❌ Fatal: ' + err.message);
    process.exit(1);
});
