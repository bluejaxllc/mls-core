'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Info, XCircle, CheckCircle2, Eye, X } from 'lucide-react';

interface Signal {
    id: string;
    type: string;
    severity: string;
    status: string;
    payload: any;
    observedListing?: {
        title: string;
        price: number;
        snapshot?: {
            source?: { name: string }
        }
    };
    createdAt: string;
}

export function SignalReview() {
    const [signals, setSignals] = useState<Signal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/intelligence/observed')
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                // Map observed listings to signal-like format if no signals endpoint
                const signalList = Array.isArray(data) ? data : (data?.signals || []);
                setSignals(signalList);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const severityIcon = (severity: string) => {
        switch (severity) {
            case 'CRITICAL': return <XCircle className="w-4 h-4 text-red-400" />;
            case 'WARNING': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
            default: return <Info className="w-4 h-4 text-blue-400" />;
        }
    };

    const severityBadge = (severity: string) => {
        const colors: Record<string, string> = {
            CRITICAL: 'bg-red-500/10 text-red-400 border-red-500/20',
            WARNING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            INFO: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        };
        return colors[severity] || 'bg-muted/50 text-muted-foreground border-transparent';
    };

    const statusBadge = (status: string) => {
        const colors: Record<string, string> = {
            OPEN: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            REVIEWED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            DISMISSED: 'bg-muted/50 text-muted-foreground border-transparent',
            ACTED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        };
        return colors[status] || 'bg-muted/50 text-muted-foreground border-transparent';
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2].map(i => (
                    <div key={i} className="h-16 bg-muted/50 animate-pulse rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="bg-card border border-blue-500/10 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-blue-500/10 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Signal Queue</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-muted/50 text-muted-foreground">
                    {signals.length} signal{signals.length !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="divide-y divide-blue-500/5">
                {signals.map(signal => (
                    <div key={signal.id} className="px-5 py-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-start gap-3">
                            {severityIcon(signal.severity)}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${severityBadge(signal.severity)}`}>
                                        {signal.severity}
                                    </span>
                                    <span className="text-xs font-mono text-muted-foreground">{signal.type}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusBadge(signal.status)}`}>
                                        {signal.status}
                                    </span>
                                </div>
                                <p className="text-sm font-medium">
                                    {signal.observedListing?.title || 'Unknown Property'}
                                    {signal.observedListing?.snapshot?.source?.name && (
                                        <span className="text-muted-foreground font-normal ml-2">
                                            via {signal.observedListing.snapshot.source.name}
                                        </span>
                                    )}
                                </p>
                                {signal.observedListing?.price && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        ${signal.observedListing.price.toLocaleString()}
                                    </p>
                                )}
                                <p className="text-[10px] text-muted-foreground mt-1">
                                    {new Date(signal.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="flex gap-1">
                                <button className="p-1.5 rounded-lg hover:bg-blue-500/10 text-muted-foreground hover:text-blue-400 transition-colors" title="Review">
                                    <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors" title="Dismiss">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {signals.length === 0 && (
                    <div className="p-10 text-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm font-medium">No active signals requiring review</p>
                        <p className="text-muted-foreground text-xs mt-1">Signals appear when crawlers detect duplicates, price changes, or new listings</p>
                    </div>
                )}
            </div>
        </div>
    );
}
