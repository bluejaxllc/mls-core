import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET /api/protected/messages/conversations - List user's conversations
router.get('/conversations', async (req: any, res) => {
    try {
        const userId = req.user.id;

        const conversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    { participant1: userId },
                    { participant2: userId }
                ]
            },
            include: {
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        // Enrich with participant info
        const enriched = await Promise.all(
            conversations.map(async (conv) => {
                const otherUserId = conv.participant1 === userId ? conv.participant2 : conv.participant1;
                const otherUser = await prisma.user.findUnique({
                    where: { id: otherUserId },
                    select: { id: true, firstName: true, lastName: true, email: true }
                });

                // Count unread messages
                const unreadCount = await prisma.message.count({
                    where: {
                        conversationId: conv.id,
                        senderId: { not: userId },
                        isRead: false
                    }
                });

                return {
                    ...conv,
                    otherUser,
                    unreadCount
                };
            })
        );

        res.json(enriched);
    } catch (error) {
        console.error('Failed to fetch conversations:', error);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
});

// GET /api/protected/messages/conversations/:id - Get messages in a conversation
router.get('/conversations/:id', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const conversation = await prisma.conversation.findUnique({
            where: { id },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

        // Verify user is a participant
        if (conversation.participant1 !== userId && conversation.participant2 !== userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        // Mark all unread messages from the other person as read
        await prisma.message.updateMany({
            where: {
                conversationId: id,
                senderId: { not: userId },
                isRead: false
            },
            data: { isRead: true }
        });

        // Get other user info
        const otherUserId = conversation.participant1 === userId ? conversation.participant2 : conversation.participant1;
        const otherUser = await prisma.user.findUnique({
            where: { id: otherUserId },
            select: { id: true, firstName: true, lastName: true, email: true }
        });

        res.json({ ...conversation, otherUser });
    } catch (error) {
        console.error('Failed to fetch conversation:', error);
        res.status(500).json({ error: 'Failed to fetch conversation' });
    }
});

// POST /api/protected/messages/conversations - Start or get existing conversation
router.post('/conversations', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { recipientId, listingId, initialMessage } = req.body;

        if (!recipientId) return res.status(400).json({ error: 'recipientId is required' });
        if (recipientId === userId) return res.status(400).json({ error: 'Cannot message yourself' });

        // Check if conversation already exists between these users (optionally for this listing)
        let conversation = await prisma.conversation.findFirst({
            where: {
                OR: [
                    { participant1: userId, participant2: recipientId },
                    { participant1: recipientId, participant2: userId }
                ],
                ...(listingId ? { listingId } : {})
            }
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    participant1: userId,
                    participant2: recipientId,
                    listingId: listingId || null,
                    lastMessage: initialMessage || null,
                    lastMessageAt: initialMessage ? new Date() : null,
                }
            });
        }

        // If there's an initial message, create it
        if (initialMessage) {
            await prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    senderId: userId,
                    content: initialMessage
                }
            });

            // Update conversation metadata
            await prisma.conversation.update({
                where: { id: conversation.id },
                data: {
                    lastMessage: initialMessage,
                    lastMessageAt: new Date()
                }
            });
        }

        res.json(conversation);
    } catch (error) {
        console.error('Failed to create conversation:', error);
        res.status(500).json({ error: 'Failed to create conversation' });
    }
});

// POST /api/protected/messages/conversations/:id/messages - Send a message
router.post('/conversations/:id/messages', async (req: any, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { content } = req.body;

        if (!content?.trim()) return res.status(400).json({ error: 'Content is required' });

        // Verify conversation exists and user is a participant
        const conversation = await prisma.conversation.findUnique({ where: { id } });
        if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
        if (conversation.participant1 !== userId && conversation.participant2 !== userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const message = await prisma.message.create({
            data: {
                conversationId: id,
                senderId: userId,
                content: content.trim()
            }
        });

        // Update conversation metadata
        await prisma.conversation.update({
            where: { id },
            data: {
                lastMessage: content.trim().substring(0, 100),
                lastMessageAt: new Date()
            }
        });

        res.json(message);
    } catch (error) {
        console.error('Failed to send message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// GET /api/protected/messages/unread-count - Quick badge count
router.get('/unread-count', async (req: any, res) => {
    try {
        const userId = req.user.id;

        // Get all conversations where user is participant
        const conversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    { participant1: userId },
                    { participant2: userId }
                ]
            },
            select: { id: true }
        });

        const convIds = conversations.map(c => c.id);

        const count = await prisma.message.count({
            where: {
                conversationId: { in: convIds },
                senderId: { not: userId },
                isRead: false
            }
        });

        res.json({ unreadCount: count });
    } catch (error) {
        res.json({ unreadCount: 0 });
    }
});

export default router;
