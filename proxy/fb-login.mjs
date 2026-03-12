/**
 * One-time Facebook Login Script
 * 
 * This opens a VISIBLE Chrome window with a dedicated profile for the MLS scraper.
 * Log into Facebook, then close the window. The session is saved automatically
 * and will be reused by the proxy's headless Facebook scraper.
 * 
 * Usage: node proxy/fb-login.mjs
 */
import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import { fileURLToPath } from 'url';

puppeteerExtra.use(StealthPlugin());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FB_PROFILE_DIR = path.join(__dirname, 'fb-profile');

console.log('\n🔐 Facebook Login for MLS Scraper');
console.log('================================');
console.log(`Profile directory: ${FB_PROFILE_DIR}`);
console.log('\nA Chrome window will open. Please:');
console.log('  1. Log into your Facebook account');
console.log('  2. Once logged in, close the browser window');
console.log('  3. The session will be saved automatically\n');

const browser = await puppeteerExtra.launch({
    headless: false, // VISIBLE window so user can log in
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--window-size=1280,900',
        `--user-data-dir=${FB_PROFILE_DIR}`,
    ],
    ignoreDefaultArgs: ['--enable-automation'],
});

const page = await browser.newPage();
await page.goto('https://www.facebook.com/marketplace/', { waitUntil: 'networkidle2' });

console.log('✅ Browser opened. Waiting for you to log in and close the window...');

// Wait for the browser to be closed by the user
browser.on('disconnected', () => {
    console.log('\n✅ Session saved! The proxy will now use this Facebook session for scraping.');
    console.log('   You can restart the proxy (node proxy/ml-proxy.mjs) to start using it.\n');
    process.exit(0);
});
