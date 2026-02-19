
'use client';

import { useState } from 'react';
import { AnimatedButton } from '@/components/ui/animated';
import { AlertTriangle, CheckCircle, Loader2, Scale, FileWarning, Shield } from 'lucide-react';

interface ClaimFormProps {
    listingId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const CLAIM_TYPES = [
    { value: 'OWNERSHIP', label: 'Disputa de Propiedad', icon: Scale },
    { value: 'DUPLICATE', label: 'Listado Duplicado', icon: FileWarning },
    { value: 'INACCURATE_DATA', label: 'Datos Incorrectos', icon: AlertTriangle },
    { value: 'SPAM', label: 'Spam / Fraude', icon: Shield },
];

export function ClaimForm({ listingId: initialListingId = '', onSuccess, onCancel }: ClaimFormProps) {
    const [listingId, setListingId] = useState(initialListingId);
    const [type, setType] = useState('OWNERSHIP');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setResult(null);

        try {
            const res = await fetch('/api/governance/claims', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    listingId,
                    type,
                    notes,
                    evidence: { notes }
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Error al enviar reclamo');
            }

            setResult(data);
            if (onSuccess) onSuccess();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (result) {
        return (
            <div className="p-6 border rounded-xl bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20 space-y-4 text-center">
                <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold">Reclamo Enviado Exitosamente</h3>
                <p className="text-sm text-muted-foreground">
                    ID del Reclamo: <span className="font-mono">{result.claim?.id?.substring(0, 12)}</span>
                </p>
                {result.governanceResults && (
                    <div className="bg-muted/50 p-3 rounded-lg text-left text-xs font-mono overflow-auto max-h-32">
                        <pre>{JSON.stringify(result.governanceResults, null, 2)}</pre>
                    </div>
                )}
                <AnimatedButton onClick={onCancel} className="w-full mt-4">Cerrar</AnimatedButton>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-5 border rounded-xl bg-gradient-to-br from-red-500/5 to-amber-500/5 border-red-500/20">
            <div className="space-y-2">
                <h3 className="font-bold text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Nuevo Reclamo de Gobernanza
                </h3>
                <p className="text-xs text-muted-foreground">
                    Reporta problemas de propiedad, datos incorrectos, listados duplicados o fraude.
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">ID del Listado *</label>
                <input
                    type="text"
                    value={listingId}
                    onChange={(e) => setListingId(e.target.value)}
                    className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    placeholder="PROP-..."
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Tipo de Reclamo</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                >
                    {CLAIM_TYPES.map(ct => (
                        <option key={ct.value} value={ct.value}>{ct.label}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Evidencia / Notas *</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full min-h-[80px] px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    placeholder="Describe el problema con detalle..."
                    required
                />
            </div>

            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-lg border border-red-500/20">
                    {error}
                </div>
            )}

            <div className="flex gap-2 pt-2">
                <AnimatedButton type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
                    Cancelar
                </AnimatedButton>
                <AnimatedButton type="submit" variant="primary" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enviar Reclamo
                </AnimatedButton>
            </div>
        </form>
    );
}
