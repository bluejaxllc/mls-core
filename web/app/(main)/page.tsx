'use client';
import { useLanguage } from '@/lib/i18n';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function Dashboard() {
    const { t } = useLanguage();
    const { data: session }: any = useSession();
    const [stats, setStats] = useState<any>(null);
    const [feed, setFeed] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!session?.accessToken) return;

            try {
                const [statsRes, feedRes] = await Promise.all([
                    fetch(`${API_URL}/api/protected/dashboard/stats`, {
                        headers: { 'Authorization': `Bearer ${session.accessToken}` }
                    }),
                    fetch(`${API_URL}/api/protected/dashboard/feed`, {
                        headers: { 'Authorization': `Bearer ${session.accessToken}` }
                    })
                ]);

                if (statsRes.ok) setStats(await statsRes.json());
                if (feedRes.ok) setFeed(await feedRes.json());
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchDashboardData();
        }
    }, [session, API_URL]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">{t.dashboard.title}</h2>
                <p className="text-muted-foreground">{t.dashboard.subtitle}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Metric Cards */}
                <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">{t.dashboard.activeListings}</div>
                    <div className="text-2xl font-bold">{loading ? '...' : stats?.activeListings?.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">+2.5% {t.dashboard.fromLastMonth}</div>
                </div>
                <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">{t.dashboard.pendingReview}</div>
                    <div className="text-2xl font-bold text-yellow-500">{loading ? '...' : stats?.pendingReview}</div>
                    <div className="text-xs text-muted-foreground">{t.dashboard.requiresAttention}</div>
                </div>
                <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">{t.dashboard.governanceAlerts}</div>
                    <div className="text-2xl font-bold text-red-500">{loading ? '...' : stats?.governanceAlerts}</div>
                    <div className="text-xs text-muted-foreground">{t.dashboard.criticalBlocks}</div>
                </div>
                <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">{t.dashboard.systemHealth}</div>
                    <div className="text-2xl font-bold text-green-500">{loading ? '...' : stats?.systemHealth}</div>
                    <div className="text-xs text-muted-foreground">{t.dashboard.ruleEngineOp}</div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border bg-card text-card-foreground p-6">
                    <h3 className="font-semibold mb-4">{t.dashboard.governanceFeed}</h3>
                    <div className="space-y-4">
                        {loading ? (
                            <p className="text-sm text-muted-foreground">Loading feed...</p>
                        ) : feed.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No recent activity.</p>
                        ) : feed.map((log: any) => (
                            <div key={log.eventId} className="flex items-start gap-4 pb-4 border-b last:border-0 border-border/50">
                                <div className={`h-8 w-8 rounded flex items-center justify-center text-[10px] font-mono ${log.overallOutcome === 'BLOCK' ? 'bg-red-500/20 text-red-500' :
                                        log.overallOutcome === 'FLAG' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'
                                    }`}>
                                    {log.overallOutcome}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Event {log.eventType}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {t.dashboard.logs.rulePrefix}{log.rulesEvaluated} rules evaluated • {new Date(log.timestamp).toLocaleTimeString()}
                                    </p>
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
                                <span className="text-xs font-bold text-red-400">{t.dashboard.claims.dispute}</span>
                                <span className="text-[10px] text-muted-foreground">{t.dashboard.logs.timeHour}</span>
                            </div>
                            <p className="text-sm font-medium mb-2">Listing #9921 vs #1120</p>
                            <button className="text-xs bg-background border px-2 py-1 rounded hover:bg-muted">{t.dashboard.claims.review}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
