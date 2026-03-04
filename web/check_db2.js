const { Client } = require('pg');

const client = new Client({
    connectionString: "postgresql://postgres.erapajgkukxqwvmwxefq:1sMfsHUkqgVj6Dlx@aws-1-us-east-1.pooler.supabase.com:5432/postgres" // port 5432
});

async function main() {
    await client.connect();
    const res = await client.query("SELECT email, \"emailVerified\" FROM \"User\" WHERE email = 'edgar@bluejax.ai'");
    console.log(res.rows);
    await client.end();
}

main().catch(console.error);
