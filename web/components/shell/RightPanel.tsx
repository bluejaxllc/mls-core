'use client';

import { ShieldCheck, History, Activity } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export function RightPanel() {
    const { t } = useLanguage();

    return (
        <div className="w-80 border-l bg-card flex flex-col h-full">
            <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-400" />
                    {t.rightPanel.title}
                </h3>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-6">

                {/* Trust Score Mock */}
                <div className="space-y-2">
                    <h4 className="text-xs font-mono text-muted-foreground uppercase">{t.rightPanel.trustScore}</h4>
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full border-4 border-green-500 flex items-center justify-center font-bold text-lg">
                            94
                        </div>
                        <div className="text-sm text-sm">
                            <p className="font-medium">{t.rightPanel.excellent}</p>
                            <p className="text-muted-foreground text-xs">{t.rightPanel.verifiedSource}</p>
                        </div>
                    </div>
                </div>

                {/* Rule Evaluation Mock */}
                <div className="space-y-2">
                    <h4 className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> {t.rightPanel.ruleEvaluation}
                    </h4>
                    <div className="space-y-2">
                        <div className="bg-muted/50 p-2 rounded text-xs border border-green-900/30 flex justify-between">
                            <span>Listing Immutability</span>
                            <span className="text-green-500 font-mono">PASS</span>
                        </div>
                        <div className="bg-muted/50 p-2 rounded text-xs border border-green-900/30 flex justify-between">
                            <span>Broker Ownership</span>
                            <span className="text-green-500 font-mono">PASS</span>
                        </div>
                        <div className="bg-muted/50 p-2 rounded text-xs border border-yellow-900/30 flex justify-between">
                            <span>Price Drift Check</span>
                            <span className="text-yellow-500 font-mono">WARN</span>
                        </div>
                    </div>
                </div>

                {/* History Mock */}
                <div className="space-y-2">
                    <h4 className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-1">
                        <History className="h-3 w-3" /> {t.rightPanel.recentActivity}
                    </h4>
                    <div className="relative border-l border-muted ml-1 space-y-4">
                        <div className="ml-4 relative">
                            <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-blue-500"></div>
                            <p className="text-xs font-medium">{t.rightPanel.priceUpdated}</p>
                            <p className="text-[10px] text-muted-foreground">2 mins {t.rightPanel.ago} by Broker Admin</p>
                        </div>
                        <div className="ml-4 relative">
                            <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-muted-foreground"></div>
                            <p className="text-xs font-medium">{t.rightPanel.verificationRun}</p>
                            <p className="text-[10px] text-muted-foreground">1 hour {t.rightPanel.ago} by System</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
