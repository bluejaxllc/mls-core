import { PrismaClient } from '.prisma/client-intelligence';
import path from 'path';

// Resolve absolute path to the shared intelligence database
// __dirname = web/lib/, intelligence.db = MLS/prisma/intelligence.db
const dbPath = `file:${path.resolve(__dirname, '..', '..', 'prisma', 'intelligence.db')}`;

const globalForPrisma = globalThis as unknown as { prismaIntelligence: PrismaClient | undefined };

export const prismaIntelligence =
    globalForPrisma.prismaIntelligence ??
    new PrismaClient({
        datasources: {
            db: { url: dbPath },
        },
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaIntelligence = prismaIntelligence;
