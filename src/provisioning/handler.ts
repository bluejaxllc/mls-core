
import { Request, Response } from 'express';
import { ghlService, CreateLocationPayload } from '../services/ghl';

export const provisionHandler = async (req: Request, res: Response) => {
    try {
        if (!ghlService) {
            return res.status(503).json({ error: 'GHL Service not configured (Missing Agency Key)' });
        }

        const payload: CreateLocationPayload = req.body;

        // Basic Validation
        if (!payload.name) {
            return res.status(400).json({ error: 'Company Name is required' });
        }

        // Call GHL
        const result = await ghlService.createLocation(payload);

        // Success
        console.log(`[PROVISION] Success! Location ID: ${result.id}`);
        res.status(201).json({
            success: true,
            locationId: result.id,
            details: result
        });

    } catch (error: any) {
        console.error('[PROVISION] Error:', error.message);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};
