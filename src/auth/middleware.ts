import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// TODO: Replace with actual JWT Public Key from Blue Jax / JWKS endpoint
const BLUE_JAX_PUBLIC_KEY = process.env.BLUE_JAX_PUBLIC_KEY || 'mock-public-key';

export interface AuthRequest extends Request {
    user?: any;
}

export const verifyBlueJaxToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    try {
        let decoded: any;

        // If a secret is provided, verify the signature
        if (process.env.BLUE_JAX_API_TOKEN) {
            decoded = jwt.verify(token, process.env.BLUE_JAX_API_TOKEN);
        } else {
            console.warn('[AUTH] No BLUE_JAX_API_TOKEN found, falling back to insecure decode');
            decoded = jwt.decode(token);
        }

        if (!decoded || !decoded.sub) {
            throw new Error('Invalid token structure');
        }

        const user = {
            id: decoded.sub,
            locationId: decoded.location_id,
            email: decoded.email || 'user@example.com',
            roles: decoded.roles || ['user']
        };

        req.user = user;
        next();
    } catch (error: any) {
        console.error('[AUTH] Token verification failed:', error.message);
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};
