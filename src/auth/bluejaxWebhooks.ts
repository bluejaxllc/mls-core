import { Request, Response } from 'express';

// Valid Webhook Events from Blue Jax
enum BlueJaxWebhookType {
    USER_CREATED = 'USER_CREATED',
    USER_UPDATED = 'USER_UPDATED',
    USER_DELETED = 'USER_DELETED',
    LOCATION_ASSIGNED = 'LOCATION_ASSIGNED'
}

/*
  Blue Jax Payload Schema (Hypothetical)
  {
      "type": "USER_CREATED",
      "data": {
          "id": "user_123",
          "email": "agent@brokerage.com",
          "firstName": "John",
          "lastName": "Doe",
          "roles": ["user"],
          "locationId": "loc_555"
      },
      "timestamp": "2024-01-01T12:00:00Z"
  }
*/

export const webhookHandler = async (req: Request, res: Response) => {
    const { type, data } = req.body;
    const webhookSecret = req.headers['x-webhook-secret'];

    // Verify Secret
    if (process.env.WEBHOOK_SECRET && webhookSecret !== process.env.WEBHOOK_SECRET) {
        console.warn(`[WEBHOOK] Unauthorized access attempt with secret: ${webhookSecret}`);
        return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log(`Received Webhook: ${type}`, JSON.stringify(data, null, 2));

    try {
        switch (type) {
            case BlueJaxWebhookType.USER_CREATED:
                await handleUserCreated(data);
                break;
            case BlueJaxWebhookType.USER_UPDATED:
                await handleUserUpdated(data);
                break;
            case BlueJaxWebhookType.USER_DELETED:
                await handleUserDeleted(data);
                break;
            default:
                console.warn(`Unhandled webhook type: ${type}`);
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

import { prisma } from '../lib/prisma';

// -- Handlers --

async function handleUserCreated(user: any): Promise<void> {
    console.log(`[SYNC] Creating MLS User for Blue Jax ID: ${user.id}`);

    try {
        await prisma.user.upsert({
            where: { id: user.id },
            update: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: Array.isArray(user.roles) ? user.roles.join(',') : (user.roles || 'user'),
                locationId: user.locationId,
                mlsStatus: 'ACTIVE',
                syncedAt: new Date()
            },
            create: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: Array.isArray(user.roles) ? user.roles.join(',') : (user.roles || 'user'),
                locationId: user.locationId,
                mlsStatus: 'ACTIVE',
                syncedAt: new Date()
            }
        });
        console.log(`[SYNC] User ${user.email} synchronized successfully to database.`);
    } catch (error: any) {
        console.error(`[SYNC] Failed to sync user ${user.id}:`, error.message);
    }
}

async function handleUserUpdated(user: any): Promise<void> {
    console.log(`[SYNC] Updating MLS User: ${user.id}`);
    await handleUserCreated(user); // Upsert handles update
}

async function handleUserDeleted(user: any): Promise<void> {
    console.log(`[SYNC] Deactivating MLS User: ${user.id}`);

    try {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                mlsStatus: 'DEACTIVATED',
                syncedAt: new Date()
            }
        });
        console.log(`[SYNC] User ${user.id} deactivated in database.`);
    } catch (error: any) {
        console.error(`[SYNC] Failed to deactivate user ${user.id}:`, error.message);
    }
}
