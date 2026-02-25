import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { sourceId, url } = await req.json();

        // Since we are running in Next.js (serverless/edge environment), 
        // we cannot easily spawn long-running Puppeteer crawler jobs directly.
        // For now, we simulate a successful trigger to prevent UI errors.
        // In a full production setup, this would queue a job in Redis/SQS.

        console.log(`[INTELLIGENCE] Simulated crawl trigger for SourceID: ${sourceId}, URL: ${url}`);

        return NextResponse.json({
            jobId: `simulated-${Date.now()}`,
            message: 'Crawl scheduled (Simulated in Vercel environment)'
        });
    } catch (e: any) {
        console.error('[INTELLIGENCE] Failed to trigger crawl', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
