'use client';

import { Lock, AlertTriangle, Eye, Globe, Share2 } from 'lucide-react';
import { useState } from 'react';

export default function ListingPage({ params }: { params: { id: string } }) {
    const [price, setPrice] = useState('45000000');

    return (
        <div>
            {/* Header */}
            <div className="bg-card border-b p-6 flex justify-between items-start sticky top-0 z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded bg-green-900/40 text-green-200 text-[10px] font-mono border border-green-800">
                            VERIFIED LISTING
                        </span>
                        <span className="text-xs font-mono text-muted-foreground">ID: {params.id}</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Luxury Office Floor in Reforma
                    </h1>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded bg-background hover:bg-muted">
                        <Globe className="h-4 w-4" /> Public: ON
                    </button>
                    <button className="flex items-center gap-2 px-4 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="p-6 grid gap-8 max-w-4xl">
                {/* Trust Indicator */}
                <div className="rounded-lg border bg-blue-950/10 p-4 flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                        94
                    </div>
                    <div>
                        <h4 className="font-semibold text-blue-400">High Trust Score</h4>
                        <p className="text-sm text-muted-foreground">This listing allows automatic verification updates. Maintain high quality data to keep this score.</p>
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Price (MXN)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full bg-muted/50 border rounded px-3 py-2 font-mono"
                                />
                                {/* Interactive Warning if price changes too much - Simulated */}
                                {price !== '45000000' && (
                                    <div className="absolute right-2 top-2 text-yellow-500 animate-pulse">
                                        <AlertTriangle className="h-5 w-5" />
                                    </div>
                                )}
                            </div>
                            {price !== '45000000' && (
                                <p className="text-xs text-yellow-500">Warning: Significant price drift detected. May trigger governance review.</p>
                            )}
                        </div>

                        <div className="space-y-2 opacity-70">
                            <label className="text-sm font-medium flex items-center gap-2">
                                Address <Lock className="h-3 w-3" />
                            </label>
                            <input disabled value="Av. Paseo de la Reforma 483" className="w-full bg-muted border rounded px-3 py-2 text-muted-foreground cursor-not-allowed" />
                            <p className="text-xs text-muted-foreground">Locked by Immutability Rule (Verified Asset)</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            className="w-full bg-muted/50 border rounded px-3 py-2 h-32"
                            defaultValue="Premium office space with panoramic views. LEED Gold certified building..."
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
