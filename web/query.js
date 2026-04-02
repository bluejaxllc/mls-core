const { Client } = require('pg');

const client = new Client({ connectionString: 'postgres://root:TqDWeNnZqjWdIXjWqLwIawbNnNnjWixw@autorack.proxy.rlwy.net:18659/railway' });

async function run() {
    await client.connect();
    try {
        const res = await client.query('SELECT source, count(*) as count, max("createdAt") as latest FROM "Property" GROUP BY source ORDER BY count DESC');
        console.table(res.rows);
    } catch (e) {
        console.log("No Property table, trying Listing...");
        const res2 = await client.query('SELECT source, count(*) as count, max("createdAt") as latest FROM "Listing" GROUP BY source ORDER BY count DESC');
        console.table(res2.rows);
    }
    await client.end();
}
run();
