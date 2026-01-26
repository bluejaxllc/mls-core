
import { ListingSource, TrustLevel } from './types';

export class TrustService {
    private sourceTrustMap: Map<string, number> = new Map();

    constructor() {
        // Default trust scores
        this.sourceTrustMap.set(ListingSource.MLS_FEED, TrustLevel.TRUSTED);
        this.sourceTrustMap.set(ListingSource.MANUAL, TrustLevel.CONFIRMED);
        this.sourceTrustMap.set(ListingSource.SCRAPER, TrustLevel.SCRAPED);

        // Can allow specific overrides by source ID
        this.sourceTrustMap.set('TRUSTED_BROKER_FEED', TrustLevel.VERIFIED);
    }

    getTrustScore(source: ListingSource, sourceId?: string): number {
        if (sourceId && this.sourceTrustMap.has(sourceId)) {
            return this.sourceTrustMap.get(sourceId)!;
        }
        return this.sourceTrustMap.get(source) || TrustLevel.UNVERIFIED;
    }
}
