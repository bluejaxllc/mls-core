import { NextRequest, NextResponse } from 'next/server';
import { prismaCore } from '@/lib/prisma-core';
import { verifyAuth, isAuthError } from '@/lib/auth-middleware';

export async function GET(req: NextRequest) {
    try {
        const auth = await verifyAuth(req);
        if (isAuthError(auth)) return auth;
        const userId = auth.id;

        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type') || 'conversations';

        if (type === 'unread-count') {
            const conversations = await prismaCore.conversation.findMany({
                where: { OR: [{ participant1: userId }, { participant2: userId }] },
                select: { id: true }
            });
            const count = await prismaCore.message.count({
                where: { conversationId: { in: conversations.map((c: any) => c.id) }, senderId: { not: userId }, isRead: false }
            });
            return NextResponse.json({ unreadCount: count });
        }

        // List conversations
        const conversations = await prismaCore.conversation.findMany({
            where: { OR: [{ participant1: userId }, { participant2: userId }] },
            include: { messages: { take: 1, orderBy: { createdAt: 'desc' } } },
            orderBy: { updatedAt: 'desc' }
        });

        const enriched = await Promise.all(
            conversations.map(async (conv: any) => {
                const otherUserId = conv.participant1 === userId ? conv.participant2 : conv.participant1;
                const otherUser = await prismaCore.user.findUnique({
                    where: { id: otherUserId },
                    select: { id: true, firstName: true, lastName: true, email: true }
                });
                const unreadCount = await prismaCore.message.count({
                    where: { conversationId: conv.id, senderId: { not: userId }, isRead: false }
                });
                return { ...conv, otherUser, unreadCount };
            })
        );

        return NextResponse.json(enriched);
    } catch (error: any) {
        console.error('Failed to fetch conversations:', error);
        return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const auth = await verifyAuth(req);
        if (isAuthError(auth)) return auth;
        const userId = auth.id;
        const { recipientId, listingId, initialMessage } = await req.json();

        if (!recipientId) return NextResponse.json({ error: 'recipientId is required' }, { status: 400 });
        if (recipientId === userId) return NextResponse.json({ error: 'Cannot message yourself' }, { status: 400 });

        let conversation = await prismaCore.conversation.findFirst({
            where: {
                OR: [
                    { participant1: userId, participant2: recipientId },
                    { participant1: recipientId, participant2: userId }
                ],
                ...(listingId ? { listingId } : {})
            }
        });

        if (!conversation) {
            conversation = await prismaCore.conversation.create({
                data: {
                    participant1: userId,
                    participant2: recipientId,
                    listingId: listingId || null,
                    lastMessage: initialMessage || null,
                    lastMessageAt: initialMessage ? new Date() : null,
                }
            });
        }

        if (initialMessage) {
            await prismaCore.message.create({
                data: { conversationId: conversation.id, senderId: userId, content: initialMessage }
            });
            await prismaCore.conversation.update({
                where: { id: conversation.id },
                data: { lastMessage: initialMessage, lastMessageAt: new Date() }
            });
        }

        return NextResponse.json(conversation);
    } catch (error: any) {
        console.error('Failed to create conversation:', error);
        return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
    }
}
