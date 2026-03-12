const { Client } = require('pg');

const client = new Client({
    connectionString: "postgresql://postgres.erapajgkukxqwvmwxefq:1sMfsHUkqgVj6Dlx@aws-1-us-east-1.pooler.supabase.com:5432/postgres" // port 5432
});

async function main() {
    await client.connect();
    const res = await client.query("DELETE FROM \"User\" WHERE email IN ('edgar@bluejax.ai', 'edgar+1@bluejax.ai', 'test.prod2@bluejax.ai', 'test.real@bluejax.ai')");
    console.log("Deleted rows:", res.rowCount);
    await client.end();
}

main().catch(console.error);
