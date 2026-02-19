import express from 'express';
import { MercadoLibreAuth } from '../integrations/mercadolibre/auth';
import crypto from 'crypto';

const router = express.Router();
const mlAuth = new MercadoLibreAuth();

// Store state for CSRF protection
const stateStore = new Map<string, number>();

// Clean up old states (older than 10 minutes)
setInterval(() => {
    const now = Date.now();
    for (const [state, timestamp] of stateStore.entries()) {
        if (now - timestamp > 10 * 60 * 1000) {
            stateStore.delete(state);
        }
    }
}, 60 * 1000);

// Authorization initiation
router.get('/auth', (req, res) => {
    // Generate secure random state for CSRF protection
    const state = crypto.randomBytes(16).toString('hex');
    stateStore.set(state, Date.now());

    const authUrl = mlAuth.getAuthUrl(state);

    console.log('[ML OAuth] Redirecting to Mercado Libre authorization...');
    res.redirect(authUrl);
});

// OAuth callback handler
router.get('/callback', async (req, res) => {
    const { code, state, error } = req.query;

    // Check for authorization errors
    if (error) {
        console.error('[ML OAuth] Authorization error:', error);
        return res.status(400).json({
            success: false,
            error: 'Authorization denied',
            detail: error
        });
    }

    // Validate code
    if (!code || typeof code !== 'string') {
        return res.status(400).json({
            success: false,
            error: 'No authorization code received'
        });
    }

    console.log(`[ML OAuth] Processing callback for code: ${code?.toString().substring(0, 10)}...`);


    try {
        // Exchange code for access token
        await mlAuth.getAccessToken(code);

        console.log('[ML OAuth] ✅ Authorization successful!');
        res.json({
            success: true,
            message: 'Authorization successful! You can now use the crawler.',
            authenticated: mlAuth.isAuthenticated()
        });

    } catch (error: any) {
        console.error('[ML OAuth] Failed to get access token:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to obtain access token',
            detail: error.message
        });
    }
});

// Trigger crawler
router.post('/crawl', async (req, res) => {
    if (!mlAuth.isAuthenticated()) {
        return res.status(401).json({
            success: false,
            error: 'Not authenticated',
            message: 'Please authorize first via /api/auth/mercadolibre/auth'
        });
    }

    try {
        console.log('[ML Crawler] Starting manual crawl via API...');

        // Dynamic import to avoid circular dependencies if any
        const { MercadoLibreCrawler } = await import('../integrations/mercadolibre/crawler');

        const crawler = new MercadoLibreCrawler(mlAuth);
        const count = await crawler.crawlChihuahua(50); // Default limit

        res.json({
            success: true,
            message: `Successfully initiated crawl. Processed ${count} items.`,
            count
        });

    } catch (error: any) {
        console.error('[ML Crawler] Crawl failed - Full error details:');
        console.error('Message:', error.message);
        console.error('Stack:', error.stack);
        console.error('Full error:', JSON.stringify(error, null, 2));
        res.status(500).json({
            success: false,
            error: 'Crawler failed',
            detail: error.message,
            stack: error.stack
        });
    }
});

// Check authentication status
router.get('/status', (req, res) => {
    res.json({
        authenticated: mlAuth.isAuthenticated(),
        message: mlAuth.isAuthenticated()
            ? 'Authenticated and ready to crawl'
            : 'Not authenticated. Visit /api/auth/mercadolibre/auth to authorize'
    });
});

export default router;
export { mlAuth };
