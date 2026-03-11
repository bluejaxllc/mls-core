import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/intelligence/save-scraped
 * Saves scraped listings into the core Listing table.
 * Upserts by sourceId + source to prevent duplicates.
 */
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { listings } = await req.json();
        if (!Array.isArray(listings) || listings.length === 0) {
            return NextResponse.json({ error: 'No listings provided' }, { status: 400 });
        }

        let saved = 0;
        let skipped = 0;

        for (const item of listings) {
            // Generate a stable sourceId from the listing
            const sourceId = item.id || item.sourceId || `${(item.source || 'unknown').toLowerCase().replace(/\s/g, '-')}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
            const source = item.source || 'Unknown';

            try {
                await prisma.listing.upsert({
                    where: {
                        unique_source_listing: {
                            sourceId,
                            source,
                        },
                    },
                    update: {
                        // Update price and status if listing already exists
                        price: item.price || undefined,
                        status: item.status || undefined,
                        lastVerifiedAt: new Date(),
                    },
                    create: {
                        propertyId: `SCR-${sourceId.slice(0, 12)}`,
                        title: item.title || null,
                        description: item.description || null,
                        price: item.price || null,
                        address: item.address || null,
                        city: item.city || 'Chihuahua',
                        state: item.state || 'Chihuahua',
                        propertyType: item.propertyType || 'residential',
                        status: item.status || 'DETECTED_SALE',
                        source,
                        sourceId,
                        sourceUrl: item.sourceUrl || item.url || null,
                        listingType: item.listingType || (item.status?.includes('RENT') ? 'RENT' : 'SALE'),
                        images: JSON.stringify(item.images || (item.imageUrl ? [item.imageUrl] : [])),
                        trustScore: 30, // Lower trust for scraped data
                        scrapedAt: new Date(),
                    },
                });
                saved++;
            } catch (e: any) {
                // Skip duplicates or constraint violations gracefully
                if (e.code === 'P2002') {
                    skipped++;
                } else {
                    console.error(`[save-scraped] Error saving listing ${sourceId}:`, e.message);
                    skipped++;
                }
            }
        }

        return NextResponse.json({
            success: true,
            saved,
            skipped,
            total: listings.length,
        });
    } catch (error: any) {
        console.error('[save-scraped] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
