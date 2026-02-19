'use client';

import { AnimatedCard } from '@/components/ui/animated';
import { AlertTriangle, ShieldAlert, FileWarning, CheckCircle } from 'lucide-react';

interface GovernanceStatsProps {
    stats: {
        activeListings: number;
        pendingReview: number;
        governanceAlerts: number;
        openClaims: number;
        systemHealth: string;
        activeRules: number;
    } | null;
    loading: boolean;
}

export function GovernanceStatsCard({ stats, loading }: GovernanceStatsProps) {
    if (loading) {
        return (
            <AnimatedCard className="p-6 rounded-xl border bg-card shadow-sm animate-pulse h-48">
                <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 bg-muted rounded"></div>
                    <div className="h-16 bg-muted rounded"></div>
                </div>
            </AnimatedCard>
        );
    }

    return (
        <AnimatedCard className="p-6 rounded-xl border bg-card shadow-sm overflow-hidden relative">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-orange-600" />
                        Governance Overview
                    </h3>
                    <p className="text-sm text-muted-foreground">Active rules and enforcement actions</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-mono">
                    {stats?.activeRules || 0} Rules Active
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50">
                    <div className="flex justify-between items-start">
                        <span className="text-xs text-muted-foreground font-medium uppercase">Blocked Actions</span>
                        <FileWarning className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="mt-2 text-2xl font-bold text-red-700 dark:text-red-400">
                        {stats?.governanceAlerts || 0}
                    </div>
                    <div className="text-[10px] text-red-600/80 mt-1">
                        Last 30 days
                    </div>
                </div>

                <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/50">
                    <div className="flex justify-between items-start">
                        <span className="text-xs text-muted-foreground font-medium uppercase">Open Claims</span>
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="mt-2 text-2xl font-bold text-orange-700 dark:text-orange-400">
                        {stats?.openClaims || 0}
                    </div>
                    <div className="text-[10px] text-orange-600/80 mt-1">
                        Requires Attention
                    </div>
                </div>
            </div>
        </AnimatedCard>
    );
}
