import { PrismaClient } from '../src/generated/client-core';
const p = new PrismaClient();
async function check() {
    console.log('Users:', await p.user.count());
    console.log('Listings:', await p.listing.count());
    console.log('Reviews:', await p.review.count());
    console.log('Favorites:', await p.favorite.count());
    console.log('Collections:', await p.collection.count());
    await p['$disconnect']();
}
check();
