import { SourceConfig } from './types';

/**
 * Facebook Marketplace config.
 * 
 * Used by the Puppeteer drip crawler for DOM extraction.
 * Selectors target the main marketplace listing grid on desktop Facebook.
 * Anti-bot settings control the drip delay between actions.
 */
export const facebookConfig: SourceConfig = {
    selectors: {
        listWrapper: 'div[role="main"]',
        listItem: 'a[href*="/marketplace/item/"]',
        listingTitle: 'span[dir="auto"]',
        listingPrice: 'span[dir="auto"]',
        listingAddress: 'span[dir="auto"]',
        listingImage: 'img',
        detailLink: ''
    },
    pagination: {
        strategy: 'SCROLL',
        maxPages: 1          // Single page — avoid rate limits
    },
    antiBot: {
        useProxies: true,    // Residential proxies via Apify
        delayRange: [5000, 10000],  // Longer delays for FB
        stealthMode: true
    }
};
