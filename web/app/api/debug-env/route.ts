import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({
        MLS_INTELLIGENCE_URL: process.env.MLS_INTELLIGENCE_URL?.slice(0, 30) + '...',
        MLS_DATABASE_URL: process.env.MLS_DATABASE_URL ? `SET (${process.env.MLS_DATABASE_URL.length} chars, first30: ${process.env.MLS_DATABASE_URL.slice(0,30)})` : 'NOT SET',
        POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? `SET (${process.env.POSTGRES_PRISMA_URL.length} chars, first30: ${process.env.POSTGRES_PRISMA_URL.slice(0,30)})` : 'NOT SET',
        POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING?.slice(0, 30) + '...',
        DATABASE_URL: process.env.DATABASE_URL ? `SET (${process.env.DATABASE_URL.length} chars, first30: ${process.env.DATABASE_URL.slice(0,30)})` : 'NOT SET',
    });
}
