import { NextRequest, NextResponse } from 'next/server';
import { prismaCore } from '@/lib/prisma-core';
import { verifyAuth, isAuthError } from '@/lib/auth-middleware';

export async function GET(req: NextRequest) {
    try {
        const auth = await verifyAuth(req);
        if (isAuthError(auth)) return auth;
        const userId = auth.id;
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const limit = parseInt(searchParams.get('limit') || '20');

        if (type === 'unread-count') {
            const count = await prismaCore.notification.count({ where: { userId, isRead: false } });
            return NextResponse.json({ count });
        }

        const notifications = await prismaCore.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: limit });
        return NextResponse.json(notifications.map((n: any) => ({ ...n, data: n.data ? JSON.parse(n.data) : {} })));
    } catch (error: any) {
        console.error('Failed to fetch notifications:', error);
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}

// PATCH /api/notifications — mark all read
export async function PATCH(req: NextRequest) {
    try {
        const auth = await verifyAuth(req);
        if (isAuthError(auth)) return auth;
        const body = await req.json();

        if (body.action === 'read-all') {
            await prismaCore.notification.updateMany({ where: { userId: auth.id, isRead: false }, data: { isRead: true } });
            return NextResponse.json({ success: true });
        }

        if (body.id) {
            const notification = await prismaCore.notification.findUnique({ where: { id: body.id } });
            if (!notification) return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
            if (notification.userId !== auth.id) return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
            const updated = await prismaCore.notification.update({ where: { id: body.id }, data: { isRead: true } });
            return NextResponse.json(updated);
        }

        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    } catch (error: any) {
        console.error('Failed to update notification:', error);
        return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
    }
}
