'use client';

import { ShieldCheck, History, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
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
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="h-12 w-12 rounded-full border-4 border-green-500 flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                        >
                            94
                        </motion.div>
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
                        {[
                            { name: t.sections.governance.rules.immutable.name, status: t.common.pass, color: 'green' },
                            { name: t.sections.governance.rules.ownership.name, status: t.common.pass, color: 'green' },
                            { name: t.sections.governance.rules.priceDrift.name, status: t.common.warn, color: 'yellow' }
                        ].map((rule, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                className={`bg-muted/50 p-2 rounded text-xs border border-${rule.color}-900/30 flex justify-between`}
                            >
                                <span>{rule.name}</span>
                                <span className={`text-${rule.color}-500 font-mono`}>{rule.status}</span>
                            </motion.div>
                        ))}
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
                            <p className="text-[10px] text-muted-foreground">2 {t.common.mins} {t.rightPanel.ago} {t.common.by} {t.common.brokerAdmin}</p>
                        </div>
                        <div className="ml-4 relative">
                            <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-muted-foreground"></div>
                            <p className="text-xs font-medium">{t.rightPanel.verificationRun}</p>
                            <p className="text-[10px] text-muted-foreground">1 {t.common.hour} {t.rightPanel.ago} {t.common.by} {t.common.system}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
