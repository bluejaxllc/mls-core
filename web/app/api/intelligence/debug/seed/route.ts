import { NextResponse } from 'next/server';
import { prismaIntelligence } from '@/lib/prisma-intelligence';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const sourceId = searchParams.get('sourceId');
        let finalSourceId = sourceId ? String(sourceId) : undefined;

        if (!finalSourceId) {
            // Check if DebugSource exists, otherwise create it
            let profile = await prismaIntelligence.sourceProfile.findUnique({
                where: { name: `DebugSource-Testing` }
            });

            if (!profile) {
                profile = await prismaIntelligence.sourceProfile.create({
                    data: {
                        name: `DebugSource-Testing`,
                        type: 'PORTAL',
                        baseUrl: 'http://debug.com',
                        trustScore: 80,
                        config: JSON.stringify({
                            selectors: {
                                listWrapper: '.listing-grid',
                                listItem: '.property-card',
                                listingTitle: '.card-title',
                                listingPrice: '.price-tag'
                            }
                        })
                    }
                });
            }
            finalSourceId = profile.id;
        }

        const obs = await prismaIntelligence.observedListing.create({
            data: {
                snapshot: {
                    create: {
                        source: { connect: { id: finalSourceId as string } },
                        externalId: `debug-${Date.now()}`,
                        url: 'http://debug.com/prop',
                        contentHash: `hash-${Date.now()}`,
                        rawJson: '{"debug": true}'
                    }
                },
                title: 'Detected Property (Debug Seed) ' + Math.floor(Math.random() * 100),
                price: 7500000 + Math.floor(Math.random() * 500000),
                address: `Calle de Prueba ${Math.floor(Math.random() * 1000)}, Zona Debug`,
                geoHash: 'abc',
                addressHash: `addr-${Date.now()}`,
                confidenceScore: 0.95
            }
        });

        // Upsert new sources mapping dynamically
        await prismaIntelligence.sourceProfile.upsert({ where: { name: 'Inmuebles24' }, update: { isEnabled: true }, create: { name: 'Inmuebles24', type: 'PORTAL', baseUrl: 'https://www.inmuebles24.com', trustScore: 75, isEnabled: true, config: '{}' } });
        await prismaIntelligence.sourceProfile.upsert({ where: { name: 'Lamudi' }, update: { isEnabled: true }, create: { name: 'Lamudi', type: 'PORTAL', baseUrl: 'https://www.lamudi.com.mx', trustScore: 70, isEnabled: true, config: '{}' } });
        await prismaIntelligence.sourceProfile.upsert({ where: { name: 'Vivanuncios' }, update: { isEnabled: true }, create: { name: 'Vivanuncios', type: 'PORTAL', baseUrl: 'https://www.vivanuncios.com.mx', trustScore: 70, isEnabled: true, config: '{}' } });

        return NextResponse.json({ message: 'Seeded successfully', listing: obs });
    } catch (e: any) {
        console.error('[INTELLIGENCE] Failed to seed debug data', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
