const { Client } = require('pg');

const client = new Client({
    connectionString: "postgresql://postgres.erapajgkukxqwvmwxefq:1sMfsHUkqgVj6Dlx@aws-1-us-east-1.pooler.supabase.com:5432/postgres" // port 5432
});

async function main() {
    await client.connect();
    const res = await client.query("SELECT \"verifyToken\" FROM \"User\" WHERE email = 'edgar@bluejax.ai'");

    if (res.rows.length > 0) {
        console.log("https://mls.bluejax.ai/auth/verify?token=" + res.rows[0].verifyToken);
    } else {
        console.log("User not found.");
    }
    await client.end();
}

main().catch(console.error);
