import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: any;
}

export const verifyBlueJaxToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = (req as any).headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    try {
        let decoded: any;

        // EXPLICIT DEV BYPASS
        const enableInsecure = process.env.ENABLE_INSECURE_AUTH === 'true';

        if (enableInsecure) {
            console.warn('[AUTH] Insecure Mode Enabled: Skipping signature verification');
            console.log(`[AUTH] Received token: ${token.substring(0, 20)}...`);

            if (token === 'mock-jwt-token') {
                console.log('[AUTH] Handling legacy mock token');
                decoded = {
                    sub: 'legacy_user_123',
                    location_id: 'mock_location',
                    email: 'legacy@example.com',
                    roles: ['admin']
                };
            } else {
                decoded = jwt.decode(token);
                console.log('[AUTH] Decoded result:', JSON.stringify(decoded));
            }
        } else {
            const secret = (process.env.JWT_SECRET || process.env.BLUE_JAX_PUBLIC_KEY || '').trim();
            if (secret && secret !== '') {
                decoded = jwt.verify(token, secret);
            } else {
                throw new Error('Verification secret missing and insecure mode not enabled');
            }
        }

        if (!decoded || !decoded.sub) {
            throw new Error('Invalid token structure');
        }

        const user = {
            id: decoded.sub,
            locationId: decoded.location_id,
            email: decoded.email || 'user@example.com',
            roles: decoded.roles || ['user'],
            brokerId: decoded.broker_id || decoded.brokerId || undefined
        };

        req.user = user;
        next();
    } catch (error: any) {
        console.error('[AUTH] Token verification failed:', error.message);
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};
