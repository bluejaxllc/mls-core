
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;

        const savedSearch = await prisma.savedSearch.findUnique({
            where: { id },
        });

        if (!savedSearch) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        if (savedSearch.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.savedSearch.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[SAVED_SEARCH_DELETE] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = params;
        const body = await req.json();
        const { frequency, name } = body;

        const savedSearch = await prisma.savedSearch.findUnique({
            where: { id },
        });

        if (!savedSearch) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        if (savedSearch.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const data: any = {};
        if (frequency) data.frequency = frequency;
        if (name) data.name = name.trim();

        const updated = await prisma.savedSearch.update({
            where: { id },
            data,
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('[SAVED_SEARCH_PATCH] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
