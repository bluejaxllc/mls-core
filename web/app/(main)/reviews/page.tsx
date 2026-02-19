'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, User, MessageSquare, ThumbsUp, Clock, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Review {
    id: string;
    agentId: string;
    reviewerId: string;
    listingId?: string;
    rating: number;
    title?: string;
    comment: string;
    response?: string;
    reviewerName: string;
    createdAt: string;
    agent?: { id: string; firstName?: string; lastName?: string; email: string };
}

interface ReviewStats {
    avgRating: number;
    total: number;
    distribution: { stars: number; count: number }[];
}

export default function ReviewsPage() {
    const { data: session }: any = useSession();
    const [myReviews, setMyReviews] = useState<Review[]>([]);
    const [receivedReviews, setReceivedReviews] = useState<Review[]>([]);
    const [receivedStats, setReceivedStats] = useState<ReviewStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'received' | 'written'>('received');
    const [showWriteForm, setShowWriteForm] = useState(false);
    const [formData, setFormData] = useState({ agentId: '', rating: 5, title: '', comment: '' });
    const [submitting, setSubmitting] = useState(false);
    const [respondingTo, setRespondingTo] = useState<string | null>(null);
    const [responseText, setResponseText] = useState('');

    const API_URL = '';
    const userId = (session as any)?.user?.id;

    useEffect(() => {
        if (session?.accessToken) {
            fetchMyReviews();
            if (userId) fetchReceivedReviews();
        }
    }, [session]);

    const fetchMyReviews = async () => {
        try {
            const res = await fetch(`${API_URL}/api/protected/reviews/my-reviews`, {
                headers: { 'Authorization': `Bearer ${session.accessToken}` }
            });
            if (res.ok) setMyReviews(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const fetchReceivedReviews = async () => {
        try {
            const res = await fetch(`${API_URL}/api/public/reviews/${userId}`);
            if (res.ok) {
                const data = await res.json();
                setReceivedReviews(data.reviews || []);
                setReceivedStats({
                    avgRating: data.avgRating,
                    total: data.total,
                    distribution: data.distribution
                });
            }
        } catch (e) { console.error(e); }
    };

    const submitReview = async () => {
        if (!formData.agentId || !formData.comment.trim()) {
            toast.error('Completa todos los campos');
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/api/protected/reviews`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                toast.success('¡Reseña publicada!');
                setShowWriteForm(false);
                setFormData({ agentId: '', rating: 5, title: '', comment: '' });
                fetchMyReviews();
            } else {
                const err = await res.json();
                toast.error(err.error || 'Error al publicar');
            }
        } catch (e) {
            toast.error('Error de conexión');
        } finally {
            setSubmitting(false);
        }
    };

    const respondToReview = async (reviewId: string) => {
        if (!responseText.trim()) return;
        try {
            const res = await fetch(`${API_URL}/api/protected/reviews/${reviewId}/respond`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ response: responseText })
            });
            if (res.ok) {
                toast.success('Respuesta publicada');
                setRespondingTo(null);
                setResponseText('');
                fetchReceivedReviews();
            }
        } catch (e) {
            toast.error('Error al responder');
        }
    };

    const StarRating = ({ rating, size = 'md', interactive = false, onChange }: {
        rating: number; size?: 'sm' | 'md' | 'lg'; interactive?: boolean;
        onChange?: (r: number) => void;
    }) => {
        const sizes = { sm: 'h-3 w-3', md: 'h-4 w-4', lg: 'h-6 w-6' };
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        key={star}
                        onClick={() => interactive && onChange?.(star)}
                        className={interactive ? 'cursor-pointer' : 'cursor-default'}
                        disabled={!interactive}
                    >
                        <Star
                            className={`${sizes[size]} ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/30'} transition-colors`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    const formatDate = (d: string) => new Date(d).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Reseñas
                    </h1>
                    <p className="text-muted-foreground mt-1">Gestiona y escribe reseñas de agentes</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowWriteForm(!showWriteForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20"
                >
                    <Star className="h-4 w-4" />
                    Escribir Reseña
                </motion.button>
            </div>

            {/* Write Review Form */}
            <AnimatePresence>
                {showWriteForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-card border rounded-xl p-6 space-y-4">
                            <h3 className="font-semibold text-lg">Nueva Reseña</h3>
                            <div>
                                <label className="text-sm font-medium mb-1 block">ID del Agente</label>
                                <input
                                    value={formData.agentId}
                                    onChange={e => setFormData(f => ({ ...f, agentId: e.target.value }))}
                                    placeholder="Ingresa el ID del agente"
                                    className="w-full p-2.5 border rounded-lg bg-background text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Calificación</label>
                                <StarRating
                                    rating={formData.rating}
                                    size="lg"
                                    interactive
                                    onChange={r => setFormData(f => ({ ...f, rating: r }))}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Título (opcional)</label>
                                <input
                                    value={formData.title}
                                    onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                                    placeholder="Resumen de tu experiencia"
                                    className="w-full p-2.5 border rounded-lg bg-background text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Comentario</label>
                                <textarea
                                    value={formData.comment}
                                    onChange={e => setFormData(f => ({ ...f, comment: e.target.value }))}
                                    placeholder="Describe tu experiencia con este agente..."
                                    rows={4}
                                    className="w-full p-2.5 border rounded-lg bg-background text-sm resize-none"
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => setShowWriteForm(false)}
                                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={submitReview}
                                    disabled={submitting}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50"
                                >
                                    <Send className="h-4 w-4" />
                                    {submitting ? 'Publicando...' : 'Publicar'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats Card for received reviews */}
            {receivedStats && receivedStats.total > 0 && (
                <div className="bg-card border rounded-xl p-6 flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-5xl font-bold text-yellow-500">{receivedStats.avgRating}</div>
                        <StarRating rating={Math.round(receivedStats.avgRating)} />
                        <div className="text-sm text-muted-foreground mt-1">{receivedStats.total} reseñas</div>
                    </div>
                    <div className="flex-1 space-y-1">
                        {[5, 4, 3, 2, 1].map(star => {
                            const d = receivedStats.distribution.find(x => x.stars === star);
                            const count = d?.count || 0;
                            const pct = receivedStats.total > 0 ? (count / receivedStats.total) * 100 : 0;
                            return (
                                <div key={star} className="flex items-center gap-2 text-sm">
                                    <span className="w-3 text-muted-foreground">{star}</span>
                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            className="h-full bg-yellow-500 rounded-full"
                                        />
                                    </div>
                                    <span className="w-6 text-right text-muted-foreground">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="border-b flex gap-6 text-sm font-medium">
                <button
                    onClick={() => setActiveTab('received')}
                    className={`pb-2 border-b-2 transition-all ${activeTab === 'received'
                        ? 'border-yellow-500 text-yellow-600 font-semibold'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <ThumbsUp className="h-4 w-4 inline mr-1" />
                    Recibidas ({receivedReviews.length})
                </button>
                <button
                    onClick={() => setActiveTab('written')}
                    className={`pb-2 border-b-2 transition-all ${activeTab === 'written'
                        ? 'border-blue-500 text-blue-600 font-semibold'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <MessageSquare className="h-4 w-4 inline mr-1" />
                    Escritas ({myReviews.length})
                </button>
            </div>

            {/* Review List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="py-12 text-center text-muted-foreground">
                        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                        Cargando reseñas...
                    </div>
                ) : (
                    <>
                        {activeTab === 'received' ? (
                            receivedReviews.length === 0 ? (
                                <div className="py-16 text-center border-2 border-dashed rounded-xl">
                                    <Star className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-1">Sin reseñas recibidas</h3>
                                    <p className="text-muted-foreground text-sm">Las reseñas aparecerán aquí cuando tus clientes las dejen</p>
                                </div>
                            ) : (
                                receivedReviews.map((rev, idx) => (
                                    <motion.div
                                        key={rev.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-card border rounded-xl p-5"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold">
                                                    {rev.reviewerName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">{rev.reviewerName}</h4>
                                                    <div className="flex items-center gap-2">
                                                        <StarRating rating={rev.rating} size="sm" />
                                                        <span className="text-xs text-muted-foreground">{formatDate(rev.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {rev.title && <h5 className="font-medium mb-1">{rev.title}</h5>}
                                        <p className="text-sm text-muted-foreground">{rev.comment}</p>

                                        {/* Agent Response */}
                                        {rev.response ? (
                                            <div className="mt-3 ml-6 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                                <p className="text-xs font-semibold text-blue-600 mb-1">Tu respuesta:</p>
                                                <p className="text-sm">{rev.response}</p>
                                            </div>
                                        ) : (
                                            <div className="mt-3">
                                                {respondingTo === rev.id ? (
                                                    <div className="flex gap-2">
                                                        <input
                                                            value={responseText}
                                                            onChange={e => setResponseText(e.target.value)}
                                                            placeholder="Escribe tu respuesta..."
                                                            className="flex-1 p-2 border rounded-lg bg-background text-sm"
                                                            onKeyDown={e => e.key === 'Enter' && respondToReview(rev.id)}
                                                        />
                                                        <button
                                                            onClick={() => respondToReview(rev.id)}
                                                            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm"
                                                        >
                                                            Enviar
                                                        </button>
                                                        <button
                                                            onClick={() => { setRespondingTo(null); setResponseText(''); }}
                                                            className="px-3 py-2 text-muted-foreground text-sm"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setRespondingTo(rev.id)}
                                                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                                    >
                                                        Responder →
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                ))
                            )
                        ) : (
                            myReviews.length === 0 ? (
                                <div className="py-16 text-center border-2 border-dashed rounded-xl">
                                    <MessageSquare className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-1">No has escrito reseñas</h3>
                                    <p className="text-muted-foreground text-sm">Comparte tu experiencia con los agentes</p>
                                </div>
                            ) : (
                                myReviews.map((rev, idx) => (
                                    <motion.div
                                        key={rev.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-card border rounded-xl p-5"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    Para: <span className="font-medium text-foreground">
                                                        {rev.agent ? `${rev.agent.firstName || ''} ${rev.agent.lastName || ''}`.trim() || rev.agent.email : 'Agente'}
                                                    </span>
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <StarRating rating={rev.rating} size="sm" />
                                                    <span className="text-xs text-muted-foreground">{formatDate(rev.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {rev.title && <h5 className="font-medium mb-1">{rev.title}</h5>}
                                        <p className="text-sm text-muted-foreground">{rev.comment}</p>
                                        {rev.response && (
                                            <div className="mt-3 ml-6 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                                                <p className="text-xs font-semibold text-green-600 mb-1">Respuesta del agente:</p>
                                                <p className="text-sm">{rev.response}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                ))
                            )
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
