import { PrismaClient } from '../../src/generated/client-intelligence';

// Global declaration for dev HMR
const globalForPrisma = global as unknown as { prismaIntelligence: PrismaClient };

export const prismaIntelligence =
    globalForPrisma.prismaIntelligence ||
    new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaIntelligence = prismaIntelligence;
