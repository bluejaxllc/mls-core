import { NextResponse } from 'next/server';
import { mlAuth } from '@/lib/integrations/mercadolibre';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
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
        await mlAuth.getAccessToken(code);

        // Redirect back to intelligence page after success
        return NextResponse.redirect(new URL('/intelligence', req.url));
    } catch (e: any) {
        console.error('[ML OAuth] Callback failed:', e.message);
        return NextResponse.json({ error: 'Failed to obtain access token', detail: e.message }, { status: 500 });
    }
}
