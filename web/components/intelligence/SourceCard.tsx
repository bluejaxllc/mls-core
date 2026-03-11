'use client';
import { Globe, Database, Radio, Power } from 'lucide-react';
import { AnimatedCard } from '@/components/ui/animated';

// Source-specific visual config
const SOURCE_VISUALS: Record<string, { icon: string; color: string; bgColor: string; borderColor: string }> = {
    'Facebook Marketplace': { icon: '📘', color: 'text-[#1877F2]', bgColor: 'bg-[#1877F2]/10', borderColor: 'border-l-[#1877F2]' },
    'Mercado Libre': { icon: '🟡', color: 'text-amber-600', bgColor: 'bg-amber-500/10', borderColor: 'border-l-[#FFE600]' },
    'Inmuebles24': { icon: '🏠', color: 'text-[#E4002B]', bgColor: 'bg-[#E4002B]/10', borderColor: 'border-l-[#E4002B]' },
    'Lamudi': { icon: '🏡', color: 'text-[#00A651]', bgColor: 'bg-[#00A651]/10', borderColor: 'border-l-[#00A651]' },
    'Vivanuncios': { icon: '🏘️', color: 'text-[#7B2D8E]', bgColor: 'bg-[#7B2D8E]/10', borderColor: 'border-l-[#7B2D8E]' },
};

interface SourceSummary {
    name: string;
    count: number;
    enabled: boolean;
}

interface SourceProps {
    source: SourceSummary;
    onToggle?: (name: string) => void;
}

export function SourceCard({ source, onToggle }: SourceProps) {
    const visuals = SOURCE_VISUALS[source.name] || { icon: '🌐', color: 'text-teal-600', bgColor: 'bg-teal-500/10', borderColor: 'border-l-teal-500' };

    return (
        <AnimatedCard className={`p-4 flex flex-col justify-between h-full border-l-4 transition-opacity duration-300 ${source.enabled ? visuals.borderColor : 'border-l-slate-300 opacity-60'}`}>
            <div>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg text-lg ${source.enabled ? visuals.bgColor : 'bg-slate-100'}`}>
                            {visuals.icon}
                        </div>
                        <div>
                            <h3 className={`font-semibold leading-tight ${source.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>{source.name}</h3>
                        </div>
                    </div>
                    {/* Toggle Switch */}
                    <button
                        onClick={() => onToggle?.(source.name)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${source.enabled ? 'bg-blue-500' : 'bg-slate-300'}`}
                        aria-label={source.enabled ? 'Desactivar fuente' : 'Activar fuente'}
                    >
                        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${source.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>

            {/* Status indicator */}
            {source.enabled ? (
                <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span className="font-medium">Activo</span>
                </div>
            ) : (
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
                    <Power className="w-3.5 h-3.5" />
                    <span className="font-medium">Desactivado</span>
                </div>
            )}
        </AnimatedCard>
    );
}
