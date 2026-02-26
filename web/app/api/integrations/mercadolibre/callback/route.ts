import { NextRequest, NextResponse } from 'next/server';
import { mlAuth } from '@/lib/integrations/mercadolibre';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.json({ error: 'Authorization denied', detail: error }, { status: 400 });
    }

    if (!code) {
        return NextResponse.json({ error: 'No authorization code received' }, { status: 400 });
    }

    try {
        let host = req.headers.get('x-forwarded-host') || req.headers.get('host') || req.nextUrl.host;
        let protocol = req.headers.get('x-forwarded-proto') || 'https';
        if (host?.includes('localhost')) protocol = 'http';
        const redirectUri = `${protocol}://${host}/api/integrations/mercadolibre/callback`;

        await mlAuth.getAccessToken(code, redirectUri);

        // Redirect back to intelligence page after success
        return NextResponse.redirect(new URL('/intelligence', req.url));
    } catch (e: any) {
        console.error('[ML OAuth] Callback failed:', e.message);
        return NextResponse.json({ error: 'Failed to obtain access token', detail: e.message }, { status: 500 });
    }
}
