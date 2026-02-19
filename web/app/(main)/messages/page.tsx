'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, ArrowLeft, Search, User, Clock } from 'lucide-react';

interface ConversationSummary {
    id: string;
    participant1: string;
    participant2: string;
    listingId?: string;
    lastMessage?: string;
    lastMessageAt?: string;
    otherUser?: { id: string; firstName?: string; lastName?: string; email: string };
    unreadCount: number;
}

interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    isRead: boolean;
    createdAt: string;
}

interface ConversationDetail extends ConversationSummary {
    messages: Message[];
}

export default function MessagesPage() {
    const { data: session }: any = useSession();
    const [conversations, setConversations] = useState<ConversationSummary[]>([]);
    const [selectedConv, setSelectedConv] = useState<ConversationDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const userId = session?.user?.id || session?.accessToken?.split('.')?.[0]; // fallback

    useEffect(() => {
        if (session?.accessToken) fetchConversations();
    }, [session]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedConv?.messages]);

    const fetchConversations = async () => {
        try {
            const res = await fetch(`${API_URL}/api/protected/messages/conversations`, {
                headers: { 'Authorization': `Bearer ${session.accessToken}` }
            });
            if (res.ok) setConversations(await res.json());
        } catch (e) {
            console.error('Failed to fetch conversations', e);
        } finally {
            setLoading(false);
        }
    };

    const openConversation = async (convId: string) => {
        try {
            const res = await fetch(`${API_URL}/api/protected/messages/conversations/${convId}`, {
                headers: { 'Authorization': `Bearer ${session.accessToken}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSelectedConv(data);
                // Update conversation in list to clear unread
                setConversations(prev =>
                    prev.map(c => c.id === convId ? { ...c, unreadCount: 0 } : c)
                );
            }
        } catch (e) {
            console.error('Failed to open conversation', e);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedConv || sending) return;
        setSending(true);

        try {
            const res = await fetch(
                `${API_URL}/api/protected/messages/conversations/${selectedConv.id}/messages`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${session.accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content: newMessage.trim() })
                }
            );

            if (res.ok) {
                const msg = await res.json();
                setSelectedConv(prev => prev ? {
                    ...prev,
                    messages: [...prev.messages, msg]
                } : null);
                setNewMessage('');
                // Update list
                setConversations(prev =>
                    prev.map(c => c.id === selectedConv.id
                        ? { ...c, lastMessage: newMessage.trim(), lastMessageAt: new Date().toISOString() }
                        : c
                    )
                );
            }
        } catch (e) {
            console.error('Failed to send message', e);
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateStr?: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffMin = Math.floor(diffMs / 60000);
        if (diffMin < 1) return 'ahora';
        if (diffMin < 60) return `${diffMin}m`;
        const diffH = Math.floor(diffMin / 60);
        if (diffH < 24) return `${diffH}h`;
        return d.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
    };

    const getUserName = (user?: { firstName?: string; lastName?: string; email: string }) => {
        if (!user) return 'Usuario';
        if (user.firstName) return `${user.firstName} ${user.lastName || ''}`.trim();
        return user.email.split('@')[0];
    };

    const filteredConversations = conversations.filter(c => {
        if (!searchQuery) return true;
        const name = getUserName(c.otherUser).toLowerCase();
        return name.includes(searchQuery.toLowerCase());
    });

    const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

    return (
        <div className="h-[calc(100vh-80px)] flex bg-background rounded-xl border overflow-hidden">
            {/* Sidebar - Conversation List */}
            <div className={`w-full md:w-80 lg:w-96 border-r flex flex-col ${selectedConv ? 'hidden md:flex' : 'flex'}`}>
                {/* Header */}
                <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-bold flex items-center gap-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            <MessageCircle className="h-5 w-5 text-blue-600" />
                            Mensajes
                            {totalUnread > 0 && (
                                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                                    {totalUnread}
                                </span>
                            )}
                        </h2>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Buscar conversaciones..."
                            className="w-full pl-9 pr-3 py-2 bg-background border border-blue-500/10 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40 focus:shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)] focus:outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                            Cargando...
                        </div>
                    ) : filteredConversations.length === 0 ? (
                        <div className="p-8 text-center">
                            <MessageCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground text-sm">
                                {conversations.length === 0
                                    ? 'No tienes conversaciones aún'
                                    : 'No se encontraron resultados'
                                }
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Contacta a un agente desde su perfil o un listado
                            </p>
                        </div>
                    ) : (
                        filteredConversations.map(conv => (
                            <motion.button
                                key={conv.id}
                                onClick={() => openConversation(conv.id)}
                                whileHover={{ backgroundColor: 'rgba(59,130,246,0.05)' }}
                                className={`w-full text-left p-4 border-b hover:bg-muted/50 transition-colors ${selectedConv?.id === conv.id ? 'bg-blue-50 dark:bg-blue-950/20 border-l-2 border-l-blue-500' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                        {getUserName(conv.otherUser).charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className={`font-semibold text-sm truncate ${conv.unreadCount > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                {getUserName(conv.otherUser)}
                                            </h3>
                                            <span className="text-xs text-muted-foreground shrink-0 ml-2">
                                                {formatTime(conv.lastMessageAt)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                                                {conv.lastMessage || 'Sin mensajes'}
                                            </p>
                                            {conv.unreadCount > 0 && (
                                                <span className="bg-blue-600 text-white text-[10px] font-bold h-5 min-w-5 rounded-full flex items-center justify-center shrink-0 ml-2">
                                                    {conv.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${!selectedConv ? 'hidden md:flex' : 'flex'}`}>
                {selectedConv ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b flex items-center gap-3 bg-card">
                            <button
                                onClick={() => setSelectedConv(null)}
                                className="md:hidden text-muted-foreground hover:text-foreground"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                                {getUserName(selectedConv.otherUser).charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-semibold">{getUserName(selectedConv.otherUser)}</h3>
                                <p className="text-xs text-muted-foreground">
                                    {selectedConv.otherUser?.email || 'Agente'}
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
                            {selectedConv.messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                    <MessageCircle className="h-12 w-12 mb-2 opacity-30" />
                                    <p className="text-sm">Inicia la conversación</p>
                                </div>
                            ) : (
                                selectedConv.messages.map(msg => {
                                    const isMine = msg.senderId === (session as any)?.user?.id;
                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isMine
                                                ? 'bg-blue-600 text-white rounded-br-md'
                                                : 'bg-card border rounded-bl-md'
                                                }`}>
                                                <p>{msg.content}</p>
                                                <div className={`text-[10px] mt-1 ${isMine ? 'text-blue-200' : 'text-muted-foreground'}`}>
                                                    {formatTime(msg.createdAt)}
                                                    {isMine && msg.isRead && ' ✓✓'}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t bg-card">
                            <form
                                onSubmit={e => { e.preventDefault(); sendMessage(); }}
                                className="flex items-center gap-2"
                            >
                                <input
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    placeholder="Escribe un mensaje..."
                                    className="flex-1 px-4 py-2.5 bg-muted rounded-full text-sm border border-blue-500/10 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40 focus:shadow-[0_0_15px_-3px_rgba(59,130,246,0.2)] transition-all"
                                    disabled={sending}
                                />
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={!newMessage.trim() || sending}
                                    className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="h-4 w-4" />
                                </motion.button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-950/30 dark:to-cyan-950/30 flex items-center justify-center mb-4">
                            <MessageCircle className="h-10 w-10 text-blue-500/50" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">Tus Mensajes</h3>
                        <p className="text-sm">Selecciona una conversación para ver los mensajes</p>
                    </div>
                )}
            </div>
        </div>
    );
}
