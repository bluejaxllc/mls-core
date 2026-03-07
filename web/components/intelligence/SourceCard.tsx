'use client';
import { Globe, Database, Radio, Power } from 'lucide-react';
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
    onToggle?: (id: string) => void;
}

export function SourceCard({ source, onToggle }: SourceProps) {
    return (
        <AnimatedCard className={`p-4 flex flex-col justify-between h-full border-l-4 transition-opacity duration-300 ${source.isEnabled ? 'border-l-blue-500' : 'border-l-slate-300 opacity-60'}`}>
            <div>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${source.isEnabled ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                            <Globe className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className={`font-semibold leading-tight ${source.isEnabled ? 'text-slate-900' : 'text-slate-400'}`}>{source.name}</h3>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{source.type}</p>
                        </div>
                    </div>
                    {/* Toggle Switch */}
                    <button
                        onClick={() => onToggle?.(source.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${source.isEnabled ? 'bg-blue-500' : 'bg-slate-300'}`}
                        aria-label={source.isEnabled ? 'Desactivar fuente' : 'Activar fuente'}
                    >
                        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${source.isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>

                <div className="space-y-2 mt-4">
                    <div className="flex items-center text-sm text-slate-600 gap-2">
                        <Database className="w-4 h-4 text-slate-400" />
                        <span className="text-xs">Confianza: <span className="font-medium text-slate-900">{source.trustScore}%</span></span>
                    </div>
                </div>
            </div>

            {/* Status indicator */}
            {source.isEnabled ? (
                <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span className="font-medium">Monitoreo automático activo</span>
                </div>
            ) : (
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                    <Power className="w-3.5 h-3.5" />
                    <span className="font-medium">Desactivado</span>
                </div>
            )}
        </AnimatedCard>
    );
}
