'use client';

import { GitCommit, User, AlertCircle, Shield, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface VersionEntry {
    id: string;
    date: string | Date;
    author: string;
    action: string;
    outcome?: string;
    details?: string;
    rulesEvaluated?: number;
    highlight?: boolean;
}

interface VersionTimelineProps {
    entries?: VersionEntry[];
    loading?: boolean;
}

export function VersionTimeline({ entries = [], loading = false }: VersionTimelineProps) {
    const formatDate = (d: string | Date) => {
        const date = new Date(d);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (mins < 1) return 'Justo ahora';
        if (mins < 60) return `Hace ${mins} min`;
        if (hours < 24) return `Hace ${hours}h`;
        if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`;
        return date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const outcomeColor = (outcome?: string) => {
        switch (outcome) {
            case 'BLOCK': return 'bg-red-500/20 text-red-500 border-red-500/10';
            case 'FLAG': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/10';
            case 'PASS': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/10';
            case 'WARN': return 'bg-orange-500/20 text-orange-500 border-orange-500/10';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const OutcomeIcon = ({ outcome }: { outcome?: string }) => {
        switch (outcome) {
            case 'BLOCK': return <AlertCircle className="h-4 w-4" />;
            case 'FLAG': return <AlertCircle className="h-4 w-4" />;
            case 'PASS': return <Check className="h-4 w-4" />;
            default: return <Shield className="h-4 w-4" />;
        }
    };

    if (loading) {
        return (
            <div className="border rounded-xl bg-card p-6">
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                    <GitCommit className="h-5 w-5" /> Historial de Versiones
                </h3>
                <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4 animate-pulse">
                            <div className="h-10 w-10 rounded-full bg-muted" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-muted rounded w-1/3" />
                                <div className="h-3 bg-muted rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className="border rounded-xl bg-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <GitCommit className="h-5 w-5" /> Historial de Versiones
                </h3>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                        <GitCommit className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">No hay historial de cambios disponible</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">Los cambios se registrarán aquí automáticamente</p>
                </div>
            </div>
        );
    }

    return (
        <div className="border rounded-xl bg-card p-6">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
                <GitCommit className="h-5 w-5 text-blue-500" /> Historial de Versiones
                <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {entries.length} evento{entries.length !== 1 ? 's' : ''}
                </span>
            </h3>

            <div className="space-y-6 relative">
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-500/30 via-border to-transparent z-0" />

                {entries.map((v, i) => (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        key={v.id}
                        className="relative z-10 flex gap-4"
                    >
                        <motion.div
                            whileHover={{ scale: 1.15 }}
                            className={`mt-1 h-10 w-10 text-xs rounded-full flex items-center justify-center border-4 border-background shrink-0 ${outcomeColor(v.outcome)}`}
                        >
                            <OutcomeIcon outcome={v.outcome} />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                                <div className="min-w-0">
                                    <p className="font-medium text-sm flex items-center gap-2">
                                        <span className="truncate">{v.action}</span>
                                        {v.highlight && <AlertCircle className="h-3 w-3 text-yellow-500 shrink-0" />}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                        <User className="h-3 w-3" /> {v.author} • {formatDate(v.date)}
                                    </p>
                                </div>
                                {v.outcome && (
                                    <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded shrink-0 ${outcomeColor(v.outcome)}`}>
                                        {v.outcome}
                                    </span>
                                )}
                            </div>
                            {v.details && (
                                <div className="mt-2 p-3 bg-muted/30 rounded-lg border border-dashed text-xs font-mono text-muted-foreground line-clamp-2">
                                    {v.details}
                                </div>
                            )}
                            {v.rulesEvaluated != null && v.rulesEvaluated > 0 && (
                                <p className="mt-1.5 text-[10px] text-muted-foreground/60">
                                    {v.rulesEvaluated} regla{v.rulesEvaluated !== 1 ? 's' : ''} evaluada{v.rulesEvaluated !== 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
