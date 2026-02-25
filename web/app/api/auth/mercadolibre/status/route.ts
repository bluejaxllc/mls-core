import { NextResponse } from 'next/server';
import { mlAuth } from '@/lib/integrations/mercadolibre';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const authenticated = await mlAuth.isAuthenticated();
        return NextResponse.json({
            authenticated,
            message: authenticated
                ? 'Authenticated and ready to crawl'
                : 'Not authenticated. Visit /api/auth/mercadolibre/auth to authorize'
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
