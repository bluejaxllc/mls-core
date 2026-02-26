import { NextResponse } from 'next/server';
import { mlCrawler } from '@/lib/integrations/mercadolibre';
import { prismaIntelligence } from '@/lib/prisma-intelligence';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const offset = parseInt(searchParams.get('offset') || '0', 10);

        if (!query) {
            return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
        }

        console.log(`[INTELLIGENCE] Executing Live Search for: ${query} (Offset: ${offset})`);

        // Access the underlying client to bypass the database storage crawler method
        // @ts-ignore
        const client = mlCrawler.client;
        const searchResponse = await client.searchRealEstate('Chihuahua', 'MLM-CHH', 20, offset, query);

        const source = await prismaIntelligence.sourceProfile.findUnique({ where: { name: 'Mercado Libre Mexico' } });
        if (!source) throw new Error("Mercado Libre source profile not found");

        const mappedListings = [];

        for (const item of searchResponse.results) {
            let imageUrl = null;
            if (item.pictures && item.pictures.length > 0) {
                imageUrl = item.pictures[0].url || item.pictures[0].secure_url;
            }

            // Check if it already exists
            const existing = await prismaIntelligence.sourceSnapshot.findFirst({
                where: { sourceId: source.id, externalId: item.id },
                include: { observedListing: true }
            });

            if (existing && existing.observedListing) {
                mappedListings.push({
                    ...existing.observedListing,
                    imageUrl,
                    snapshot: { source }
                });
                continue;
            }

            // Otherwise, save it live
            const snapshot = await prismaIntelligence.sourceSnapshot.create({
                data: {
                    sourceId: source.id,
                    externalId: item.id,
                    url: item.permalink || '',
                    rawHtml: '',
                    rawJson: JSON.stringify(item),
                    contentHash: item.id
                }
            });

            const observed = await prismaIntelligence.observedListing.create({
                data: {
                    snapshotId: snapshot.id,
                    title: item.title,
                    price: item.price,
                    currency: item.currency_id,
                    address: item.location?.address_line || item.location?.city?.name || 'Chihuahua',
                    status: 'active'
                }
            });

            mappedListings.push({
                ...observed,
                imageUrl,
                snapshot: { source }
            });
        }

        return NextResponse.json(mappedListings);
    } catch (e: any) {
        console.error('[INTELLIGENCE] Live search failed:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
