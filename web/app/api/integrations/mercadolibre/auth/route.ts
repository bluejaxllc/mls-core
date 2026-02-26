import { NextRequest, NextResponse } from 'next/server';
import { mlAuth } from '@/lib/integrations/mercadolibre';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const state = crypto.randomBytes(16).toString('hex');

        // Dynamically resolve exact hostname
        let host = req.headers.get('x-forwarded-host') || req.headers.get('host') || req.nextUrl.host;
        let protocol = req.headers.get('x-forwarded-proto') || 'https';
        if (host?.includes('localhost')) protocol = 'http';
        const redirectUri = `${protocol}://${host}/api/integrations/mercadolibre/callback`;

        // In a real app, we'd store this state in a cookie or session to verify in callback
        const authUrl = mlAuth.getAuthUrl(state, redirectUri);

        return NextResponse.redirect(authUrl);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
