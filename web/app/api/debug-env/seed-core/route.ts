import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed-data';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        await seedDatabase();
        return NextResponse.json({ message: 'Core database seeded successfully' }, { status: 200 });
    } catch (e: any) {
        console.error('[CORE SEED] Failed to seed core data', e);
        return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
    }
}
