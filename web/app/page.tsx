'use client';
import { useLanguage } from '@/lib/i18n';

export default function Dashboard() {
    const { t } = useLanguage();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">{t.dashboard.title}</h2>
                <p className="text-muted-foreground">{t.dashboard.subtitle}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Metric Cards - Placeholders for now */}
                <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">{t.dashboard.activeListings}</div>
                    <div className="text-2xl font-bold">1,204</div>
                    <div className="text-xs text-muted-foreground">+2.5% {t.dashboard.fromLastMonth}</div>
                </div>
                <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">{t.dashboard.pendingReview}</div>
                    <div className="text-2xl font-bold text-yellow-500">18</div>
                    <div className="text-xs text-muted-foreground">{t.dashboard.requiresAttention}</div>
                </div>
                <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">{t.dashboard.governanceAlerts}</div>
                    <div className="text-2xl font-bold text-red-500">3</div>
                    <div className="text-xs text-muted-foreground">{t.dashboard.criticalBlocks}</div>
                </div>
                <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">{t.dashboard.systemHealth}</div>
                    <div className="text-2xl font-bold text-green-500">99.9%</div>
                    <div className="text-xs text-muted-foreground">{t.dashboard.ruleEngineOp}</div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border bg-card text-card-foreground p-6">
                    <h3 className="font-semibold mb-4">{t.dashboard.governanceFeed}</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0 border-border/50">
                                <div className="h-8 w-8 rounded bg-muted/50 flex items-center justify-center text-xs font-mono">
                                    LOG
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Listing #88392 Downgraded to DRAFT</p>
                                    <p className="text-xs text-muted-foreground">Rule: Scraped Data Downgrade • 2 mins ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-3 rounded-xl border bg-card text-card-foreground p-6">
                    <h3 className="font-semibold mb-4">{t.dashboard.openClaims}</h3>
                    <div className="space-y-4">
                        <div className="p-3 rounded bg-muted/30 border border-border">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-bold text-red-400">OWNERSHIP DISPUTE</span>
                                <span className="text-[10px] text-muted-foreground">1h ago</span>
                            </div>
                            <p className="text-sm font-medium mb-2">Listing #9921 vs #1120</p>
                            <button className="text-xs bg-background border px-2 py-1 rounded hover:bg-muted">Review Evidence</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
