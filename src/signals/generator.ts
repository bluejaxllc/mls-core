import { prismaIntelligence } from '../lib/intelligencePrisma';
import { MatcherService, MatchResult } from './matcher';

export class SignalGenerator {
    private matcher = new MatcherService();

    async processObservation(observedId: string) {
        const observed = await prismaIntelligence.observedListing.findUnique({
            where: { id: observedId }
        });
        if (!observed) return;

        // 1. Find Match
        const match = await this.matcher.findMatch(observedId);

        // 2. Generate Signals
        if (match.matchType !== 'NONE' && match.matchedCanonicalId) {
            console.log(`[Signal] Match found for ${observedId} -> ${match.matchedCanonicalId}`);

            // Check for Diff (e.g. Price)
            // We need to fetch canonical to compare
            // In real implementaion, this calls a specialized PriceDiffRule

            await this.createSignal({
                type: 'POSSIBLE_DUPLICATE',
                severity: 'INFO',
                observedListingId: observedId,
                matchedListingId: match.matchedCanonicalId,
                payload: { confidence: match.confidence, reason: 'Address/Fingerprint Match' }
            });

        } else {
            // No match found -> Potentially a new listing that is "Unregistered"
            await this.createSignal({
                type: 'UNREGISTERED_LISTING',
                severity: 'WARNING',
                observedListingId: observedId,
                payload: { reason: 'No matching property found in MLS' }
            });
        }
    }

    private async createSignal(data: {
        type: string;
        severity: string;
        observedListingId: string;
        matchedListingId?: string;
        payload: any;
    }) {
        await prismaIntelligence.signal.create({
            data: {
                type: data.type,
                severity: data.severity,
                observedListingId: data.observedListingId,
                matchedListingId: data.matchedListingId,
                payload: JSON.stringify(data.payload),
                status: 'OPEN'
            }
        });
    }
}

export const signalGenerator = new SignalGenerator();
