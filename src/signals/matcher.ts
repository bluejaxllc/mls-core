import { prisma as prismaCore } from '../lib/prisma';
import { prismaIntelligence } from '../lib/intelligencePrisma';

export interface MatchResult {
    observedListingId: string;
    matchedCanonicalId: string | null;
    matchType: 'EXACT_ID' | 'FINGERPRINT' | 'NONE';
    confidence: number;
}

export class MatcherService {

    /**
     * Attempts to match an observed listing to a canonical MLS listing.
     */
    async findMatch(observedId: string): Promise<MatchResult> {
        const observed = await prismaIntelligence.observedListing.findUnique({
            where: { id: observedId }
        });

        if (!observed) throw new Error('Observed listing not found');

        // 1. Check for exact Source ID match (if we were tracking that in canonical)
        // Skipped for now as canonical might not have sourceId mapped 1:1

        // 2. Check GeoHash Match (Strong Signal)
        if (observed.geoHash) {
            // Typically we'd have geohash on canonical too, but here we query by coords range?
            // For this MVP, let's assume we fetch candidates.
            // In a real app, use PostGIS. Here, we can't easily query SQLite by distance effectively without loading data.
            // So we'll skip direct SQL geo query and assume strict metadata match for MVP.
        }

        // 3. Check Address Hash Match
        if (observed.addressHash) {
            // Fetch all canonical listings (Limit for demo) to match hash
            // Ideally canonical has addressHash column
            const candidates = await prismaCore.listing.findMany({
                // Optimization: Add addressHash to Canonical Schema? 
                // For now, simple string match on address if present
                where: { address: observed.address || undefined }
            });

            if (candidates.length > 0) {
                return {
                    observedListingId: observedId,
                    matchedCanonicalId: candidates[0].id,
                    matchType: 'FINGERPRINT',
                    confidence: 0.9
                };
            }
        }

        return {
            observedListingId: observedId,
            matchedCanonicalId: null,
            matchType: 'NONE',
            confidence: 0
        };
    }
}

export const matcherService = new MatcherService();
