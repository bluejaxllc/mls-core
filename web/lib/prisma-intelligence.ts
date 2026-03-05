import { PrismaClient } from '@prisma/client-intelligence';
const globalForPrisma = globalThis as unknown as { prismaIntelligence: PrismaClient | undefined };

export const prismaIntelligence =
    globalForPrisma.prismaIntelligence ??
    new PrismaClient({
        datasources: {
            db: {
                url: process.env.MLS_INTELLIGENCE_URL || "postgres://root:TqDWeNnZqjWdIXjWqLwIawbNnNnjWixw@autorack.proxy.rlwy.net:18659/railway",
            }
        }
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaIntelligence = prismaIntelligence;

