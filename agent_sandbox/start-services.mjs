/**
 * MLS Services Orchestrator
 * Starts everything automatically on boot:
 *   1. Proxy server (port 3004)
 *   2. Localtunnel with fixed subdomain → URL never changes
 *   3. Auto-deploy watcher (git push on file changes)
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
const PROXY_PORT = 3004;
const TUNNEL_SUBDOMAIN = 'bluejax-ml-proxy-2026';
const TUNNEL_URL = `https://${TUNNEL_SUBDOMAIN}.loca.lt`;

function log(msg) {
    const ts = new Date().toLocaleTimeString('es-MX', { hour12: false });
    console.log(`[${ts}] ${msg}`);
}

// ── 1. Start Proxy Server ──────────────────────────────────────────────
function startProxy() {
    return new Promise((resolve, reject) => {
        log('🚀 Starting proxy server on :' + PROXY_PORT + '...');

        // Kill anything already on port 3004
        try {
            const output = execSync(`netstat -aon | findstr ":${PROXY_PORT}.*LISTENING"`, { encoding: 'utf-8', stdio: 'pipe' });
            const pid = output.trim().split(/\s+/).pop();
            if (pid && pid !== '0') {
                log(`   Killing existing process on port ${PROXY_PORT} (PID: ${pid})...`);
                execSync(`taskkill /f /pid ${pid}`, { stdio: 'pipe' });
            }
        } catch (_) { /* nothing on port, good */ }

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

// ── 2. Start Localtunnel (fixed subdomain — URL never changes!) ──────
function startTunnel() {
    return new Promise((resolvePromise) => {
        log(`🌐 Starting localtunnel (${TUNNEL_URL})...`);
        const tunnelLog = createWriteStream(PROXY_DIR + '/tunnel.log');

        const tunnel = spawn('npx', ['-y', 'localtunnel', '--port', String(PROXY_PORT), '--subdomain', TUNNEL_SUBDOMAIN, '--local-host', '127.0.0.1'], {
            cwd: ROOT,
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: true,
        });

        tunnel.stdout.on('data', (chunk) => {
            const text = chunk.toString();
            tunnelLog.write(text);
            if (text.includes('your url is:')) {
                log(`✅ Tunnel ready: ${TUNNEL_URL}`);
                resolvePromise({ tunnel, url: TUNNEL_URL });
            }
        });

        tunnel.stderr.on('data', (chunk) => {
            tunnelLog.write(chunk.toString());
        });

        tunnel.on('error', (err) => {
            log('❌ Tunnel failed: ' + err.message);
            resolvePromise({ tunnel: null, url: null });
        });

        // Timeout — localtunnel is usually fast
        setTimeout(() => {
            log(`✅ Tunnel assumed ready: ${TUNNEL_URL}`);
            resolvePromise({ tunnel, url: TUNNEL_URL });
        }, 15000);
    });
}

// ── 3. Verify Tunnel Health ─────────────────────────────────────────────
async function verifyTunnel() {
    log('🔍 Verifying tunnel connectivity...');
    for (let i = 1; i <= 3; i++) {
        try {
            const res = await fetch(`${TUNNEL_URL}/health`, {
                headers: { 'Bypass-Tunnel-Reminder': 'true' },
                signal: AbortSignal.timeout(10000),
            });
            if (res.ok) {
                const data = await res.json();
                log(`✅ Tunnel verified! Status: ${data.status}`);
                return true;
            }
        } catch (e) {
            log(`   Attempt ${i}/3: ${e.message}`);
            if (i < 3) await new Promise(r => setTimeout(r, 3000));
        }
    }
    log('⚠️  Tunnel not responding — may need manual check');
    return false;
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

    // Step 2: Localtunnel (fixed subdomain — no Vercel update needed!)
    let { tunnel, url } = await startTunnel();

    // Step 3: Verify
    if (url) {
        await verifyTunnel();
    }

    // Step 4: Auto-Deploy Watcher
    const watcher = startAutoDeployWatcher();

    console.log('\n════════════════════════════════════════════');
    log('All services running:');
    console.log(`  Proxy:       http://localhost:${PROXY_PORT}`);
    console.log(`  Tunnel:      ${TUNNEL_URL} (fixed subdomain — never changes)`);
    console.log(`  Auto-Deploy: Watching web/ and proxy/`);
    console.log('  Logs:        proxy/proxy.log, proxy/tunnel.log, deploy.log');
    console.log('════════════════════════════════════════════\n');

    // Keep running — graceful shutdown on Ctrl+C
    process.on('SIGINT', () => {
        log('Shutting down...');
        proxy.kill();
        if (tunnel) tunnel.kill();
        watcher.kill();
        process.exit(0);
    });

    // Restart tunnel if it dies (same subdomain, so URL stays the same)
    const restartTunnel = () => {
        if (tunnel) {
            tunnel.on('exit', async (code) => {
                log(`⚠️  Tunnel exited (code ${code}). Restarting in 10s...`);
                setTimeout(async () => {
                    const result = await startTunnel();
                    tunnel = result.tunnel;
                    if (tunnel) restartTunnel(); // re-attach listener
                    log('🔄 Tunnel restarted');
                }, 10000);
            });
        }
    };
    restartTunnel();
}

main().catch((err) => {
    log('❌ Fatal: ' + err.message);
    process.exit(1);
});
