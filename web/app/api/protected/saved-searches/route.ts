
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const savedSearchSchema = z.object({
    name: z.string().min(1, "Name is required"),
    criteria: z.any(), // JSON object of filters
    frequency: z.enum(["INSTANT", "DAILY", "WEEKLY", "OFF"]).default("INSTANT"),
});

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const savedSearches = await prisma.savedSearch.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(savedSearches);
    } catch (error) {
        console.error('[SAVED_SEARCH_GET] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const validation = savedSearchSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.format() },
                { status: 400 }
            );
        }

        const { name, criteria, frequency } = validation.data;

        const savedSearch = await prisma.savedSearch.create({
            data: {
                userId: session.user.id,
                name,
                criteria: JSON.stringify(criteria), // Store as string for SQLite compatibility/simplicity
                frequency,
            },
        });

        return NextResponse.json(savedSearch, { status: 201 });
    } catch (error) {
        console.error('[SAVED_SEARCH_POST] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
