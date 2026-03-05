import { NextResponse } from 'next/server';
import { mlAuth } from '@/lib/integrations/mercadolibre';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const oauthAuthenticated = await mlAuth.isAuthenticated();
        // Public API always works — OAuth just gives higher rate limits
        return NextResponse.json({
            authenticated: true, // Public API is always available
            oauthConnected: oauthAuthenticated,
            message: oauthAuthenticated
                ? 'Authenticated with OAuth — full access'
                : 'Using public API — connect OAuth for higher rate limits'
        });
    } catch (e: any) {
        // Even if auth check fails, public API still works
        return NextResponse.json({
            authenticated: true,
            oauthConnected: false,
            message: 'Using public API (OAuth check failed)'
        });
    }
}
