const { Client } = require('pg');

async function go() {
    const url = "postgres://postgres.erapajgkukxqwvmwxefq:1sMfsHUkqgVj6Dlx@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require";
    const client = new Client({ connectionString: url });
    try {
        await client.connect();
        console.log("Connected? YES");
        await client.end();
    } catch (e) {
        console.log("Error connecting:");
        console.log(e.message);
        console.log(e.stack);
    }
}
go();
