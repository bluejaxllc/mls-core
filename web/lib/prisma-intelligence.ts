import { PrismaClient } from '@prisma/client-intelligence';
const globalForPrisma = globalThis as unknown as { prismaIntelligence: PrismaClient | undefined };

export const prismaIntelligence =
    globalForPrisma.prismaIntelligence ??
    new PrismaClient({
        datasources: {
            db: {
                url: process.env.INTELLIGENCE_DATABASE_URL || "file:./prisma/intelligence.db",
            }
        }
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaIntelligence = prismaIntelligence;

