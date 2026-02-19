
'use client';

import { useLanguage } from '@/lib/i18n';
import { PageTransition, AnimatedCard } from '@/components/ui/animated';
import { useState, useEffect } from 'react';
import {
    Loader2, Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
    AlertTriangle, CheckCircle, Info, RefreshCw, Filter
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { authFetch } from '@/lib/api';

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

export default function AuditLogsPage() {
    const { t } = useLanguage();
    const { data: session } = useSession();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sourceFilter, setSourceFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [expandedLog, setExpandedLog] = useState<string | null>(null);
    const [rules, setRules] = useState<any[]>([]);
    const [ruleFilter, setRuleFilter] = useState('');

    useEffect(() => {
        fetchLogs();
    }, [page, sourceFilter, statusFilter]);

    useEffect(() => {
        // Fetch rules for the rule filter dropdown
        fetch('/api/rules').then(r => r.ok ? r.json() : []).then(setRules).catch(() => { });
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '20'
            });
            if (sourceFilter) queryParams.append('source', sourceFilter);
            if (statusFilter) queryParams.append('status', statusFilter);

            const data = await authFetch(`/api/audit-logs?${queryParams.toString()}`, {}, session?.accessToken);

            setLogs(data.items);
            setTotalPages(data.pagination.totalPages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'BLOCK': return <AlertTriangle className="h-4 w-4 text-red-500" />;
            case 'WARN': case 'FLAG': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
            case 'ALLOW': case 'PASS': return <CheckCircle className="h-4 w-4 text-green-500" />;
            default: return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'BLOCK': return 'text-red-400 bg-red-500/10 border-red-500/30';
            case 'WARN': case 'FLAG': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
            case 'ALLOW': case 'PASS': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
            default: return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const parseResults = (resultsStr: string): any[] => {
        try {
            const parsed = typeof resultsStr === 'string' ? JSON.parse(resultsStr) : resultsStr;
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    // Client-side filtering by search query and rule ID
    const filteredLogs = logs.filter(log => {
        const matchesSearch = !searchQuery ||
            log.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.actorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.eventId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (log.details || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRule = !ruleFilter || (() => {
            const results = parseResults(log.results);
            return results.some(r => r.ruleId === ruleFilter);
        })();

        return matchesSearch && matchesRule;
    });

    return (
        <PageTransition className="space-y-6">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-2">
                    <Link href="/governance" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-sm">
                        <ChevronLeft className="h-4 w-4" /> Volver a Gobernanza
                    </Link>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Registro de Auditoría</h2>
                        <p className="text-sm md:text-base text-muted-foreground">Historial completo de eventos y decisiones de gobernanza.</p>
                    </div>
                    <button
                        onClick={() => fetchLogs()}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                        title="Recargar"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar en logs (ID, usuario, acción)..."
                        className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <select
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    >
                        <option value="">Todos los Estados</option>
                        <option value="BLOCK">Bloqueados</option>
                        <option value="WARN">Advertencias</option>
                        <option value="ALLOW">Permitidos</option>
                        <option value="PASS">Aprobados</option>
                    </select>
                    <select
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        value={sourceFilter}
                        onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
                    >
                        <option value="">Todas las Fuentes</option>
                        <option value="RULE_ENGINE">Motor de Reglas</option>
                        <option value="SYSTEM">Sistema</option>
                        <option value="USER">Usuario</option>
                    </select>
                    <select
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        value={ruleFilter}
                        onChange={(e) => setRuleFilter(e.target.value)}
                    >
                        <option value="">Todas las Reglas</option>
                        {rules.map(r => (
                            <option key={r.id} value={r.id}>{r.name} ({r.id})</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Logs Table */}
            <div className="border rounded-md bg-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 w-8"></th>
                                <th className="px-4 py-3">Timestamp</th>
                                <th className="px-4 py-3">Evento</th>
                                <th className="px-4 py-3">Actor</th>
                                <th className="px-4 py-3">Fuente</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3">Reglas</th>
                                <th className="px-4 py-3">Detalles</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500" />
                                    </td>
                                </tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                                        No se encontraron registros.
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => {
                                    const isExpanded = expandedLog === log.id;
                                    const results = parseResults(log.results);

                                    return (
                                        <>
                                            <tr
                                                key={log.id}
                                                className="hover:bg-muted/30 transition-colors cursor-pointer"
                                                onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                                            >
                                                <td className="px-4 py-3">
                                                    {results.length > 0 && (
                                                        isExpanded
                                                            ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                                            : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground text-xs">
                                                    {formatDate(log.timestamp)}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-xs">
                                                    {log.eventType}
                                                </td>
                                                <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                                                    {log.actorId.substring(0, 12)}...
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="bg-muted px-2 py-1 rounded text-xs font-mono">
                                                        {log.source}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded border ${getStatusColor(log.overallOutcome)}`}>
                                                        {getStatusIcon(log.overallOutcome)}
                                                        {log.overallOutcome}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                                    {log.rulesEvaluated}
                                                </td>
                                                <td className="px-4 py-3 max-w-[200px] truncate text-xs text-muted-foreground" title={log.details || ''}>
                                                    {log.details || '-'}
                                                </td>
                                            </tr>

                                            {/* Expanded Detail Row */}
                                            {isExpanded && results.length > 0 && (
                                                <tr key={`${log.id}-detail`} className="bg-muted/10">
                                                    <td colSpan={8} className="px-6 py-4">
                                                        <div className="space-y-2">
                                                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                                                Resultados de Reglas ({results.length})
                                                            </h4>
                                                            <div className="grid gap-2">
                                                                {results.map((r: any, idx: number) => (
                                                                    <div key={idx} className={`p-3 rounded-lg border text-xs ${r.passed ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
                                                                        <div className="flex items-center justify-between mb-1">
                                                                            <div className="flex items-center gap-2">
                                                                                {r.passed
                                                                                    ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                                                                                    : <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                                                                                }
                                                                                <span className="font-medium">{r.ruleName || r.ruleId}</span>
                                                                                <span className="text-muted-foreground font-mono">{r.ruleId}</span>
                                                                            </div>
                                                                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${r.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                                                                                r.severity === 'ERROR' ? 'bg-red-500/20 text-red-400' :
                                                                                    r.severity === 'WARNING' ? 'bg-orange-500/20 text-orange-400' :
                                                                                        'bg-blue-500/20 text-blue-400'
                                                                                }`}>
                                                                                {r.severity}
                                                                            </span>
                                                                        </div>
                                                                        {r.reasons?.length > 0 && (
                                                                            <p className="text-muted-foreground mt-1 ml-5">{r.reasons.join('; ')}</p>
                                                                        )}
                                                                        {r.actionRequired && r.actionRequired.type !== 'NONE' && (
                                                                            <div className="mt-1 ml-5 text-[10px] text-muted-foreground">
                                                                                Acción: <span className="font-bold">{r.actionRequired.type}</span>
                                                                                {r.actionRequired.details && Object.keys(r.actionRequired.details).length > 0 && (
                                                                                    <span> — {JSON.stringify(r.actionRequired.details)}</span>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t flex items-center justify-between">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 hover:bg-muted rounded disabled:opacity-50"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-muted-foreground">
                        Página {page} de {totalPages || 1}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        className="p-2 hover:bg-muted rounded disabled:opacity-50"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </PageTransition>
    );
}
