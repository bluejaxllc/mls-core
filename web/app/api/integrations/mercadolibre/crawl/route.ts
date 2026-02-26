import { NextResponse } from 'next/server';
import { mlAuth, mlCrawler } from '@/lib/integrations/mercadolibre';

export const dynamic = 'force-dynamic';

export async function POST() {
    // The native DOM structure extraction operates on the public catalog,
    // so we no longer require users to connect their Mercado Libre account via OAuth.

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
