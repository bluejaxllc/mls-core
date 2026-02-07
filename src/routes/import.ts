import express from 'express';
import multer from 'multer';
import { prisma } from '../lib/prisma';
import fs from 'fs';
import path from 'path';
import { verifyBlueJaxToken } from '../auth/middleware';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Simple CSV Parser to avoid dependency issues with ts-node/ESM
function parseCSV(content: string) {
    const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i];
        // Regex to split by comma ignoring commas inside quotes
        const values: string[] = [];
        let inQuote = false;
        let currentValue = '';

        for (let char of currentLine) {
            if (char === '"') {
                inQuote = !inQuote;
            } else if (char === ',' && !inQuote) {
                values.push(currentValue.trim());
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        values.push(currentValue.trim());

        // Map to headers
        const obj: any = {};
        headers.forEach((header, index) => {
            if (values[index] !== undefined) {
                // Remove surrounding quotes if present
                let val = values[index];
                if (val.startsWith('"') && val.endsWith('"')) {
                    val = val.slice(1, -1);
                }
                obj[header] = val;
            }
        });
        result.push(obj);
    }
    return result;
}


// GET /api/import/template (Public)
// Returns a downloadable CSV template
router.get('/template', (req, res) => {
    const headers = [
        'title',
        'price',
        'address',
        'city',
        'state',
        'zipCode',
        'propertyType', // commercial, land, etc.
        'description',
        'ownerId' // Optional
    ];

    // Create a simple CSV string with headers and one example row
    const csvContent = headers.join(',') + '\n' +
        'Example Property,5000000,"123 Main St, Chihuahua",Chihuahua,Chihuahua,31000,commercial,"Great investment opportunity",';

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=listing_template.csv');
    res.send(csvContent);
});

// POST /api/import/csv (Protected)
// Uploads and processes a CSV file
router.post('/csv', verifyBlueJaxToken, upload.single('file'), async (req: any, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const results: any[] = [];
    const errors: any[] = [];
    let successCount = 0;

    try {
        const fileContent = fs.readFileSync(req.file.path, 'utf-8');
        const records = parseCSV(fileContent);

        console.log(`[IMPORT] Processing ${records.length} records...`);

        // Default owner to current user if not specified
        const defaultOwnerId = req.user?.id || 'system_import';

        for (const [index, row] of records.entries()) {
            try {
                // Basic Validation
                if (!row.title || !row.price || !row.address) {
                    throw new Error('Missing required fields (title, price, address)');
                }

                const newListing = await prisma.listing.create({
                    data: {
                        propertyId: `IMP-${Date.now()}-${index}`,
                        title: row.title,
                        price: parseFloat(row.price.replace(/[^0-9.]/g, '')), // Clean price
                        address: row.address,
                        city: row.city || '',
                        state: row.state || '',
                        zipCode: row.zipCode || '',
                        propertyType: row.propertyType?.toLowerCase() || 'commercial',
                        description: row.description || '',
                        status: 'ACTIVE', // Auto-activate for now, user can change later
                        source: 'CSV_IMPORT',
                        ownerId: row.ownerId || defaultOwnerId,
                        // SQLite JSON fields
                        images: JSON.stringify([]),
                        videos: JSON.stringify([])
                    }
                });
                successCount++;
                results.push({ id: newListing.id, title: newListing.title, status: 'CREATED' });
            } catch (err: any) {
                console.error(`[IMPORT] Error processing row ${index}:`, err.message);
                errors.push({ row: index + 1, error: err.message, data: row });
            }
        }

        // Cleanup uploaded file
        fs.unlinkSync(req.file.path);

        res.json({
            message: `Processed ${records.length} records.`,
            successCount,
            errorCount: errors.length,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error: any) {
        console.error('[IMPORT] Fatal error:', error);
        res.status(500).json({ error: 'Failed to process CSV file.' });
    }
});

export default router;
