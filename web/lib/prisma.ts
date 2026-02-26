import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    return new PrismaClient({
        datasources: {
            db: {
                url: process.env.POSTGRES_PRISMA_URL || "postgres://postgres.erapajgkukxqwvmwxefq:1sMfsHUkqgVj6Dlx@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true",
            },
        },
    });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
