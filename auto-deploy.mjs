/**
 * MLS Auto-Deploy Watcher
 * Watches for file changes in the web/ directory.
 * On change, debounces for 10 seconds, then auto git add/commit/push.
 * This triggers Vercel's auto-deploy from the main branch.
 *
 * Usage:  node auto-deploy.mjs
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const chokidar = require('./web/node_modules/chokidar');
import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname);
const WEB_DIR = resolve(ROOT, 'web');

const DEBOUNCE_MS = 10_000;  // 10 seconds — batches rapid saves
let timer = null;
let changedFiles = new Set();
let pushing = false;

function timestamp() {
    return new Date().toLocaleTimeString('es-MX', { hour12: false });
}

function autoPush() {
    if (pushing) return;
    pushing = true;

    const files = Array.from(changedFiles);
    changedFiles.clear();

    try {
        // Check if there are actual git changes
        const status = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf-8' }).trim();
        if (!status) {
            console.log(`[${timestamp()}] ⏭️  No git changes to push`);
            pushing = false;
            return;
        }

        const changeCount = status.split('\n').length;
        console.log(`[${timestamp()}] 📦 ${changeCount} file(s) changed, committing...`);

        // Stage, commit, push
        execSync('git add -A', { cwd: ROOT, encoding: 'utf-8' });

        // Generate smart commit message
        const shortList = files.slice(0, 3).map(f => f.replace(/.*[\/\\]/, '')).join(', ');
        const msg = `auto: update ${shortList}${files.length > 3 ? ` +${files.length - 3} more` : ''}`;

        execSync(`git commit -m "${msg}"`, { cwd: ROOT, encoding: 'utf-8' });
        execSync('git push origin main', { cwd: ROOT, encoding: 'utf-8', timeout: 30_000 });

        console.log(`[${timestamp()}] ✅ Pushed to origin/main → Vercel deploy triggered`);
    } catch (err) {
        console.error(`[${timestamp()}] ❌ Push failed:`, err.message?.split('\n')[0]);
    } finally {
        pushing = false;
    }
}

// Watch the web/ directory + proxy/ for changes
const watcher = chokidar.watch([WEB_DIR, resolve(ROOT, 'proxy')], {
    ignored: [
        '**/node_modules/**',
        '**/.next/**',
        '**/.git/**',
        '**/proxy.log',
        '**/tunnel.log',
        '**/*.log',
    ],
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: { stabilityThreshold: 2000, pollInterval: 500 },
});

watcher.on('all', (event, path) => {
    if (event === 'addDir') return;
    changedFiles.add(path);

    // Reset the debounce timer
    if (timer) clearTimeout(timer);
    timer = setTimeout(autoPush, DEBOUNCE_MS);

    console.log(`[${timestamp()}] 👁️  ${event}: ${path.replace(ROOT, '').replace(/^[\/\\]/, '')}`);
});

watcher.on('ready', () => {
    console.log(`\n🚀 MLS Auto-Deploy Watcher active`);
    console.log(`   Watching: web/ and proxy/`);
    console.log(`   Debounce: ${DEBOUNCE_MS / 1000}s`);
    console.log(`   Target:   git push origin main → Vercel auto-deploy`);
    console.log(`   Press Ctrl+C to stop\n`);
});
