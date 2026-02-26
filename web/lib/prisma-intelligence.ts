import { PrismaClient } from '.prisma/client-intelligence';
import path from 'path';

const globalForPrisma = globalThis as unknown as { prismaIntelligence: PrismaClient | undefined };

export const prismaIntelligence = globalForPrisma.prismaIntelligence ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaIntelligence = prismaIntelligence;
