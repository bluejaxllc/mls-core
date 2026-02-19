'use client';
import { useLanguage } from '@/lib/i18n';
import {
    Shield, ToggleRight, AlertTriangle, Eye, Search, BarChart3, Clock, FileText,
    Loader2, Zap, CheckCircle2, XCircle, ChevronRight, Layers, ArrowUpRight
} from 'lucide-react';
import { PageTransition, AnimatedCard } from '@/components/ui/animated';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { authFetch } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface RuleStats {
    totalEvents: number;
    totalBlocks: number;
    totalPasses: number;
    totalWarnings: number;
    perRuleStats: Record<string, { evaluations: number; blocks: number; passed: number; warnings: number }>;
}

interface GovernanceRule {
    id: string;
    name: string;
    description: string;
    triggerEvents: string[];
    priority: number;
    version: string;
    status: string;
    isEnabled: boolean;
}

const EVENT_LABELS: Record<string, { label: string; color: string }> = {
    LISTING_CREATED: { label: 'Creación', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
    LISTING_UPDATED: { label: 'Edición', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    LISTING_DELETED: { label: 'Eliminación', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    CLAIM_FILED: { label: 'Reclamo', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
    CLAIM_RESOLVED: { label: 'Resolución', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    DATA_INGESTED: { label: 'Ingestión', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
};

const getPriorityInfo = (priority: number) => {
    if (priority >= 95) return { label: 'Crítica', color: 'text-red-400 bg-red-500/10 border-red-500/30' };
    if (priority >= 85) return { label: 'Alta', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' };
    if (priority >= 70) return { label: 'Media', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' };
    return { label: 'Normal', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
};

export default function GovernancePage() {
    const { t } = useLanguage();
    const { data: session }: any = useSession();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRule, setSelectedRule] = useState<GovernanceRule | null>(null);
    const [rules, setRules] = useState<GovernanceRule[]>([]);
    const [stats, setStats] = useState<RuleStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        if (!session?.accessToken) return;
        try {
            setLoading(true);
            const [rulesData, statsData] = await Promise.all([
                authFetch('/api/rules', {}, session.accessToken),
                authFetch('/api/rules/stats', {}, session.accessToken),
            ]);

            if (rulesData) setRules(rulesData);
            if (statsData) setStats(statsData);
        } catch (err) {
            console.error(err);
            setError('Error loading governance data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) fetchData();
    }, [session]);

    const toggleRule = async (ruleId: string, currentStatus: boolean) => {
        setRules(prev => prev.map(r => r.id === ruleId ? { ...r, isEnabled: !currentStatus } : r));
        try {
            await authFetch(`/api/rules/${ruleId}`, {
                method: 'PATCH',
                body: JSON.stringify({ isEnabled: !currentStatus })
            }, session?.accessToken);
        } catch (err) {
            setRules(prev => prev.map(r => r.id === ruleId ? { ...r, isEnabled: currentStatus } : r));
            toast.error('Error al actualizar el estado de la regla');
        }
    };

    const filteredRules = rules.filter(rule =>
        rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeRulesCount = rules.filter(r => r.isEnabled).length;
    const totalEvents = stats?.totalEvents || 0;
    const totalBlocks = stats?.totalBlocks || 0;

    const getRuleStats = (ruleId: string) => {
        return stats?.perRuleStats?.[ruleId] || { evaluations: 0, blocks: 0, passed: 0, warnings: 0 };
    };

    if (loading && rules.length === 0) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <PageTransition className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t.sections.governance.title}</h2>
                    <p className="text-sm md:text-base text-muted-foreground">{t.sections.governance.subtitle}</p>
                </div>
                <Link href="/governance/logs" className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                    <FileText className="h-4 w-4" />
                    Ver Registro de Auditoría
                </Link>
            </div>

            {/* Stats Cards with Real Data */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-4">
                <AnimatedCard className="p-4 rounded-xl border bg-card">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Reglas Activas</p>
                            <p className="text-2xl font-bold">{activeRulesCount}<span className="text-sm font-normal text-muted-foreground">/{rules.length}</span></p>
                        </div>
                    </div>
                </AnimatedCard>

                <AnimatedCard className="p-4 rounded-xl border bg-card" index={1}>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Eventos Procesados</p>
                            <p className="text-2xl font-bold">{totalEvents.toLocaleString()}</p>
                        </div>
                    </div>
                </AnimatedCard>

                <AnimatedCard className="p-4 rounded-xl border bg-card" index={2}>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Acciones Bloqueadas</p>
                            <p className="text-2xl font-bold text-red-400">{totalBlocks.toLocaleString()}</p>
                        </div>
                    </div>
                </AnimatedCard>

                <AnimatedCard className="p-4 rounded-xl border bg-card" index={3}>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Aprobaciones</p>
                            <p className="text-2xl font-bold text-emerald-400">{(stats?.totalPasses || 0).toLocaleString()}</p>
                        </div>
                    </div>
                </AnimatedCard>
            </div>

            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar reglas por nombre, ID, o descripción..."
                        className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Rules List */}
            <div className="border rounded-md bg-card">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-500" /> {t.sections.governance.activeRules}
                    </h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{t.sections.governance.version}: v1.5.0 (Live)</span>
                </div>
                <div className="divide-y divide-border">
                    {filteredRules.map((rule) => {
                        const ruleStats = getRuleStats(rule.id);
                        const priorityInfo = getPriorityInfo(rule.priority);

                        return (
                            <div key={rule.id} className="p-4 hover:bg-muted/30 transition-colors">
                                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                    <div className="flex-1 w-full">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h4 className="font-medium text-sm">{rule.name}</h4>
                                            <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 rounded">{rule.id}</span>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${priorityInfo.color}`}>
                                                P{rule.priority} • {priorityInfo.label}
                                            </span>
                                            {!rule.isEnabled && <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 rounded">{t.sections.governance.disabled}</span>}
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-3">{rule.description}</p>

                                        {/* Trigger Events + Stats Row */}
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            {rule.triggerEvents?.map(evt => {
                                                const evtInfo = EVENT_LABELS[evt] || { label: evt, color: 'bg-muted text-muted-foreground border-border' };
                                                return (
                                                    <span key={evt} className={`text-[10px] px-1.5 py-0.5 rounded border ${evtInfo.color}`}>
                                                        <Zap className="h-2.5 w-2.5 inline mr-0.5 -mt-0.5" />
                                                        {evtInfo.label}
                                                    </span>
                                                );
                                            })}
                                        </div>

                                        {/* Real Stats */}
                                        <div className="flex flex-wrap gap-3 md:gap-4 text-xs">
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <BarChart3 className="h-3 w-3" />
                                                <span>{ruleStats.evaluations} evaluaciones</span>
                                            </div>
                                            {ruleStats.blocks > 0 && (
                                                <div className="flex items-center gap-1 text-red-400">
                                                    <XCircle className="h-3 w-3" />
                                                    <span>{ruleStats.blocks} bloqueadas</span>
                                                </div>
                                            )}
                                            {ruleStats.passed > 0 && (
                                                <div className="flex items-center gap-1 text-emerald-400">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    <span>{ruleStats.passed} aprobadas</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                <span>v{rule.version}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                                        <button
                                            onClick={() => setSelectedRule(rule)}
                                            className="text-muted-foreground hover:text-foreground transition-colors p-1"
                                            title="Ver detalles"
                                        >
                                            <Eye className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => toggleRule(rule.id, rule.isEnabled)}
                                            className="text-muted-foreground hover:text-foreground transition-colors p-1"
                                        >
                                            <ToggleRight className={`h-6 w-6 transition-colors ${rule.isEnabled ? 'text-green-500' : 'text-muted-foreground/30'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="p-3 bg-muted/20 border-t text-xs text-center text-muted-foreground">
                    {t.sections.governance.documentation} <a href="/legal" className="underline hover:text-foreground transition-colors">{t.sections.governance.legalRepository}</a>
                </div>
            </div>

            {/* Rule Details Modal — Enriched */}
            {selectedRule && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedRule(null)}
                >
                    <div
                        className="bg-card border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b sticky top-0 bg-card z-10">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-bold mb-1">{selectedRule.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">ID: {selectedRule.id}</span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getPriorityInfo(selectedRule.priority).color}`}>
                                            Prioridad {selectedRule.priority}
                                        </span>
                                        <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 rounded">
                                            v{selectedRule.version}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedRule(null)}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Description */}
                            <div>
                                <h4 className="font-semibold mb-2">Descripción</h4>
                                <p className="text-sm text-muted-foreground">{selectedRule.description}</p>
                            </div>

                            {/* Trigger Events */}
                            <div>
                                <h4 className="font-semibold mb-3">Eventos de Activación</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedRule.triggerEvents?.map(evt => {
                                        const evtInfo = EVENT_LABELS[evt] || { label: evt, color: 'bg-muted text-muted-foreground border-border' };
                                        return (
                                            <span key={evt} className={`text-xs px-2.5 py-1 rounded-md border ${evtInfo.color} flex items-center gap-1.5`}>
                                                <Zap className="h-3 w-3" />
                                                {evtInfo.label}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Real Stats */}
                            <div>
                                <h4 className="font-semibold mb-3">Estadísticas de Ejecución</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                    {(() => {
                                        const rs = getRuleStats(selectedRule.id);
                                        return (
                                            <>
                                                <div className="p-3 rounded-lg border bg-muted/30">
                                                    <p className="text-xs text-muted-foreground mb-1">Evaluaciones</p>
                                                    <p className="text-xl font-bold">{rs.evaluations}</p>
                                                </div>
                                                <div className="p-3 rounded-lg border bg-muted/30">
                                                    <p className="text-xs text-muted-foreground mb-1">Aprobadas</p>
                                                    <p className="text-xl font-bold text-emerald-400">{rs.passed}</p>
                                                </div>
                                                <div className="p-3 rounded-lg border bg-muted/30">
                                                    <p className="text-xs text-muted-foreground mb-1">Bloqueadas</p>
                                                    <p className="text-xl font-bold text-red-400">{rs.blocks}</p>
                                                </div>
                                                <div className="p-3 rounded-lg border bg-muted/30">
                                                    <p className="text-xs text-muted-foreground mb-1">Advertencias</p>
                                                    <p className="text-xl font-bold text-yellow-400">{rs.warnings}</p>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                                {getRuleStats(selectedRule.id).evaluations === 0 && (
                                    <p className="text-xs text-muted-foreground mt-2 italic">
                                        Sin datos de ejecución aún. Las estadísticas aparecerán conforme el motor procese eventos.
                                    </p>
                                )}
                            </div>

                            {/* Priority Indicator */}
                            <div>
                                <h4 className="font-semibold mb-3">Prioridad de Evaluación</h4>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 transition-all"
                                            style={{ width: `${selectedRule.priority}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold min-w-[3rem] text-right">{selectedRule.priority}/100</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Las reglas con mayor prioridad se evalúan primero. Valor actual: <strong>{getPriorityInfo(selectedRule.priority).label}</strong>.
                                </p>
                            </div>

                            {/* View in Audit Logs */}
                            <Link
                                href="/governance/logs"
                                className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-400 transition-colors"
                            >
                                <Layers className="h-4 w-4" />
                                Ver historial completo en Auditoría
                                <ArrowUpRight className="h-3 w-3" />
                            </Link>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                                <button
                                    onClick={() => toggleRule(selectedRule.id, selectedRule.isEnabled)}
                                    className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${selectedRule.isEnabled
                                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                        }`}
                                >
                                    {selectedRule.isEnabled ? 'Deshabilitar Regla' : 'Habilitar Regla'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageTransition>
    );
}
