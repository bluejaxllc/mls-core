import { PrismaClient } from '@prisma/client-core';

const globalForPrisma = globalThis as unknown as { prismaCore: PrismaClient | undefined };

export const prismaCore =
    globalForPrisma.prismaCore ??
    new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaCore = prismaCore;
