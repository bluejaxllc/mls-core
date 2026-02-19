import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

        const notification = await prisma.notification.findUnique({
            where: { id }
        });

        if (!notification) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        if (notification.userId !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updated = await prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });

        return NextResponse.json(updated);

    } catch (error) {
        console.error('[NOTIFICATION_READ_PATCH] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
