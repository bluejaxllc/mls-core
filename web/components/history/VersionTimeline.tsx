import { GitCommit, User, AlertCircle, ArrowRight } from 'lucide-react';

export function VersionTimeline() {
    const versions = [
        { id: 'v5', date: 'Just now', author: 'Broker Admin', action: 'Update Price', diff: 'Price: 42M -> 45M', status: 'Pending Verification' },
        { id: 'v4', date: '2 days ago', author: 'System Rule', action: 'Auto-Correction', diff: 'Status: Active -> Suspended', status: 'Governed', highlight: true },
        { id: 'v3', date: '1 week ago', author: 'Broker Agent', action: 'New Photos', diff: '+5 images added', status: 'Verified' },
    ];

    return (
        <div className="border rounded-lg bg-card p-6">
            <h3 className="font-semibold mb-6 flex items-center gap-2">
                <GitCommit className="h-5 w-5" /> Version History
            </h3>

            <div className="space-y-8 relative">
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-border z-0"></div>

                {versions.map((v) => (
                    <div key={v.id} className="relative z-10 flex gap-4">
                        <div className={`mt-1 h-10 w-10 text-xs rounded-full flex items-center justify-center border-4 border-background ${v.highlight ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/10' : 'bg-muted text-muted-foreground'}`}>
                            {v.id}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-medium text-sm flex items-center gap-2">
                                        {v.action}
                                        {v.highlight && <AlertCircle className="h-3 w-3 text-yellow-500" />}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                        <User className="h-3 w-3" /> {v.author} • {v.date}
                                    </p>
                                </div>
                                <span className="text-[10px] uppercase font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
                                    {v.status}
                                </span>
                            </div>
                            <div className="mt-2 p-3 bg-muted/30 rounded border border-dashed text-xs font-mono text-muted-foreground flex items-center gap-2">
                                {v.diff}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
