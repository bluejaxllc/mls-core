'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { authFetch } from '@/lib/api';

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

    useEffect(() => {
        authFetch('/api/intelligence/signals')
            .then(setSignals)
            .catch(console.error);
    }, []);

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h2 className="text-xl font-bold">Detected Signals queue</h2>
            </div>

            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {signals.map(signal => (
                    <div key={signal.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className={`
                            px-2 py-1 rounded text-xs font-bold
                            ${signal.severity === 'WARNING' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}
                        `}>
                                    {signal.severity}
                                </span>
                                <span className="font-mono text-sm text-zinc-500">{signal.type}</span>
                            </div>
                            <span className="text-xs text-zinc-400">{new Date(signal.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="ml-0 md:ml-2">
                            <div className="text-sm font-medium mb-1">
                                {signal.observedListing?.title || 'Unknown Property'}
                                <span className="text-zinc-400 font-normal ml-2">
                                    via {signal.observedListing?.snapshot?.source?.name}
                                </span>
                            </div>

                            <div className="bg-zinc-100 dark:bg-black/20 p-2 rounded text-xs font-mono text-zinc-600 dark:text-zinc-400 mb-3">
                                {JSON.stringify(signal.payload, null, 2)}
                            </div>

                            <div className="flex gap-2">
                                <Button size="sm" variant="default">Review</Button>
                                <Button size="sm" variant="ghost">Dismiss</Button>
                            </div>
                        </div>
                    </div>
                ))}
                {signals.length === 0 && (
                    <div className="p-8 text-center text-zinc-500">
                        No active signals requiring review.
                    </div>
                )}
            </div>
        </div>
    );
}
