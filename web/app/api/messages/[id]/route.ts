import { NextRequest, NextResponse } from 'next/server';
import { prismaCore } from '@/lib/prisma-core';
import { verifyAuth, isAuthError } from '@/lib/auth-middleware';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const auth = await verifyAuth(req);
        if (isAuthError(auth)) return auth;
        const userId = auth.id;
        const { id } = params;

        const conversation = await prismaCore.conversation.findUnique({
            where: { id },
            include: { messages: { orderBy: { createdAt: 'asc' } } }
        });

        if (!conversation) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        if (conversation.participant1 !== userId && conversation.participant2 !== userId) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        await prismaCore.message.updateMany({
            where: { conversationId: id, senderId: { not: userId }, isRead: false },
            data: { isRead: true }
        });

        const otherUserId = conversation.participant1 === userId ? conversation.participant2 : conversation.participant1;
        const otherUser = await prismaCore.user.findUnique({
            where: { id: otherUserId },
            select: { id: true, firstName: true, lastName: true, email: true }
        });

        return NextResponse.json({ ...conversation, otherUser });
    } catch (error: any) {
        console.error('Failed to fetch conversation:', error);
        return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 });
    }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const auth = await verifyAuth(req);
        if (isAuthError(auth)) return auth;
        const userId = auth.id;
        const { id } = params;
        const { content } = await req.json();

        if (!content?.trim()) return NextResponse.json({ error: 'Content is required' }, { status: 400 });

        const conversation = await prismaCore.conversation.findUnique({ where: { id } });
        if (!conversation) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        if (conversation.participant1 !== userId && conversation.participant2 !== userId) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const message = await prismaCore.message.create({
            data: { conversationId: id, senderId: userId, content: content.trim() }
        });

        await prismaCore.conversation.update({
            where: { id },
            data: { lastMessage: content.trim().substring(0, 100), lastMessageAt: new Date() }
        });

        return NextResponse.json(message);
    } catch (error: any) {
        console.error('Failed to send message:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
