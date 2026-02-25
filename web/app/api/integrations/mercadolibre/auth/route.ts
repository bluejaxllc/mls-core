import { NextResponse } from 'next/server';
import { mlAuth } from '@/lib/integrations/mercadolibre';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const state = crypto.randomBytes(16).toString('hex');
        // In a real app, we'd store this state in a cookie or session to verify in callback
        const authUrl = mlAuth.getAuthUrl(state);

        return NextResponse.redirect(authUrl);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
