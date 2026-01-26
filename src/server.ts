import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { GovernanceEventType, ListingStatus } from './rules/types';
import { webhookHandler } from './auth/webhook';
import { verifyBlueJaxToken } from './auth/middleware';
import { provisionHandler } from './provisioning/handler';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
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

// Provisioning Endpoint (Protected by nothing for now? Or Admin Token? Assuming public for this flow or validated by context)
// TODO: Protect this endpoint!
app.post('/api/provision', provisionHandler);

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

// Start Server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`MLS Core API running on http://localhost:${PORT}`);
    });
}

export default app;
