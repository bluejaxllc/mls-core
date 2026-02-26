import { SourceConfig } from './types';

export const facebookConfig: SourceConfig = {
    selectors: {
        listWrapper: 'div[role="main"]',
        listItem: 'div[style*="max-width"] a[role="link"][tabindex="0"], a[href*="/marketplace/item/"]',
        listingTitle: 'span[dir="auto"]',
        listingPrice: 'span[dir="auto"]',
        listingAddress: 'span[dir="auto"]',
        listingImage: 'img',
        detailLink: ''
    },
    pagination: {
        strategy: 'SCROLL',
        maxPages: 3
    },
    antiBot: {
        useProxies: false,
        delayRange: [3000, 8000],
        stealthMode: true
    }
};
