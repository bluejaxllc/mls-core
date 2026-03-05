import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const keys = Object.keys(process.env).filter(k => k.includes('MLS') || k.includes('URL') || k.includes('DATA'));
    const dump: Record<string, string | undefined> = {};
    for (const key of keys) {
        dump[key] = process.env[key];
    }
    return NextResponse.json({
        success: true,
        typeof_mls_db: typeof process.env.MLS_DATABASE_URL,
        typeof_mls_intel: typeof process.env.MLS_INTELLIGENCE_URL,
        literal_mls_db: process.env.MLS_DATABASE_URL + "",
        dump
    });
}
