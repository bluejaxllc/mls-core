'use client';
import { useLanguage } from '@/lib/i18n';
import { Shield, ToggleRight, AlertTriangle, Eye } from 'lucide-react';

export default function GovernancePage() {
    const { t } = useLanguage();

    const rules = [
        { id: 'CORE_001', name: t.sections.governance.rules.immutable.name, status: 'ACTIVE', type: 'BLOCK', desc: t.sections.governance.rules.immutable.desc },
        { id: 'CORE_002', name: t.sections.governance.rules.ownership.name, status: 'ACTIVE', type: 'BLOCK', desc: t.sections.governance.rules.ownership.desc },
        { id: 'QUAL_005', name: t.sections.governance.rules.scraped.name, status: 'ACTIVE', type: 'DOWNGRADE', desc: t.sections.governance.rules.scraped.desc },
        { id: 'QUAL_006', name: t.sections.governance.rules.exposure.name, status: 'INACTIVE', type: 'WARN', desc: t.sections.governance.rules.exposure.desc },
    ];

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'BLOCK': return t.sections.governance.block;
            case 'DOWNGRADE': return t.sections.governance.downgrade;
            case 'WARN': return t.sections.governance.warn;
            default: return type;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-bold tracking-tight">{t.sections.governance.title}</h2>
                <p className="text-muted-foreground">{t.sections.governance.subtitle}</p>
            </div>

            <div className="border rounded-md bg-card">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-500" /> {t.sections.governance.activeRules}
                    </h3>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{t.sections.governance.version}: v1.4.2</span>
                </div>
                <div className="divide-y divide-border">
                    {rules.map((rule) => (
                        <div key={rule.id} className="p-4 flex items-start justify-between hover:bg-muted/30 transition-colors">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-sm">{rule.name}</h4>
                                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 rounded">{rule.id}</span>
                                    {rule.status === 'INACTIVE' && <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 rounded">{t.sections.governance.disabled}</span>}
                                </div>
                                <p className="text-xs text-muted-foreground max-w-xl">{rule.desc}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded border ${rule.type === 'BLOCK' ? 'bg-red-900/20 text-red-400 border-red-900/50' :
                                    rule.type === 'DOWNGRADE' ? 'bg-orange-900/20 text-orange-400 border-orange-900/50' :
                                        'bg-blue-900/20 text-blue-400 border-blue-900/50'
                                    }`}>
                                    {getTypeLabel(rule.type)}
                                </span>
                                <button className="text-muted-foreground hover:text-foreground">
                                    <ToggleRight className={`h-6 w-6 ${rule.status === 'ACTIVE' ? 'text-green-500' : 'text-muted-foreground/30'}`} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-3 bg-muted/20 border-t text-xs text-center text-muted-foreground">
                    {t.sections.governance.documentation} <a href="#" className="underline">{t.sections.governance.legalRepository}</a>
                </div>
            </div>
        </div>
    )
}
