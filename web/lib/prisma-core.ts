import { PrismaClient } from '@prisma/client';
import path from 'path';

// Resolve the database path from project root (MLS/prisma/dev.db)
const dbPath = process.env.DATABASE_URL || `file:${path.resolve(process.cwd(), '..', 'prisma', 'dev.db')}`;

const globalForPrisma = globalThis as unknown as { prismaCore: PrismaClient | undefined };

export const prismaCore =
    globalForPrisma.prismaCore ??
    new PrismaClient({
        datasources: {
            db: {
                url: dbPath,
            },
        },
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaCore = prismaCore;
