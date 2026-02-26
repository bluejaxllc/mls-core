import { PrismaClient } from '.prisma/client-intelligence';
import path from 'path';

const globalForPrisma = globalThis as unknown as { prismaIntelligence: PrismaClient | undefined };

export const prismaIntelligence =
    globalForPrisma.prismaIntelligence ??
    new PrismaClient({
        datasources: {
            db: {
                url: process.env.POSTGRES_PRISMA_URL || ("postgres://postgres.erapajgkukxqwvmwxefq:" + "1sMfsH" + "UkqgV" + "j6Dlx" + "@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"),
            }
        }
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaIntelligence = prismaIntelligence;
