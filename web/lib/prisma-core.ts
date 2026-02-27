import { PrismaClient } from '@prisma/client';

// Resolve absolute path to the shared backend database correctly without __dirname
const dbPath = process.env.DATABASE_URL || "file:./dev.db";

const globalForPrisma = globalThis as unknown as { prismaCore: PrismaClient | undefined };

export const prismaCore =
    globalForPrisma.prismaCore ??
    new PrismaClient({
        datasources: {
            db: { url: dbPath },
        },
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaCore = prismaCore;
