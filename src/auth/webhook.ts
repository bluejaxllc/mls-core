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

// -- Handlers --

async function handleUserCreated(user: any) {
    console.log(`[SYNC] Creating MLS User for Blue Jax ID: ${user.id}`);
    // 1. Check if Broker exists for locationId
    // 2. Create MLS User record
    // 3. Assign Default Permissions based on Role
}

async function handleUserUpdated(user: any) {
    console.log(`[SYNC] Updating MLS User: ${user.id}`);
    // Update email, name, or role changes
}

async function handleUserDeleted(user: any) {
    console.log(`[SYNC] Deactivating MLS User: ${user.id}`);
    // Soft delete / revoke access
}
