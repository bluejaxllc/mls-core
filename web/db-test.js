const { Client } = require('pg');

async function testConnection() {
    const directUrl = "postgres://postgres:1sMfsHUkqgVj6Dlx@db.erapajgkukxqwvmwxefq.supabase.co:5432/postgres";
    const poolerUrl = "postgres://postgres.erapajgkukxqwvmwxefq:1sMfsHUkqgVj6Dlx@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true";

    console.log("Testing DIRECT connection...");
    const client1 = new Client({ connectionString: directUrl });
    try {
        await client1.connect();
        console.log("✅ DIRECT connection SUCCESSFUL!");
        await client1.end();
    } catch (e) {
        console.log("❌ DIRECT connection FAILED:", e.message);
    }

    console.log("\nTesting POOLER connection...");
    const client2 = new Client({ connectionString: poolerUrl });
    try {
        await client2.connect();
        console.log("✅ POOLER connection SUCCESSFUL!");
        await client2.end();
    } catch (e) {
        console.log("❌ POOLER connection FAILED:", e.message);
    }
}

testConnection();
