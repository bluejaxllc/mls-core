import { PrismaClient } from '@prisma/client';
import path from 'path';

// Resolve absolute path to the shared backend database
// __dirname = web/lib/, dev.db = MLS/prisma/dev.db
const dbPath = `file:${path.resolve(__dirname, '..', '..', 'prisma', 'dev.db')}`;

const globalForPrisma = globalThis as unknown as { prismaCore: PrismaClient | undefined };

export const prismaCore =
    globalForPrisma.prismaCore ??
    new PrismaClient({
        datasources: {
            db: { url: dbPath },
        },
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaCore = prismaCore;
