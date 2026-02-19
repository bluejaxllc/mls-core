'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CheckCircle2, XCircle, AlertTriangle, Eye, Loader2, ChevronDown, Filter, ArrowLeft, Clock } from 'lucide-react';
import { PageTransition, AnimatedCard } from '@/components/ui/animated';
import Link from 'next/link';

interface AuditLog {
    id: string;
    eventId: string;
    eventType: string;
    timestamp: string;
    actorId: string;
    rulesEvaluated: number;
    overallOutcome: string;
    source: string;
    details: string | null;
    results: string;
}

interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

const OUTCOME_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof CheckCircle2 }> = {
    PASS: { label: 'Aprobado', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: CheckCircle2 },
    BLOCK: { label: 'Bloqueado', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', icon: XCircle },
    FLAG: { label: 'Marcado', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30', icon: AlertTriangle },
    WARN: { label: 'Advertencia', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30', icon: AlertTriangle },
    ALLOW: { label: 'Permitido', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: CheckCircle2 },
};

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [outcomeFilter, setOutcomeFilter] = useState<string>('ALL');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const API = '';

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: page.toString(), limit: '20' });
            if (outcomeFilter !== 'ALL') params.set('status', outcomeFilter);
            const res = await fetch(`${API}/api/audit-logs?${params}`);
            if (res.ok) {
                const data = await res.json();
                setLogs(data.items);
                setPagination(data.pagination);
            }
        } catch (err) {
            console.error('Error fetching audit logs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page, outcomeFilter]);

    const formatTime = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleString('es-MX', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const parseResults = (results: string) => {
        try {
            return JSON.parse(results);
        } catch {
            return {};
        }
    };

    // Count outcomes for stats
    const outcomeCounts = logs.reduce((acc, log) => {
        acc[log.overallOutcome] = (acc[log.overallOutcome] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <PageTransition className="space-y-6">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 via-gray-800 to-zinc-900 p-6 md:p-8 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
                <div className="relative z-10">
                    <Link href="/governance" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors mb-3">
                        <ArrowLeft className="h-4 w-4" />
                        Gobernanza
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Shield className="h-5 w-5" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Registro de Auditoría</h1>
                    </div>
                    <p className="text-white/70 text-sm md:text-base max-w-xl">Historial completo de evaluaciones de reglas del sistema</p>
                </div>
            </div>

            {/* Outcome Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(OUTCOME_CONFIG).map(([key, cfg], idx) => {
                    const count = outcomeCounts[key] || 0;
                    const Icon = cfg.icon;
                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.06 }}
                            onClick={() => setOutcomeFilter(outcomeFilter === key ? 'ALL' : key)}
                            className={`border rounded-xl p-3 cursor-pointer transition-all hover:shadow-md ${outcomeFilter === key ? 'ring-2 ring-offset-1 ring-blue-500' : ''
                                } ${cfg.bg}`}
                        >
                            <div className="flex items-center gap-2">
                                <Icon className={`h-4 w-4 ${cfg.color}`} />
                                <span className="text-xs font-medium">{cfg.label}</span>
                            </div>
                            <p className={`text-xl font-bold mt-1 ${cfg.color}`}>{count}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-2 flex-wrap">
                <Filter className="h-4 w-4 text-muted-foreground" />
                {['ALL', ...Object.keys(OUTCOME_CONFIG)].map(s => (
                    <button
                        key={s}
                        onClick={() => { setOutcomeFilter(s); setPage(1); }}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${outcomeFilter === s
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow'
                            : 'bg-muted text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {s === 'ALL' ? 'Todos' : OUTCOME_CONFIG[s]?.label || s}
                    </button>
                ))}
            </div>

            {/* Logs List */}
            {loading ? (
                <div className="py-16 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-500" />
                    <p className="text-muted-foreground text-sm">Cargando registros...</p>
                </div>
            ) : logs.length === 0 ? (
                <AnimatedCard className="p-12 text-center" index={0}>
                    <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                    <h3 className="text-lg font-bold mb-1">Sin registros</h3>
                    <p className="text-muted-foreground text-sm">No hay registros de auditoría{outcomeFilter !== 'ALL' ? ' con este resultado' : ''}</p>
                </AnimatedCard>
            ) : (
                <div className="space-y-2">
                    {logs.map((log, idx) => {
                        const cfg = OUTCOME_CONFIG[log.overallOutcome] || OUTCOME_CONFIG.PASS;
                        const Icon = cfg.icon;
                        const isExpanded = expandedId === log.id;
                        const results = parseResults(log.results);

                        return (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.03 }}
                            >
                                <div
                                    className="bg-card border rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all"
                                    onClick={() => setExpandedId(isExpanded ? null : log.id)}
                                >
                                    <div className="flex items-center gap-3 p-4">
                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}>
                                            <Icon className={`h-4 w-4 ${cfg.color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium truncate">{log.eventType}</p>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${cfg.bg} ${cfg.color}`}>
                                                    {cfg.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatTime(log.timestamp)}
                                                </span>
                                                <span>{log.rulesEvaluated} reglas</span>
                                                <span className="font-mono text-[10px]">{log.source}</span>
                                            </div>
                                        </div>
                                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        </motion.div>
                                    </div>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t"
                                            >
                                                <div className="p-4 space-y-3 text-xs">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <p className="text-muted-foreground">ID del Evento</p>
                                                            <p className="font-mono">{log.eventId}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-muted-foreground">Actor</p>
                                                            <p className="font-mono">{log.actorId}</p>
                                                        </div>
                                                    </div>
                                                    {log.details && (
                                                        <div>
                                                            <p className="text-muted-foreground mb-1">Detalles</p>
                                                            <p className="bg-muted/50 rounded-lg p-2">{log.details}</p>
                                                        </div>
                                                    )}
                                                    {Object.keys(results).length > 0 && (
                                                        <div>
                                                            <p className="text-muted-foreground mb-1">Resultados</p>
                                                            <pre className="bg-muted/50 rounded-lg p-2 overflow-x-auto text-[11px] font-mono">
                                                                {JSON.stringify(results, null, 2)}
                                                            </pre>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 disabled:opacity-40 transition-colors"
                    >
                        Anterior
                    </button>
                    <span className="text-xs text-muted-foreground">
                        Página {pagination.page} de {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                        disabled={page === pagination.totalPages}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 disabled:opacity-40 transition-colors"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </PageTransition>
    );
}
