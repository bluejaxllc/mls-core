'use client';
import { useLanguage } from '@/lib/i18n';
import { Shield, ToggleRight, AlertTriangle, Eye } from 'lucide-react';

export default function GovernancePage() {
    const { t } = useLanguage();

    const rules = [
        { id: 'CORE_001', name: 'Listing Version Immutability', status: 'ACTIVE', type: 'BLOCK', desc: 'Prevents modification of locking fields on Verified listings.' },
        { id: 'CORE_002', name: 'Broker Ownership Enforcement', status: 'ACTIVE', type: 'BLOCK', desc: 'Only the designated broker owner can modify a commercial listing.' },
        { id: 'QUAL_005', name: 'Scraped Data Downgrade', status: 'ACTIVE', type: 'DOWNGRADE', desc: 'Automatically reduces trust score of scraped ingestion feeds.' },
        { id: 'QUAL_006', name: 'Public Exposure Requirements', status: 'INACTIVE', type: 'WARN', desc: 'Ensures minimum photo and description quality for public visibility.' },
    ];

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
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">System Version: v1.4.2</span>
                </div>
                <div className="divide-y divide-border">
                    {rules.map((rule) => (
                        <div key={rule.id} className="p-4 flex items-start justify-between hover:bg-muted/30 transition-colors">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-sm">{rule.name}</h4>
                                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 rounded">{rule.id}</span>
                                    {rule.status === 'INACTIVE' && <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 rounded">DISABLED</span>}
                                </div>
                                <p className="text-xs text-muted-foreground max-w-xl">{rule.desc}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded border ${rule.type === 'BLOCK' ? 'bg-red-900/20 text-red-400 border-red-900/50' :
                                        rule.type === 'DOWNGRADE' ? 'bg-orange-900/20 text-orange-400 border-orange-900/50' :
                                            'bg-blue-900/20 text-blue-400 border-blue-900/50'
                                    }`}>
                                    {rule.type}
                                </span>
                                <button className="text-muted-foreground hover:text-foreground">
                                    <ToggleRight className={`h-6 w-6 ${rule.status === 'ACTIVE' ? 'text-green-500' : 'text-muted-foreground/30'}`} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-3 bg-muted/20 border-t text-xs text-center text-muted-foreground">
                    View full rule documentation in the <a href="#" className="underline">Legal Repository</a>
                </div>
            </div>
        </div>
    )
}
