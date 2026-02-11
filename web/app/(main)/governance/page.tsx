'use client';
import { useLanguage } from '@/lib/i18n';
import { Shield, ToggleRight, AlertTriangle, Eye, Search, BarChart3, Clock, FileText } from 'lucide-react';
import { PageTransition, AnimatedCard } from '@/components/ui/animated';
import { useState } from 'react';

export default function GovernancePage() {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRule, setSelectedRule] = useState<any>(null);
    const [ruleStates, setRuleStates] = useState<Record<string, boolean>>({
        'CORE_001': true,
        'CORE_002': true,
        'QUAL_005': true,
        'QUAL_006': false,
    });

    const rules = [
        {
            id: 'CORE_001',
            name: t.sections.governance.rules.immutable.name,
            type: 'BLOCK',
            desc: t.sections.governance.rules.immutable.desc,
            appliedCount: 234,
            blockedCount: 12,
            lastTriggered: '2 hours ago'
        },
        {
            id: 'CORE_002',
            name: t.sections.governance.rules.ownership.name,
            type: 'BLOCK',
            desc: t.sections.governance.rules.ownership.desc,
            appliedCount: 456,
            blockedCount: 8,
            lastTriggered: '45 mins ago'
        },
        {
            id: 'QUAL_005',
            name: t.sections.governance.rules.scraped.name,
            type: 'DOWNGRADE',
            desc: t.sections.governance.rules.scraped.desc,
            appliedCount: 1234,
            blockedCount: 0,
            lastTriggered: '10 mins ago'
        },
        {
            id: 'QUAL_006',
            name: t.sections.governance.rules.exposure.name,
            type: 'WARN',
            desc: t.sections.governance.rules.exposure.desc,
            appliedCount: 89,
            blockedCount: 0,
            lastTriggered: 'Not active'
        },
    ];

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'BLOCK': return t.sections.governance.block;
            case 'DOWNGRADE': return t.sections.governance.downgrade;
            case 'WARN': return t.sections.governance.warn;
            default: return type;
        }
    };

    const toggleRule = (ruleId: string) => {
        setRuleStates(prev => ({
            ...prev,
            [ruleId]: !prev[ruleId]
        }));
    };

    const filteredRules = rules.filter(rule =>
        rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeRulesCount = Object.values(ruleStates).filter(Boolean).length;
    const totalApplications = rules.reduce((sum, rule) => sum + rule.appliedCount, 0);
    const totalBlocks = rules.reduce((sum, rule) => sum + rule.blockedCount, 0);

    return (
        <PageTransition className="space-y-6">
            {/* Header - RESPONSIVE */}
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t.sections.governance.title}</h2>
                <p className="text-sm md:text-base text-muted-foreground">{t.sections.governance.subtitle}</p>
            </div>

            {/* Stats Cards - RESPONSIVE */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <AnimatedCard className="p-4 rounded-xl border bg-card">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Reglas Activas</p>
                            <p className="text-2xl font-bold">{activeRulesCount}/{rules.length}</p>
                        </div>
                    </div>
                </AnimatedCard>

                <AnimatedCard className="p-4 rounded-xl border bg-card" index={1}>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Aplicaciones Totales</p>
                            <p className="text-2xl font-bold">{totalApplications.toLocaleString()}</p>
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
                            <p className="text-2xl font-bold">{totalBlocks}</p>
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
                        placeholder="Buscar reglas..."
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
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{t.sections.governance.version}: v1.4.2</span>
                </div>
                <div className="divide-y divide-border">
                    {filteredRules.map((rule) => (
                        <div key={rule.id} className="p-4 hover:bg-muted/30 transition-colors">
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                <div className="flex-1 w-full">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h4 className="font-medium text-sm">{rule.name}</h4>
                                        <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 rounded">{rule.id}</span>
                                        {!ruleStates[rule.id] && <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 rounded">{t.sections.governance.disabled}</span>}
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-3">{rule.desc}</p>

                                    {/* Rule Stats - RESPONSIVE */}
                                    <div className="flex flex-wrap gap-3 md:gap-4 text-xs">
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <BarChart3 className="h-3 w-3" />
                                            <span>{rule.appliedCount} aplicaciones</span>
                                        </div>
                                        {rule.blockedCount > 0 && (
                                            <div className="flex items-center gap-1 text-red-400">
                                                <AlertTriangle className="h-3 w-3" />
                                                <span>{rule.blockedCount} bloqueadas</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            <span>{rule.lastTriggered}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded border whitespace-nowrap flex-shrink-0 ${rule.type === 'BLOCK' ? 'bg-red-900/20 text-red-400 border-red-900/50' :
                                        rule.type === 'DOWNGRADE' ? 'bg-orange-900/20 text-orange-400 border-orange-900/50' :
                                            'bg-blue-900/20 text-blue-400 border-blue-900/50'
                                        }`}>
                                        {getTypeLabel(rule.type)}
                                    </span>
                                    <button
                                        onClick={() => setSelectedRule(rule)}
                                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                                        title="Ver detalles"
                                    >
                                        <Eye className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => toggleRule(rule.id)}
                                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                                    >
                                        <ToggleRight className={`h-6 w-6 transition-colors ${ruleStates[rule.id] ? 'text-green-500' : 'text-muted-foreground/30'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-3 bg-muted/20 border-t text-xs text-center text-muted-foreground">
                    {t.sections.governance.documentation} <a href="/legal" className="underline hover:text-foreground transition-colors">{t.sections.governance.legalRepository}</a>
                </div>
            </div>

            {/* Rule Details Modal */}
            {selectedRule && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedRule(null)}
                >
                    <div
                        className="bg-card border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b sticky top-0 bg-card">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-bold mb-1">{selectedRule.name}</h3>
                                    <p className="text-sm text-muted-foreground">ID de Regla: {selectedRule.id}</p>
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
                                <p className="text-sm text-muted-foreground">{selectedRule.desc}</p>
                            </div>

                            {/* Stats - RESPONSIVE */}
                            <div>
                                <h4 className="font-semibold mb-3">Estadísticas</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="p-3 rounded border bg-muted/30">
                                        <p className="text-xs text-muted-foreground mb-1">Aplicaciones</p>
                                        <p className="text-xl font-bold">{selectedRule.appliedCount}</p>
                                    </div>
                                    <div className="p-3 rounded border bg-muted/30">
                                        <p className="text-xs text-muted-foreground mb-1">Bloqueadas</p>
                                        <p className="text-xl font-bold text-red-400">{selectedRule.blockedCount}</p>
                                    </div>
                                    <div className="p-3 rounded border bg-muted/30">
                                        <p className="text-xs text-muted-foreground mb-1">Tipo</p>
                                        <p className="text-sm font-bold">{getTypeLabel(selectedRule.type)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div>
                                <h4 className="font-semibold mb-3">Actividad Reciente</h4>
                                <div className="space-y-2">
                                    <div className="p-3 rounded border bg-muted/20 text-sm">
                                        <p className="font-medium">Última activación: {selectedRule.lastTriggered}</p>
                                        <p className="text-xs text-muted-foreground mt-1">Listado #12345 - Modificación no autorizada prevenida</p>
                                    </div>
                                    <div className="p-3 rounded border bg-muted/20 text-sm">
                                        <p className="font-medium">Hace 3 horas</p>
                                        <p className="text-xs text-muted-foreground mt-1">Listado #12304 - Regla aplicada exitosamente</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions - RESPONSIVE */}
                            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                                <button
                                    onClick={() => toggleRule(selectedRule.id)}
                                    className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${ruleStates[selectedRule.id]
                                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                        }`}
                                >
                                    {ruleStates[selectedRule.id] ? 'Deshabilitar Regla' : 'Habilitar Regla'}
                                </button>
                                <button
                                    onClick={() => alert('Ver registro de auditoría completo - Próximamente')}
                                    className="flex-1 px-4 py-2 rounded font-medium bg-muted hover:bg-muted/70 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FileText className="h-4 w-4" />
                                    <span className="hidden sm:inline">Ver Registro de</span> Auditoría
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageTransition>
    )
}
