
import { prismaIntelligence } from '../src/lib/intelligencePrisma';

async function checkData() {
    const count = await prismaIntelligence.observedListing.count();
    console.log(`Total Observed Listings: ${count}`);

    const sources = await prismaIntelligence.sourceProfile.findMany();
    console.log(`Sources configured: ${sources.length}`);
    sources.forEach(s => console.log(` - ${s.name} (${s.type})`));
}

checkData().catch(console.error);
