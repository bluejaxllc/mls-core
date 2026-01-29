import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { GovernanceEventType, ListingStatus } from './rules/types';
import { webhookHandler } from './auth/bluejaxWebhooks';
import { verifyBlueJaxToken } from './auth/middleware';
import { provisionHandler } from './provisioning/handler';
import { ruleEngineService, coreServices } from './rules/setup';
import { prisma } from './lib/prisma';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://mls-governance-web.vercel.app', // Placeholder - actual URL should be in env
        /\.vercel\.app$/ // Allow all Vercel previews
    ],
    credentials: true
}));
app.use(bodyParser.json());

// Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'MLS Core API' });
});

// Provisioning Endpoint (Protected by Blue Jax JWT)
app.post('/api/provision', verifyBlueJaxToken, provisionHandler);

// Auth Webhook (Blue Jax -> MLS)
// Protected by shared secret signature verification (TODO)
app.post('/api/webhooks/bluejax/users', webhookHandler);

// Secured Routes Example
// All /api/protected routes require a valid Blue Jax token
app.use('/api/protected', verifyBlueJaxToken);

app.get('/api/protected/me', (req: any, res) => {
    res.json({
        message: 'You are authenticated via Blue Jax',
        user: req.user
    });
});

// Dashboard Data (Protected)
app.get('/api/protected/dashboard/stats', async (req, res) => {
    try {
        const [blockCount, rules] = await Promise.all([
            prisma.auditLog.count({ where: { overallOutcome: 'BLOCK' } }),
            ruleEngineService.getRuleConfig()
        ]);

        res.json({
            activeListings: 1204, // Placeholder
            pendingReview: 18,     // Placeholder
            governanceAlerts: blockCount,
            systemHealth: '99.9%',
            activeRules: rules.filter(r => r.status === 'ACTIVE').length
        });
    } catch (error: any) {
        console.error('[API] Dashboard stats failed:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/protected/dashboard/feed', async (req, res) => {
    try {
        const logs = await prisma.auditLog.findMany({
            take: 10,
            orderBy: { timestamp: 'desc' }
        });
        res.json(logs);
    } catch (error: any) {
        console.error('[API] Dashboard feed failed:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`MLS Core API running on port ${PORT}`);
});

export default app;
