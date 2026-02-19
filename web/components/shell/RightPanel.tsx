'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, History, Activity, TrendingUp, Loader2, RefreshCw, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

interface TrustBreakdown {
    category: string;
    score: number;
    max: number;
}

interface RuleResult {
    name: string;
    status: string;
    color: string;
}

interface ActivityItem {
    id: string;
    type: string;
    description: string;
    timestamp: string;
    source: string;
    outcome: string;
}

interface ContextData {
    trustScore: number;
    trustLabel: string;
    trustBreakdown: TrustBreakdown[];
    ruleResults: RuleResult[];
    activity: ActivityItem[];
    stats: {
        totalListings: number;
        activeListings: number;
        unreadNotifications: number;
    };
}

export function RightPanel() {
    const { data: session }: any = useSession();
    const [context, setContext] = useState<ContextData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const fetchContext = async (isRefresh = false) => {
        if (!session?.accessToken) {
            setLoading(false);
            return;
        }
        if (isRefresh) setRefreshing(true);

        try {
            const res = await fetch(`${API_URL}/api/protected/context/summary`, {
                headers: { 'Authorization': `Bearer ${session.accessToken}` }
            });
            if (res.ok) {
                setContext(await res.json());
            }
        } catch (error) {
            console.error('Context fetch failed:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (session !== undefined) fetchContext();
        const interval = setInterval(() => fetchContext(), 30000);
        return () => clearInterval(interval);
    }, [session, API_URL]);

    const timeAgo = (date: string) => {
        const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return 'ahora';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        return `${days}d`;
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return { ring: 'border-green-500', text: 'text-green-500', glow: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]', bg: 'from-green-500/10 to-emerald-500/10' };
        if (score >= 60) return { ring: 'border-blue-500', text: 'text-blue-500', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]', bg: 'from-blue-500/10 to-cyan-500/10' };
        if (score >= 40) return { ring: 'border-yellow-500', text: 'text-yellow-500', glow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]', bg: 'from-yellow-500/10 to-amber-500/10' };
        return { ring: 'border-red-500', text: 'text-red-500', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]', bg: 'from-red-500/10 to-orange-500/10' };
    };

    const getOutcomeIcon = (outcome: string) => {
        switch (outcome) {
            case 'PASS': return <CheckCircle2 className="h-3 w-3 text-green-500" />;
            case 'BLOCK': return <XCircle className="h-3 w-3 text-red-500" />;
            case 'WARN': case 'FLAG': return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
            default: return <Activity className="h-3 w-3 text-muted-foreground" />;
        }
    };

    const getActivityDotColor = (outcome: string) => {
        switch (outcome) {
            case 'PASS': case 'ALLOW': return 'bg-green-500';
            case 'BLOCK': return 'bg-red-500';
            case 'WARN': case 'FLAG': return 'bg-yellow-500';
            default: return 'bg-blue-500';
        }
    };

    // Skeleton loader
    const Skeleton = ({ className }: { className?: string }) => (
        <div className={`animate-pulse bg-muted/50 rounded ${className}`} />
    );

    return (
        <div className="hidden lg:flex w-80 border-l bg-gradient-to-b from-card to-card/50 backdrop-blur-sm flex-col h-full relative overflow-hidden">
            {/* Top gradient */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="p-4 border-b relative z-10 flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2 text-sm">
                    <Activity className="h-4 w-4 text-blue-400" />
                    Contexto y Gobernanza
                </h3>
                <button
                    onClick={() => fetchContext(true)}
                    className="p-1 rounded hover:bg-muted/50 transition-colors"
                    title="Actualizar"
                >
                    <RefreshCw className={`h-3.5 w-3.5 text-muted-foreground ${refreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-6 relative z-10">

                {/* ── Trust Score ── */}
                <div className="space-y-3">
                    <h4 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                        Puntuación de Confianza
                    </h4>
                    {loading ? (
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-14 w-14 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                    ) : context ? (
                        <>
                            <div className="flex items-center gap-3">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    className={`h-14 w-14 rounded-full border-4 ${getScoreColor(context.trustScore).ring} flex items-center justify-center font-bold text-lg ${getScoreColor(context.trustScore).glow}`}
                                >
                                    <span className={getScoreColor(context.trustScore).text}>
                                        {context.trustScore}
                                    </span>
                                </motion.div>
                                <div>
                                    <p className="font-medium text-sm">{context.trustLabel}</p>
                                    <p className="text-muted-foreground text-xs">
                                        {context.stats.activeListings} de {context.stats.totalListings} activos
                                    </p>
                                </div>
                            </div>

                            {/* Breakdown bars */}
                            {context.trustBreakdown.length > 0 && (
                                <div className="space-y-2 pt-1">
                                    {context.trustBreakdown.map((b, i) => (
                                        <motion.div
                                            key={b.category}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * i }}
                                            className="space-y-1"
                                        >
                                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                                <span>{b.category}</span>
                                                <span className="font-mono">{b.score}/{b.max}</span>
                                            </div>
                                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(b.score / b.max) * 100}%` }}
                                                    transition={{ duration: 0.8, delay: 0.2 * i }}
                                                    className={`h-full rounded-full bg-gradient-to-r ${(b.score / b.max) >= 0.7 ? 'from-green-500 to-emerald-400' :
                                                            (b.score / b.max) >= 0.4 ? 'from-blue-500 to-cyan-400' :
                                                                'from-yellow-500 to-amber-400'
                                                        }`}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="text-xs text-muted-foreground">Inicia sesión para ver tu puntuación</p>
                    )}
                </div>

                {/* ── Rule Evaluations ── */}
                <div className="space-y-2">
                    <h4 className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-1 tracking-wider">
                        <ShieldCheck className="h-3 w-3" /> Evaluación de Reglas
                    </h4>
                    {loading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-9 w-full" />
                            <Skeleton className="h-9 w-full" />
                            <Skeleton className="h-9 w-full" />
                        </div>
                    ) : context && context.ruleResults.length > 0 ? (
                        <div className="space-y-2">
                            {context.ruleResults.map((rule, i) => (
                                <motion.div
                                    key={`${rule.name}-${i}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                    className={`bg-muted/50 p-2.5 rounded-lg text-xs border flex justify-between items-center ${rule.color === 'green' ? 'border-green-900/30' :
                                            rule.color === 'red' ? 'border-red-900/30' :
                                                rule.color === 'yellow' ? 'border-yellow-900/30' : 'border-border'
                                        }`}
                                >
                                    <span className="truncate mr-2">{rule.name}</span>
                                    <span className={`font-mono font-bold flex items-center gap-1 shrink-0 ${rule.color === 'green' ? 'text-green-500' :
                                            rule.color === 'red' ? 'text-red-500' :
                                                rule.color === 'yellow' ? 'text-yellow-500' : 'text-muted-foreground'
                                        }`}>
                                        {rule.status === 'PASS' && <CheckCircle2 className="h-3 w-3" />}
                                        {rule.status === 'BLOCK' && <XCircle className="h-3 w-3" />}
                                        {(rule.status === 'WARN' || rule.status === 'FLAG') && <AlertTriangle className="h-3 w-3" />}
                                        {rule.status}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-muted/30 p-3 rounded-lg text-xs text-muted-foreground text-center">
                            Sin evaluaciones recientes
                        </div>
                    )}
                </div>

                {/* ── Activity Feed ── */}
                <div className="space-y-2">
                    <h4 className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-1 tracking-wider">
                        <History className="h-3 w-3" /> Actividad Reciente
                    </h4>
                    {loading ? (
                        <div className="space-y-3 ml-1">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : context && context.activity.length > 0 ? (
                        <div className="relative border-l border-muted ml-1 space-y-3">
                            <AnimatePresence>
                                {context.activity.map((item, i) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05 * i }}
                                        className="ml-4 relative group"
                                    >
                                        <div className={`absolute -left-[21px] top-1.5 h-2 w-2 rounded-full ${getActivityDotColor(item.outcome)} transition-all group-hover:scale-125`} />
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="text-xs font-medium truncate">{item.description}</p>
                                                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                    {timeAgo(item.timestamp)} · {item.source === 'SYSTEM' ? 'Sistema' : 'Usuario'}
                                                </p>
                                            </div>
                                            {getOutcomeIcon(item.outcome)}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="bg-muted/30 p-3 rounded-lg text-xs text-muted-foreground text-center">
                            Sin actividad reciente
                        </div>
                    )}
                </div>

                {/* ── Quick Stats ── */}
                {context && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="grid grid-cols-3 gap-2 pt-2"
                    >
                        <div className="bg-muted/30 rounded-lg p-2 text-center">
                            <p className="text-lg font-bold">{context.stats.totalListings}</p>
                            <p className="text-[9px] text-muted-foreground uppercase">Total</p>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-2 text-center">
                            <p className="text-lg font-bold text-green-500">{context.stats.activeListings}</p>
                            <p className="text-[9px] text-muted-foreground uppercase">Activos</p>
                        </div>
                        <div className="bg-muted/30 rounded-lg p-2 text-center">
                            <p className="text-lg font-bold text-blue-500">{context.stats.unreadNotifications}</p>
                            <p className="text-[9px] text-muted-foreground uppercase">Alertas</p>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none" />
        </div>
    );
}
