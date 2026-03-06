import fs from 'fs';
async function test() {
    try {
        const res = await fetch('http://localhost:3000/api/listings/live?city=Chihuahua&propertyType=house');
        if (!res.ok) {
            const txt = await res.text();
            fs.writeFileSync('test_error.txt', txt);
            console.error('SERVER ERROR Saved to test_error.txt');
            return;
        }
        const data = await res.json();
        console.log(`Source: ${data.source}`);
        console.log(`Listings: ${data.listings?.length}`);
        if (data.listings?.length > 0) {
            console.log(`Sample: [${data.listings[0].source}] ${data.listings[0].title} - ${data.listings[0].price}`);
        }
    } catch (e) {
        console.error(e.message);
    }
}
test();
