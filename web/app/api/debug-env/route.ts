import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({
        MLS_INTELLIGENCE_URL: process.env.MLS_INTELLIGENCE_URL?.slice(0, 30) + '...',
        MLS_DATABASE_URL: process.env.MLS_DATABASE_URL?.slice(0, 30) + '...',
        INTELLIGENCE_DATABASE_URL: process.env.INTELLIGENCE_DATABASE_URL?.slice(0, 30) + '...',
        DATABASE_URL: process.env.DATABASE_URL?.slice(0, 30) + '...'
    });
}
