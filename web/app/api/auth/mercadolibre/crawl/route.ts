import { NextResponse } from 'next/server';
import { mlAuth, mlCrawler } from '@/lib/integrations/mercadolibre';

export const dynamic = 'force-dynamic';

export async function POST() {
    if (!(await mlAuth.isAuthenticated())) {
        return NextResponse.json({
            success: false,
            error: 'Not authenticated',
            message: 'Please authorize first via /api/auth/mercadolibre/auth'
        }, { status: 401 });
    }

    try {
        console.log('[ML Crawler] Starting manual crawl via Next.js API...');

        // Use the crawler we ported
        const count = await mlCrawler.crawlChihuahua(50);

        return NextResponse.json({
            success: true,
            message: `Successfully initiated crawl. Processed ${count} items.`,
            count
        });
    } catch (e: any) {
        console.error('[ML Crawler] Crawl failed:', e);
        return NextResponse.json({
            success: false,
            error: 'Crawler failed',
            detail: e.message
        }, { status: 500 });
    }
}
