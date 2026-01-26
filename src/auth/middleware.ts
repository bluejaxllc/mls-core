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
        // Decode the token to get the payload (User ID is 'sub', Location ID is 'location_id')
        const decoded = jwt.decode(token) as any;

        if (!decoded || !decoded.sub) {
            throw new Error('Invalid token structure');
        }

        // In a real production scenario, we would verify the signature using the shared secret or public key.
        // jwt.verify(token, process.env.BLUE_JAX_SHARED_SECRET);

        const user = {
            id: decoded.sub,
            locationId: decoded.location_id,
            email: 'user@example.com', // JWT doesn't have email, fetching from DB or assuming for now
            roles: ['user'] // Default role
        };

        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};
