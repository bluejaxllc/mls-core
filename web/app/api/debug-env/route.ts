import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({
        INTELLIGENCE_DATABASE_URL: process.env.INTELLIGENCE_DATABASE_URL,
        DATABASE_URL: process.env.DATABASE_URL,
        POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL
    });
}
