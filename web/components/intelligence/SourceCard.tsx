'use client';
import { useState } from 'react';
import { Play, Globe, CheckCircle, XCircle, Database } from 'lucide-react';
import { AnimatedCard, AnimatedButton } from '@/components/ui/animated';
import { authFetch } from '@/lib/api';
import { useSession } from 'next-auth/react';

interface SourceProps {
    source: {
        id: string;
        name: string;
        type: string;
        baseUrl: string;
        isEnabled: boolean;
        trustScore: number;
    };
    onTrigger?: () => void;
}

export function SourceCard({ source }: SourceProps) {
    const { data: session } = useSession();
    const [isRunning, setIsRunning] = useState(false);
    const [lastRunStatus, setLastRunStatus] = useState<'success' | 'error' | null>(null);

    const handleRun = async () => {
        setIsRunning(true);
        setLastRunStatus(null);
        try {
            // Check if we have a valid session, otherwise use mock token for dev
            const token = (session as any)?.accessToken;

            await authFetch('/api/intelligence/crawl/trigger', {
                method: 'POST',
                body: JSON.stringify({
                    sourceId: source.id,
                    url: source.baseUrl // Default to base URL for full crawl
                })
            }, token);

            setLastRunStatus('success');
            setTimeout(() => setLastRunStatus(null), 3000);
        } catch (error) {
            console.error('Crawl trigger failed', error);
            setLastRunStatus('error');
        } finally {
            setIsRunning(false);
        }
    };

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
                        <span className="flex h-2 w-2 rounded-full bg-green-500" title="Active" />
                    ) : (
                        <span className="flex h-2 w-2 rounded-full bg-slate-300" title="Inactive" />
                    )}
                </div>

                <div className="space-y-2 mt-4">
                    <div className="flex items-center text-sm text-slate-600 gap-2">
                        <Database className="w-4 h-4 text-slate-400" />
                        <span className="text-xs">Confianza: <span className="font-medium text-slate-900">{source.trustScore}%</span></span>
                    </div>

                </div>
            </div>

            <div className="mt-6">
                <AnimatedButton
                    onClick={handleRun}
                    disabled={isRunning || !source.isEnabled}
                    variant={lastRunStatus === 'success' ? 'secondary' : 'primary'}
                    className={`w-full flex items-center justify-center gap-2 text-sm ${lastRunStatus === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/20' : ''}`}
                >
                    {isRunning ? (
                        <>Iniciando...</>
                    ) : lastRunStatus === 'success' ? (
                        <><CheckCircle className="w-4 h-4" /> Iniciado</>
                    ) : (
                        <><Play className="w-4 h-4" /> Ejecutar Crawler</>
                    )}
                </AnimatedButton>
                {lastRunStatus === 'error' && (
                    <p className="text-xs text-red-500 text-center mt-2 flex items-center justify-center gap-1">
                        <XCircle className="w-3 h-3" /> Error al iniciar
                    </p>
                )}
            </div>
        </AnimatedCard>
    );
}
