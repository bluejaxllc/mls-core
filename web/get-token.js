const { PrismaClient } = require('./node_modules/@prisma/client-intelligence');
const prisma = new PrismaClient();

async function run() {
    const source = await prisma.sourceProfile.findUnique({ where: { name: 'Mercado Libre Mexico' } });
    if (source && source.config) {
        const c = JSON.parse(source.config);
        const token = c.auth.access_token;
        console.log("TOKEN:", token);

        const res = await fetch('https://api.mercadolibre.com/sites/MLM/search?category=MLM1459&state=MLM-CHH&limit=5', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log("STATUS:", res.status);
        const json = await res.json();
        console.log("BODY:", JSON.stringify(json).substring(0, 300));
    }
}
run();
