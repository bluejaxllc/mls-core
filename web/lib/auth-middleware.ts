import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AuthUser {
    id: string;
    locationId?: string;
    email: string;
    roles: string[];
    brokerId?: string;
}

/**
 * Verifies and extracts user from a Bearer JWT token.
 * Returns the user object or a NextResponse error.
 */
export async function verifyAuth(req: NextRequest): Promise<AuthUser | NextResponse> {
    const authHeader = req.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
        let decoded: any;

        const enableInsecure = process.env.ENABLE_INSECURE_AUTH === 'true' ||
            process.env.NODE_ENV === 'development';

        if (enableInsecure) {
            if (token === 'mock-jwt-token') {
                decoded = {
                    sub: 'legacy_user_123',
                    location_id: 'mock_location',
                    email: 'legacy@example.com',
                    roles: ['admin']
                };
            } else {
                decoded = jwt.decode(token);
            }
        } else {
            const secret = (process.env.JWT_SECRET || process.env.BLUE_JAX_PUBLIC_KEY || '').trim();
            if (secret) {
                decoded = jwt.verify(token, secret);
            } else {
                throw new Error('Verification secret missing and insecure mode not enabled');
            }
        }

        if (!decoded || !decoded.sub) {
            throw new Error('Invalid token structure');
        }

        return {
            id: decoded.sub,
            locationId: decoded.location_id,
            email: decoded.email || 'user@example.com',
            roles: decoded.roles || ['user'],
            brokerId: decoded.broker_id || decoded.brokerId || undefined
        };
    } catch (error: any) {
        console.error('[AUTH] Token verification failed:', error.message);
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 });
    }
}

/** Type guard to check if verifyAuth returned an error response */
export function isAuthError(result: AuthUser | NextResponse): result is NextResponse {
    return result instanceof NextResponse;
}
