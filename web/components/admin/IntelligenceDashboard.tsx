'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Activity, AlertCircle, CheckCircle2, Clock, Database, Radio, Globe, Zap } from 'lucide-react';

interface SourceProfile {
    id: string;
    name: string;
    type: string;
    baseUrl: string;
    trustScore: number;
    isEnabled: boolean;
    createdAt: string;
    _count?: { snapshots: number; crawlEvents: number };
}

interface CrawlEvent {
    id: string;
    sourceId: string;
    source?: { name: string };
    startTime: string;
    endTime?: string;
    status: string;
    itemsFound: number;
    itemsNew: number;
    errors?: string;
}

export function IntelligenceDashboard() {
    const [sources, setSources] = useState<SourceProfile[]>([]);
    const [events, setEvents] = useState<CrawlEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalSnapshots: 0, totalEvents: 0 });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [sourcesRes, eventsRes] = await Promise.all([
                fetch('/api/intelligence/sources').then(r => r.ok ? r.json() : []).catch(() => []),
                fetch('/api/intelligence/crawl/events').then(r => r.ok ? r.json() : []).catch(() => []),
            ]);

            const sourceList = Array.isArray(sourcesRes) ? sourcesRes : (sourcesRes?.sources || []);
            const eventList = Array.isArray(eventsRes) ? eventsRes : (eventsRes?.events || []);

            setSources(sourceList);
            setEvents(eventList.slice(0, 20));

            const totalSnapshots = sourceList.reduce((sum: number, s: any) => sum + (s._count?.snapshots || 0), 0);
            setStats({ totalSnapshots, totalEvents: eventList.length });
        } catch (e) {
            console.error('[Intelligence Admin]', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const statusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'RUNNING': return <Radio className="w-4 h-4 text-blue-400 animate-pulse" />;
            case 'FAILED': return <AlertCircle className="w-4 h-4 text-red-400" />;
            default: return <Clock className="w-4 h-4 text-muted-foreground" />;
        }
    };

    const statusBadge = (status: string) => {
        const colors: Record<string, string> = {
            COMPLETED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            RUNNING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            FAILED: 'bg-red-500/10 text-red-400 border-red-500/20',
        };
        return colors[status] || 'bg-muted/50 text-muted-foreground border-transparent';
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-muted/50 animate-pulse rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-card border border-blue-500/10 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10"><Globe className="w-5 h-5 text-blue-400" /></div>
                        <div>
                            <p className="text-2xl font-bold">{sources.length}</p>
                            <p className="text-xs text-muted-foreground">Active Sources</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card border border-blue-500/10 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-violet-500/10"><Database className="w-5 h-5 text-violet-400" /></div>
                        <div>
                            <p className="text-2xl font-bold">{stats.totalSnapshots.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Total Snapshots</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card border border-blue-500/10 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10"><Activity className="w-5 h-5 text-emerald-400" /></div>
                        <div>
                            <p className="text-2xl font-bold">{events.length}</p>
                            <p className="text-xs text-muted-foreground">Recent Crawls</p>
                        </div>
                    </div>
                </div>
                <div className="bg-card border border-blue-500/10 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/10"><Zap className="w-5 h-5 text-amber-400" /></div>
                        <div>
                            <p className="text-2xl font-bold">{stats.totalEvents}</p>
                            <p className="text-xs text-muted-foreground">Total Crawl Events</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sources Table */}
            <div className="bg-card border border-blue-500/10 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-blue-500/10">
                    <h3 className="text-sm font-semibold">Source Profiles</h3>
                    <button onClick={fetchData} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/50 hover:bg-muted transition-colors">
                        <RefreshCw className="w-3.5 h-3.5" /> Refresh
                    </button>
                </div>
                {sources.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">No source profiles configured yet.</div>
                ) : (
                    <div className="divide-y divide-blue-500/5">
                        {sources.map(src => (
                            <div key={src.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors">
                                <div className={`w-2 h-2 rounded-full ${src.isEnabled ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{src.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{src.baseUrl}</p>
                                </div>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground font-mono">{src.type}</span>
                                <div className="text-right">
                                    <p className="text-sm font-semibold">{(src._count?.snapshots || 0).toLocaleString()}</p>
                                    <p className="text-[10px] text-muted-foreground">snapshots</p>
                                </div>
                                <div className="w-16">
                                    <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" style={{ width: `${src.trustScore}%` }} />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground text-center mt-1">Trust: {src.trustScore}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Crawl Events Timeline */}
            <div className="bg-card border border-blue-500/10 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-blue-500/10">
                    <h3 className="text-sm font-semibold">Recent Crawl Events</h3>
                </div>
                {events.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">No crawl events recorded yet.</div>
                ) : (
                    <div className="divide-y divide-blue-500/5">
                        {events.map(ev => (
                            <div key={ev.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors">
                                {statusIcon(ev.status)}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">{ev.source?.name || ev.sourceId?.slice(0, 8) || 'Unknown'}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(ev.startTime).toLocaleString()}
                                        {ev.endTime && ` → ${new Date(ev.endTime).toLocaleTimeString()}`}
                                    </p>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${statusBadge(ev.status)}`}>
                                    {ev.status}
                                </span>
                                <div className="text-right min-w-[80px]">
                                    <p className="text-sm font-semibold">{ev.itemsFound.toLocaleString()} found</p>
                                    {ev.itemsNew > 0 && <p className="text-xs text-emerald-500">+{ev.itemsNew} new</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
