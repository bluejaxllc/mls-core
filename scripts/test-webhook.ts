
import app from '../src/server';
import { prisma } from '../src/lib/prisma';
import http from 'http';

const PORT = 3011;
const server = http.createServer(app);

async function runTest() {
    // 1. Start Server
    await new Promise<void>((resolve) => {
        server.listen(PORT, () => {
            console.log(`Test Server running on port ${PORT}`);
            resolve();
        });
    });

    // 2. Prepare Payload
    const payload = {
        type: 'USER_CREATED',
        data: {
            id: 'TEST_USER_SYNC',
            email: 'test_sync@example.com',
            firstName: 'Sync',
            lastName: 'Tester',
            roles: ['admin', 'agent'],
            locationId: 'LOC-1'
        },
        timestamp: new Date().toISOString()
    };

    // 3. Send Webhook
    console.log('Sending Webhook...');
    const response = await fetch(`http://localhost:${PORT}/api/webhooks/bluejax/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-webhook-secret': process.env.WEBHOOK_SECRET || '' // Might be empty in test
        },
        body: JSON.stringify(payload)
    });

    console.log('Response Status:', response.status);
    const body = await response.json();
    console.log('Response Body:', body);

    // 4. Verify DB
    console.log('Verifying Database...');
    const user = await prisma.user.findUnique({
        where: { id: 'TEST_USER_SYNC' }
    });

    if (user) {
        console.log('✅ User found in DB:', user);
        console.log('Roles:', user.roles);
        if (user.roles === 'admin,agent') {
            console.log('✅ Roles correctly serialized');
        } else {
            console.error('❌ Roles mismatch:', user.roles);
        }
    } else {
        console.error('❌ User NOT found in DB');
    }

    // 5. Cleanup
    await prisma.user.delete({ where: { id: 'TEST_USER_SYNC' } }).catch(() => { });
    server.close();
    process.exit(user ? 0 : 1);
}

runTest().catch(console.error);
