// Simple test route to check if everything loads
router.get('/test-crawler', async (req, res) => {
    try {
        console.log('[Test] Step 1: Starting test...');

        console.log('[Test] Step 2: Importing crawler...');
        const { MercadoLibreCrawler } = await import('../integrations/mercadolibre/crawler');

        console.log('[Test] Step 3: Checking auth...');
        if (!mlAuth.isAuthenticated()) {
            return res.json({ error: 'Not authenticated' });
        }

        console.log('[Test] Step 4: Creating crawler instance...');
        const crawler = new MercadoLibreCrawler(mlAuth);

        console.log('[Test] Step 5: Success!');
        res.json({ success: true, message: 'All checks passed!' });
    } catch (error: any) {
        console.error('[Test] Error at step:', error.message);
        console.error('[Test] Stack:', error.stack);
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});

export default router;
