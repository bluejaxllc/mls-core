import { PrismaClient } from '@prisma/client-intelligence';

const prisma = new PrismaClient();

async function testAuthenticatedML() {
    try {
        console.log('Fetching OAuth token from DB...');
        const source = await prisma.sourceProfile.findUnique({
            where: { name: 'Mercado Libre Mexico' }
        });

        if (!source || !source.config) {
            console.log('No ML config found');
            return;
        }

        const config = JSON.parse(source.config);
        const token = config.auth?.access_token;

        if (!token) {
            console.log('No access token found in config');
            return;
        }

        console.log('Got token:', token.substring(0, 15) + '...');

        console.log('\nTesting ML API with auth token...');
        const url = 'https://api.mercadolibre.com/sites/MLM/search?category=MLM1459&state=MLM-CHH&limit=5';

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const status = response.status;
        console.log('Response Status:', status);

        const data = await response.json();

        if (status === 200) {
            console.log(`✅ Success! Found ${data.paging?.total} items.`);
            console.log(data.results?.slice(0, 2).map((item: any) => ({
                id: item.id,
                title: item.title,
                price: item.price
            })));
        } else {
            console.log('❌ Failed:', JSON.stringify(data, null, 2));
        }

    } catch (e: any) {
        console.error('Error:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

testAuthenticatedML();
