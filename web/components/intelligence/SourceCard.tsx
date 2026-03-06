'use client';
import { Globe, Database, Radio } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated';

interface SourceProps {
    source: {
        id: string;
        name: string;
        type: string;
        baseUrl: string;
        isEnabled: boolean;
        trustScore: number;
    };
}

export function SourceCard({ source }: SourceProps) {
    return (
        <AnimatedCard className="p-4 flex flex-col justify-between h-full border-l-4 border-l-blue-500">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 leading-tight">{source.name}</h3>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{source.type}</p>
                        </div>
                    </div>
                    {source.isEnabled ? (
                        <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" title="Activo" />
                    ) : (
                        <span className="flex h-2 w-2 rounded-full bg-slate-300" title="Inactivo" />
                    )}
                </div>

                <div className="space-y-2 mt-4">
                    <div className="flex items-center text-sm text-slate-600 gap-2">
                        <Database className="w-4 h-4 text-slate-400" />
                        <span className="text-xs">Confianza: <span className="font-medium text-slate-900">{source.trustScore}%</span></span>
                    </div>
                </div>
            </div>

            {/* Auto-monitoring indicator */}
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span className="font-medium">Monitoreo automático activo</span>
            </div>
        </AnimatedCard>
    );
}

