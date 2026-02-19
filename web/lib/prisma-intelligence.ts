import { PrismaClient } from '../../src/generated/client-intelligence';
import path from 'path';

const intDbPath = process.env.INTELLIGENCE_DATABASE_URL || `file:${path.resolve(process.cwd(), '..', 'prisma', 'intelligence.db')}`;

const globalForPrisma = globalThis as unknown as { prismaIntelligence: PrismaClient | undefined };

export const prismaIntelligence =
    globalForPrisma.prismaIntelligence ??
    new PrismaClient({
        datasources: {
            db: {
                url: intDbPath,
            },
        },
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaIntelligence = prismaIntelligence;

