'use client';

import { useState, useEffect } from 'react';
// import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SourceProfile {
    id: string;
    name: string;
    type: string;
    baseUrl: string;
    trustScore: number;
}

interface CrawlEvent {
    id: string;
    source: SourceProfile;
    startTime: string;
    status: string;
    itemsFound: number;
}

export function IntelligenceDashboard() {
    const [sources, setSources] = useState<SourceProfile[]>([]);
    const [events, setEvents] = useState<CrawlEvent[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [sourcesRes, eventsRes] = await Promise.all([
                fetch('/api/intelligence/sources'),
                fetch('/api/intelligence/crawl/events')
            ]);
            setSources(await sourcesRes.json());
            setEvents(await eventsRes.json());
        } catch (e) {
            console.error('Failed to fetch intelligence data', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const triggerCrawl = async (sourceId: string, url: string) => {
        await fetch('/api/intelligence/crawl/trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sourceId, url })
        });
        // Refresh events after a delay
        setTimeout(fetchData, 2000);
    };

    if (loading) return <div>Loading Intelligence...</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sources Card */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow border border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-xl font-bold mb-4">Active Sources</h2>
                    <div className="space-y-3">
                        {sources.map(source => (
                            <div key={source.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded">
                                <div>
                                    <div className="font-medium">{source.name}</div>
                                    <div className="text-xs text-zinc-500">{source.baseUrl} • Trust: {source.trustScore}</div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => triggerCrawl(source.id, source.baseUrl)}
                                >
                                    Crawl Now
                                </Button>
                            </div>
                        ))}
                        {sources.length === 0 && <div className="text-zinc-500">No sources configured.</div>}
                    </div>
                </div>

                {/* Recent Activity Card */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow border border-zinc-200 dark:border-zinc-800">
                    <h2 className="text-xl font-bold mb-4">Crawler Activity</h2>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {events.map(event => (
                            <div key={event.id} className="text-sm p-2 border-b border-zinc-100 dark:border-zinc-800">
                                <div className="flex justify-between">
                                    <span className="font-semibold">{event.source?.name || 'Unknown Source'}</span>
                                    <span className={`
                                px-2 py-0.5 rounded text-xs
                                ${event.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : ''}
                                ${event.status === 'FAILED' ? 'bg-red-100 text-red-800' : ''}
                                ${event.status === 'RUNNING' ? 'bg-blue-100 text-blue-800' : ''}
                            `}>
                                        {event.status}
                                    </span>
                                </div>
                                <div className="text-zinc-500 mt-1 flex justify-between">
                                    <span>Found: {event.itemsFound} items</span>
                                    <span>{new Date(event.startTime).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
