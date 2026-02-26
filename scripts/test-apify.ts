import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
    token: process.env.APIFY_API_TOKEN,
});

const input = {
    urls: [
        "https://www.facebook.com/marketplace/nyc/cars/"
    ],
    deepScrape: false,
    strictFiltering: true
};

(async () => {
    try {
        console.log("Starting Apify Actor test...");
        const run = await client.actor("Y0QGH7cuqgKtNbEgt").call(input);

        console.log(`run.defaultDatasetId: ${run.defaultDatasetId}`);
        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        console.log(`Items found: ${items.length}`);
        if (items.length > 0) {
            console.log("Sample Item[0]:");
            console.dir(items[0], { depth: null });
        }
    } catch (e) {
        console.error("Error running Apify:", e);
    }
})();
